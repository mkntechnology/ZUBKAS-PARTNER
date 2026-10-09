import { type LucideIcon } from 'lucide-react';

interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  active: string;
  onNavigate: (key: string) => void;
  open: boolean;
  onClose: () => void;
  userName: string;
  userRole: string;
  variant: 'admin' | 'partner';
}

export function Sidebar({ items, active, onNavigate, open, onClose, userName, userRole, variant }: SidebarProps) {
  const accentText = variant === 'admin' ? 'text-zubkas-700' : 'text-zubkas-700';

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}

      <aside className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-gray-100 bg-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zubkas-700 text-white font-display font-bold text-lg shadow-md">
              Z
            </div>
            <div>
              <p className="font-display text-base font-bold text-gray-900 leading-tight">Zubkas</p>
              <p className="text-[10px] text-gray-400 leading-tight">Partner Program</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 lg:hidden">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className={`px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider ${accentText}`}>
            {variant === 'admin' ? 'Admin Panel' : 'Partner Portal'}
          </p>
          <div className="space-y-1">
            {items.map(item => {
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { onNavigate(item.key); onClose(); }}
                  className={`nav-item w-full ${isActive ? 'nav-item-active' : ''}`}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-zubkas-700 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User info */}
        <div className="border-t border-gray-100 px-3 py-3">
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 bg-gray-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zubkas-700 text-xs font-bold text-white">
              {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{userName}</p>
              <p className="truncate text-[10px] text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
