import { useState } from 'react';
import { Plus, Lock, CheckCircle2, XCircle, Clock, AlertTriangle, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, EmptyState } from '@/components/Shared';
import { Modal } from '@/components/Modal';
import { formatDate, daysUntil } from '@/utils/helpers';

const statusConfig = {
  Locked: { icon: Lock, badge: 'badge-warning' },
  Open: { icon: Clock, badge: 'badge-neutral' },
  Converted: { icon: CheckCircle2, badge: 'badge-success' },
  Lost: { icon: XCircle, badge: 'badge-error' },
};

export function PartnerLeads() {
  const { currentUser, leads, settings, addLead } = useApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ companyName: '', contactName: '', email: '', phone: '', notes: '' });

  const myLeads = leads.filter(l => l.partnerId === currentUser?.partnerId);
  const filtered = myLeads.filter(l =>
    l.companyName.toLowerCase().includes(search.toLowerCase()) || l.contactName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = addLead({
      partnerId: currentUser?.partnerId ?? '',
      companyName: form.companyName,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      notes: form.notes,
    });
    if (result) {
      setSuccess(`Lead submitted! "${form.companyName}" is locked for ${settings.leadLockDays} days. Other partners cannot add this company during the lock period.`);
      setForm({ companyName: '', contactName: '', email: '', phone: '', notes: '' });
      setTimeout(() => { setShowAdd(false); setSuccess(''); }, 2500);
    } else {
      setError(`This company ("${form.companyName}") is currently locked by another partner. Please try again after the lock period ends.`);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Leads"
        subtitle={`${myLeads.length} leads submitted · ${settings.leadLockDays}-day lock period applies`}
        action={<button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> Submit New Lead</button>}
      />

      {/* Lead lock info banner */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
        <Lock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Lead Lock Protection</p>
          <p className="text-xs text-blue-700 mt-0.5">When you submit a lead, the company is locked for {settings.leadLockDays} days. During this period, other partners cannot add the same company. Convert your leads before the lock expires!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {(['Locked', 'Open', 'Converted', 'Lost'] as const).map(s => {
          const cfg = statusConfig[s];
          const Icon = cfg.icon;
          const count = myLeads.filter(l => l.status === s).length;
          return (
            <div key={s} className="card p-4">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-gray-400" />
                <span className="text-2xl font-display font-bold text-gray-900">{count}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{s}</p>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 sm:max-w-xs" />
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Search} title="No leads found" message="Submit your first lead to get started" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Contact</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Phone</th>
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
                      <td className="px-4 py-3 text-gray-600">{l.contactName}</td>
                      <td className="px-4 py-3 text-gray-600">{l.phone}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(l.submittedDate)}</td>
                      <td className="px-4 py-3 text-xs">
                        {l.status === 'Locked' && lockDaysLeft > 0 ? (
                          <span className="text-amber-600 font-medium flex items-center gap-1"><Lock className="h-3 w-3" /> {lockDaysLeft} day{lockDaysLeft > 1 ? 's' : ''} left</span>
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

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setError(''); setSuccess(''); }} title="Submit New Lead">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 flex items-start gap-2"><AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />{error}</div>}
          {success && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600 flex items-start gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />{success}</div>}
          <div>
            <label className="text-sm font-medium text-gray-700">Company Name</label>
            <input required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="input-field mt-1" placeholder="Company name to refer" />
            <p className="text-xs text-gray-400 mt-1">This company will be locked for {settings.leadLockDays} days after submission.</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Contact Person</label>
            <input required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className="input-field mt-1" placeholder="Contact name at the company" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field mt-1" placeholder="contact@company.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field mt-1" placeholder="+91 ..." />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field mt-1 min-h-20" placeholder="Any details about the lead..." />
          </div>
          <button type="submit" className="btn-primary w-full">Submit Lead</button>
        </form>
      </Modal>
    </div>
  );
}
