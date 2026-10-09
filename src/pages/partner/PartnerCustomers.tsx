import { useState } from 'react';
import { Search, MessageCircle, AlertTriangle, DollarSign, Clock, Users2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, EmptyState } from '@/components/Shared';
import { formatCurrency, formatDate } from '@/utils/helpers';

export function PartnerCustomers() {
  const { currentUser, customers } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');

  const myCustomers = customers.filter(c => c.partnerId === currentUser?.partnerId);
  const filtered = myCustomers.filter(c =>
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.companyName.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'All' || c.status === statusFilter) &&
    (planFilter === 'All' || c.planType === planFilter)
  );

  const totalEarned = myCustomers.reduce((s, c) => s + c.commissionEarned, 0);
  const blockedCommission = myCustomers.filter(c => c.status === 'Unpaid').reduce((s, c) => s + (c.subscriptionAmount * c.commissionRate / 100), 0);

  return (
    <div className="space-y-6">
      <SectionHeader title="My Customers" subtitle={`${myCustomers.length} customers referred by you`} />

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm"><Users2 className="h-4 w-4" /> Total</div>
          <p className="text-2xl font-display font-bold text-gray-900 mt-1">{myCustomers.length}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-emerald-600 text-sm"><DollarSign className="h-4 w-4" /> Earned</div>
          <p className="text-2xl font-display font-bold text-gray-900 mt-1">{formatCurrency(totalEarned)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-amber-600 text-sm"><AlertTriangle className="h-4 w-4" /> Blocked</div>
          <p className="text-2xl font-display font-bold text-gray-900 mt-1">{formatCurrency(blockedCommission)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-blue-600 text-sm"><Clock className="h-4 w-4" /> Active</div>
          <p className="text-2xl font-display font-bold text-gray-900 mt-1">{myCustomers.filter(c => c.status === 'Active').length}</p>
        </div>
      </div>

      {/* Unpaid warning banner */}
      {myCustomers.some(c => c.status === 'Unpaid') && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Commission Blocked for Unpaid Customers</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {myCustomers.filter(c => c.status === 'Unpaid').length} customer(s) have unpaid subscriptions. Commission for this month has been automatically deducted/blocked. Commission will resume once payment is received.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or company..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-36">
          <option>All</option>
          <option>Active</option>
          <option>Unpaid</option>
        </select>
        <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="input-field sm:w-36">
          <option>All</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Search} title="No customers found" message="Try adjusting your search or filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">WhatsApp</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Plan Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Start Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Renewal Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Commission %</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Commission Earned</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Commission End Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.companyName}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{c.email}</td>
                    <td className="px-4 py-3">
                      <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
                        <MessageCircle className="h-3 w-3" />
                        Chat
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${c.planType === 'Yearly' ? 'badge-zubkas' : 'badge-neutral'}`}>{c.planType}</span>
                      <span className="text-xs text-gray-500 ml-1">{c.planTier}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(c.startDate)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(c.renewalDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-error'}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-zubkas-700">{c.commissionRate}%</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-gray-900">{formatCurrency(c.commissionEarned)}</span>
                      {c.planType === 'Monthly' && (
                        <p className="text-[10px] text-gray-400">{c.remainingMonths}/12 months left</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(c.commissionEndDate)}
                      {c.planType === 'Monthly' && c.remainingMonths === 0 && (
                        <span className="block text-[10px] text-zubkas-700 font-medium">Cap reached</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
