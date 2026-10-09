import { Megaphone, Pin, Package, Bell, Wrench, Info, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, EmptyState } from '@/components/Shared';
import { formatDate } from '@/utils/helpers';
import { useState } from 'react';
import type { Announcement } from '@/types';

const typeConfig: Record<Announcement['type'], { icon: typeof Package; color: string; bg: string; label: string }> = {
  product: { icon: Package, color: 'text-zubkas-700', bg: 'bg-zubkas-50', label: 'Product Launch' },
  update: { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Update' },
  maintenance: { icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Maintenance' },
  general: { icon: Info, color: 'text-gray-600', bg: 'bg-gray-100', label: 'General' },
};

export function PartnerAnnouncements() {
  const { announcements } = useApp();
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = announcements.filter(a => typeFilter === 'All' || a.type === typeFilter);
  const sorted = [...filtered].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="space-y-6">
      <SectionHeader title="Announcements & Updates" subtitle="Latest news, product launches, and important updates" />

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field sm:w-48">
          <option>All</option>
          <option value="product">Product Launch</option>
          <option value="update">Update</option>
          <option value="maintenance">Maintenance</option>
          <option value="general">General</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements found" message="Check back later for updates" />
      ) : (
        <div className="space-y-4">
          {sorted.map(a => {
            const cfg = typeConfig[a.type];
            const Icon = cfg.icon;
            return (
              <div key={a.id} className={`card p-5 ${a.isPinned ? 'border-l-4 border-l-zubkas-700' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                    <Icon className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-semibold text-gray-900">{a.title}</h3>
                      {a.isPinned && <span className="badge badge-zubkas"><Pin className="h-3 w-3" /> Pinned</span>}
                      <span className={`badge ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a.content}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <span className="font-medium text-gray-600">{a.author}</span>
                      <span>·</span>
                      <span>{a.authorRole}</span>
                      <span>·</span>
                      <span>{formatDate(a.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
