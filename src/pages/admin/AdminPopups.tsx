import { useState } from 'react';
import { Plus, Bell, Trash2, Power, PowerOff, Image as ImageIcon, Users, User as UserIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, EmptyState } from '@/components/Shared';
import { Modal } from '@/components/Modal';
import { formatDate } from '@/utils/helpers';
import type { Popup } from '@/types';

const targetLabels: Record<Popup['targetType'], string> = {
  all_partners: 'All Partners',
  specific_partner: 'Specific Partner',
  all_employees: 'All Employees',
  specific_employee: 'Specific Employee',
};

export function AdminPopups() {
  const { popups, partners, employees, addPopup, updatePopup, deletePopup } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Popup | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    targetType: 'all_partners' as Popup['targetType'],
    targetId: '',
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPopup({
      title: form.title,
      content: form.content,
      imageUrl: form.imageUrl || undefined,
      targetType: form.targetType,
      targetId: (form.targetType === 'specific_partner' || form.targetType === 'specific_employee') ? form.targetId : undefined,
      isActive: form.isActive,
    });
    setForm({ title: '', content: '', imageUrl: '', targetType: 'all_partners', targetId: '', isActive: true });
    setShowAdd(false);
  };

  const needsTargetId = form.targetType === 'specific_partner' || form.targetType === 'specific_employee';

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Popup Management"
        subtitle="Create and manage popups that appear on partner and employee dashboards"
        action={<button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> Create Popup</button>}
      />

      {popups.length === 0 ? (
        <div className="card">
          <EmptyState icon={Bell} title="No popups yet" message="Create your first popup to display announcements on partner or employee dashboards." />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popups.map(p => (
            <div key={p.id} className={`card p-5 flex flex-col ${!p.isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zubkas-50">
                  <Bell className="h-5 w-5 text-zubkas-700" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updatePopup(p.id, { isActive: !p.isActive })}
                    className={`rounded-lg p-1.5 transition-colors ${p.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    title={p.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {p.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => setDeleteTarget(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete popup">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="mt-3 font-display font-semibold text-gray-900">{p.title}</h3>
              <p className="mt-1 text-sm text-gray-500 flex-1 line-clamp-3">{p.content}</p>

              {p.imageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center h-24">
                  <img src={p.imageUrl} alt={p.title} className="max-h-full max-w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-50 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  {p.targetType.startsWith('all') ? <Users className="h-3.5 w-3.5 text-gray-400" /> : <UserIcon className="h-3.5 w-3.5 text-gray-400" />}
                  <span>{targetLabels[p.targetType]}</span>
                  {p.targetId && (
                    <span className="text-gray-400">
                      · {p.targetType === 'specific_partner'
                        ? partners.find(pt => pt.id === p.targetId)?.name ?? 'Unknown'
                        : employees.find(em => em.id === p.targetId)?.name ?? 'Unknown'}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{formatDate(p.createdAt)}</span>
                  <span className={`badge ${p.isActive ? 'badge-success' : 'badge-neutral'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Popup" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field mt-1" placeholder="Popup headline" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Content / Message</label>
            <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-field mt-1 min-h-24" placeholder="The message to display in the popup" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="relative mt-1">
              <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-field pl-9" placeholder="https://example.com/image.jpg" />
            </div>
            <p className="mt-1 text-xs text-gray-400">Paste a direct link to an image. It will be displayed at the top of the popup.</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Target Audience</label>
            <select value={form.targetType} onChange={(e) => setForm({ ...form, targetType: e.target.value as Popup['targetType'], targetId: '' })} className="input-field mt-1">
              <option value="all_partners">All Partners</option>
              <option value="specific_partner">Specific Partner</option>
              <option value="all_employees">All Employees</option>
              <option value="specific_employee">Specific Employee</option>
            </select>
          </div>
          {needsTargetId && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                {form.targetType === 'specific_partner' ? 'Select Partner' : 'Select Employee'}
              </label>
              <select required value={form.targetId} onChange={(e) => setForm({ ...form, targetId: e.target.value })} className="input-field mt-1">
                <option value="">— Select —</option>
                {form.targetType === 'specific_partner'
                  ? partners.map(pt => <option key={pt.id} value={pt.id}>{pt.name} — {pt.company}</option>)
                  : employees.map(em => <option key={em.id} value={em.id}>{em.name} — {em.role}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm font-medium text-gray-700">{form.isActive ? 'Active — visible immediately' : 'Inactive — hidden from portals'}</span>
            </label>
          </div>
          <button type="submit" className="btn-primary w-full">Create Popup</button>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Popup" size="sm">
        {deleteTarget && (
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Delete "{deleteTarget.title}"?</p>
                <p className="text-xs text-red-700 mt-1">This popup will be permanently removed and will no longer appear on any dashboard.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={() => { deletePopup(deleteTarget.id); setDeleteTarget(null); }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] flex-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
