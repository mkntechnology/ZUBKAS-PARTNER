import { useState } from 'react';
import { Search, Lock, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, EmptyState } from '@/components/Shared';
import { formatDate, daysUntil } from '@/utils/helpers';

const statusConfig = {
  Locked: { icon: Lock, badge: 'badge-warning', text: 'text-amber-700' },
  Open: { icon: Clock, badge: 'badge-neutral', text: 'text-gray-600' },
  Converted: { icon: CheckCircle2, badge: 'badge-success', text: 'text-emerald-700' },
  Lost: { icon: XCircle, badge: 'badge-error', text: 'text-red-700' },
};

export function AdminLeads() {
  const { leads } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = leads.filter(l =>
    (l.companyName.toLowerCase().includes(search.toLowerCase()) || l.partnerName.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'All' || l.status === statusFilter)
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="All Leads" subtitle={`${leads.length} leads across all partners`} />

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {(['Locked', 'Open', 'Converted', 'Lost'] as const).map(s => {
          const cfg = statusConfig[s];
          const Icon = cfg.icon;
          const count = leads.filter(l => l.status === s).length;
          return (
            <div key={s} className="card p-4">
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${cfg.text}`} />
                <span className="text-2xl font-display font-bold text-gray-900">{count}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{s}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by company or partner..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-40">
          <option>All</option>
          <option>Locked</option>
          <option>Open</option>
          <option>Converted</option>
          <option>Lost</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Search} title="No leads found" message="Try adjusting your filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Contact</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Partner</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Submitted</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Lock Ends</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const cfg = statusConfig[l.status];
                  const Icon = cfg.icon;
                  const lockDaysLeft = daysUntil(l.lockEndDate);
                  return (
                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{l.companyName}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{l.contactName}</p>
                        <p className="text-xs text-gray-500">{l.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{l.partnerName}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(l.submittedDate)}</td>
                      <td className="px-4 py-3 text-xs">
                        {l.status === 'Locked' && lockDaysLeft > 0 ? (
                          <span className="text-amber-600 font-medium">{lockDaysLeft} day{lockDaysLeft > 1 ? 's' : ''} left</span>
                        ) : (
                          <span className="text-gray-400">{formatDate(l.lockEndDate)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${cfg.badge}`}>
                          <Icon className="h-3 w-3" />
                          {l.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{l.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
