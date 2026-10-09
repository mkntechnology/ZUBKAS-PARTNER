import { useState } from 'react';
import { UserPlus, Search, Crown, Star, Award, Rocket, Trash2, Eye, TriangleAlert as AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, EmptyState } from '@/components/Shared';
import { Modal } from '@/components/Modal';
import { formatCurrency, formatDate, getInitials } from '@/utils/helpers';
import type { Partner } from '@/types';

const badgeIcons: Record<string, typeof Crown> = { 'Top Performer': Crown, 'Rising Star': Star, 'Consistent Earner': Award, 'New Champion': Rocket };

export function AdminPartners() {
  const { partners, customers, leads, transactions, categories, addPartner, deletePartner } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [viewPartner, setViewPartner] = useState<Partner | null>(null);
  const [deletePartnerTarget, setDeletePartnerTarget] = useState<Partner | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', category: categories[0]?.name ?? '' });

  const filtered = partners.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.company.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'All' || p.status === statusFilter)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPartner({ name: form.name, email: form.email, phone: form.phone, company: form.company, category: form.category, status: 'Active', joinedDate: new Date().toISOString().split('T')[0] });
    setForm({ name: '', email: '', phone: '', company: '', category: categories[0]?.name ?? '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Partner Management"
        subtitle="Create and manage partner accounts"
        action={<button onClick={() => setShowAdd(true)} className="btn-primary"><UserPlus className="h-4 w-4" /> Add Partner</button>}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or company..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-40">
          <option>All</option>
          <option>Active</option>
          <option>Suspended</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={UserPlus} title="No partners found" message="Try adjusting your search or filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Partner</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customers</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Monthly Sales</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Total Commission</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Joined</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zubkas-700 text-xs font-bold text-white">{getInitials(p.name)}</div>
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.company}</p>
                        </div>
                        {p.badge && (() => { const Icon = badgeIcons[p.badge] ?? Star; return <Icon className="h-4 w-4 text-amber-500" />; })()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.category}</td>
                    <td className="px-4 py-3 text-gray-600">{p.activeCustomers}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(p.monthlySales)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(p.totalCommission)}</td>
                    <td className="px-4 py-3"><span className={`badge ${p.status === 'Active' ? 'badge-success' : p.status === 'Suspended' ? 'badge-error' : 'badge-warning'}`}>{p.status}</span></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(p.joinedDate)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewPartner(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-zubkas-700 transition-colors" title="View details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setDeletePartnerTarget(p); setDeleteConfirmText(''); }} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete partner">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Partner Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Partner Account">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Partner Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1" placeholder="Full name" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field mt-1" placeholder="partner@email.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field mt-1" placeholder="+91 ..." />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Company Name</label>
            <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field mt-1" placeholder="Company Pvt Ltd" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field mt-1">
              {categories.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="rounded-lg bg-zubkas-50 p-3 text-xs text-zubkas-700">
            Partners cannot self-register. Only admins and employees can create partner accounts.
          </div>
          <button type="submit" className="btn-primary w-full">Create Partner Account</button>
        </form>
      </Modal>

      {/* View Partner Modal */}
      <Modal open={!!viewPartner} onClose={() => setViewPartner(null)} title="Partner Details" size="lg">
        {viewPartner && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zubkas-700 text-lg font-bold text-white">{getInitials(viewPartner.name)}</div>
              <div>
                <h3 className="font-display text-lg font-bold text-gray-900">{viewPartner.name}</h3>
                <p className="text-sm text-gray-500">{viewPartner.company}</p>
                {viewPartner.badge && <span className="badge badge-zubkas mt-1">{viewPartner.badge}</span>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Email', value: viewPartner.email },
                { label: 'Phone', value: viewPartner.phone },
                { label: 'Category', value: viewPartner.category },
                { label: 'Status', value: viewPartner.status },
                { label: 'Joined Date', value: formatDate(viewPartner.joinedDate) },
                { label: 'Active Customers', value: String(viewPartner.activeCustomers) },
                { label: 'Monthly Sales', value: formatCurrency(viewPartner.monthlySales) },
                { label: 'Total Commission', value: formatCurrency(viewPartner.totalCommission) },
                { label: 'Monthly Commission', value: formatCurrency(viewPartner.monthlyCommission) },
                { label: 'Pending Commission', value: formatCurrency(viewPartner.pendingCommission) },
              ].map(f => (
                <div key={f.label} className="rounded-lg border border-gray-50 p-3">
                  <p className="text-xs text-gray-500">{f.label}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Customers ({customers.filter(c => c.partnerId === viewPartner.id).length})</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {customers.filter(c => c.partnerId === viewPartner.id).map(c => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                    <span className="font-medium text-gray-900">{c.name}</span>
                    <span className="text-gray-500">{c.companyName}</span>
                    <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-error'}`}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deletePartnerTarget} onClose={() => { setDeletePartnerTarget(null); setDeleteConfirmText(''); }} title="Delete Partner Account" size="sm">
        {deletePartnerTarget && (
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">This action cannot be undone.</p>
                <p className="text-xs text-red-700 mt-1">
                  Deleting <span className="font-semibold">{deletePartnerTarget.name}</span> ({deletePartnerTarget.company}) will permanently remove:
                </p>
                <ul className="mt-2 space-y-0.5 text-xs text-red-700">
                  <li>• {customers.filter(c => c.partnerId === deletePartnerTarget.id).length} customer record(s)</li>
                  <li>• {leads.filter(l => l.partnerId === deletePartnerTarget.id).length} lead record(s)</li>
                  <li>• {transactions.filter(t => t.partnerId === deletePartnerTarget.id).length} commission transaction(s)</li>
                  <li>• All associated notifications</li>
                </ul>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Type <span className="font-bold text-red-600">DELETE</span> to confirm
              </label>
              <input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="input-field mt-1"
                placeholder="DELETE"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setDeletePartnerTarget(null); setDeleteConfirmText(''); }}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deletePartner(deletePartnerTarget.id);
                  setDeletePartnerTarget(null);
                  setDeleteConfirmText('');
                }}
                disabled={deleteConfirmText !== 'DELETE'}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete Permanently
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
