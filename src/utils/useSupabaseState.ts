import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toSnakeRow, toCamelRow } from '@/utils/caseConvert';

/**
 * A React hook that mirrors useState but persists data to a Supabase table.
 * Loads initial data on mount, then syncs every update back to Supabase.
 * The setter works identically to useState (value or updater function).
 *
 * Automatically converts between camelCase (app types) and snake_case (DB columns).
 *
 * For "singleton" tables (app_settings, site_content), the entire row is
 * treated as a single document — the hook reads/writes the row with id='singleton'.
 */
export function useSupabaseState<T>(
  table: string,
  initialValue: T,
  options?: { singleton?: boolean; singletonColumn?: string }
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);
  const isInitialLoad = useRef(true);
  const skipNextWrite = useRef(false);

  // Load initial data from Supabase
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (options?.singleton) {
          const col = options.singletonColumn ?? 'content';
          const { data, error } = await supabase
            .from(table)
            .select(col)
            .eq('id', 'singleton')
            .maybeSingle();
          if (!cancelled && !error && data) {
            const val = (data as Record<string, unknown>)[col];
            if (val !== null && val !== undefined) {
              skipNextWrite.current = true;
              setState(val as T);
            }
          }
        } else {
          const { data, error } = await supabase.from(table).select('*');
          if (!cancelled && !error && data) {
            const camelData = (data as Record<string, unknown>[]).map(row =>
              toCamelRow<Record<string, unknown>>(row)
            );
            skipNextWrite.current = true;
            setState(camelData as unknown as T);
          }
        }
      } catch {
        // ignore — fall back to initialValue
      }
      if (!cancelled) {
        setLoaded(true);
        isInitialLoad.current = false;
      }
    })();
    return () => { cancelled = true; };
  }, [table, options?.singleton, options?.singletonColumn]);

  // Persist to Supabase on state change (skip initial load)
  useEffect(() => {
    if (isInitialLoad.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    (async () => {
      try {
        if (options?.singleton) {
          const col = options.singletonColumn ?? 'content';
          await supabase
            .from(table)
            .upsert({ id: 'singleton', [col]: state, updated_at: new Date().toISOString() });
        } else {
          const rows = state as unknown as Record<string, unknown>[];
          if (Array.isArray(rows)) {
            await supabase.from(table).delete().neq('id', '___impossible___');
            if (rows.length > 0) {
              const snakeRows = rows.map(r => toSnakeRow(r));
              await supabase.from(table).insert(snakeRows);
            }
          }
        }
      } catch {
        // ignore write errors
      }
    })();
  }, [state, table, options?.singleton, options?.singletonColumn]);

  const setSupabaseState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => (value instanceof Function ? (value as (prev: T) => T)(prev) : value));
  }, []);

  return [state, setSupabaseState, loaded];
}
