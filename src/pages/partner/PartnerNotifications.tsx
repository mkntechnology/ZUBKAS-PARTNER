import { Bell, DollarSign, TrendingUp, Package, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, EmptyState } from '@/components/Shared';
import { formatDate } from '@/utils/helpers';
import type { Notification } from '@/types';

const typeConfig: Record<Notification['type'], { icon: typeof Bell; color: string; bg: string }> = {
  commission: { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  lead: { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  announcement: { icon: Package, color: 'text-zubkas-700', bg: 'bg-zubkas-50' },
  payment: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  system: { icon: Info, color: 'text-gray-600', bg: 'bg-gray-100' },
};

export function PartnerNotifications() {
  const { currentUser, notifications, markNotificationRead, markAllRead } = useApp();

  const myNotifs = notifications.filter(n =>
    n.userId === currentUser?.partnerId ||
    n.userId === currentUser?.id ||
    n.userId === 'broadcast'
  );
  const unreadCount = myNotifs.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notifications Center"
        subtitle={`${myNotifs.length} notifications · ${unreadCount} unread`}
        action={unreadCount > 0 ? <button onClick={markAllRead} className="btn-secondary">Mark all read</button> : undefined}
      />

      {myNotifs.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" message="You're all caught up!" />
      ) : (
        <div className="space-y-3">
          {myNotifs.map(n => {
            const cfg = typeConfig[n.type];
            const Icon = cfg.icon;
            return (
              <button
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`card w-full p-4 text-left flex items-start gap-4 transition-all ${!n.read ? 'border-l-4 border-l-zubkas-700' : 'opacity-70'}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                  <Icon className={`h-5 w-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-zubkas-700 shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(n.date)}</p>
                </div>
                {!n.read && <CheckCircle2 className="h-4 w-4 text-gray-300 shrink-0 mt-1" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
