import { useState } from 'react';
import { Plus, Layers, Percent, Calendar, Trash2, TriangleAlert as AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader } from '@/components/Shared';
import { Modal } from '@/components/Modal';
import type { Plan } from '@/types';

export function AdminPlans() {
  const { plans, addPlan, deletePlan } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', commissionRate: '10', type: 'Monthly' as 'Monthly' | 'Yearly', description: '' });
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPlan({ name: form.name, commissionRate: Number(form.commissionRate), type: form.type, description: form.description });
    setForm({ name: '', commissionRate: '10', type: 'Monthly', description: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Plans & Commission Rates"
        subtitle="Manage subscription plans and partner commission percentages"
        action={<button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Custom Plan</button>}
      />

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">1-Year Commission Cap Rule</p>
        <p>Monthly plans earn commission every month for up to 12 months from the subscription start date. Yearly plans earn a one-time lump-sum commission. After the cap, commission payout stops automatically.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map(p => (
          <div key={p.id} className={`card p-5 ${p.isCustom ? 'border-zubkas-200' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zubkas-50">
                <Layers className="h-5 w-5 text-zubkas-700" />
              </div>
              <div className="flex items-center gap-1">
                {p.isCustom && <span className="badge badge-zubkas">Custom</span>}
                <button onClick={() => setDeleteTarget(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete plan">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3 className="mt-3 font-display font-semibold text-gray-900">{p.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{p.description}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-zubkas-700" />
                <span className="text-lg font-bold text-zubkas-700">{p.commissionRate}%</span>
                <span className="text-xs text-gray-500">commission</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{p.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Custom Plan">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Plan Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1" placeholder="e.g. Enterprise Plan" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Commission Rate (%)</label>
              <input required type="number" min="1" max="50" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: e.target.value })} className="input-field mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Plan Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'Monthly' | 'Yearly' })} className="input-field mt-1">
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field mt-1 min-h-20" placeholder="Plan features and details" />
          </div>
          <button type="submit" className="btn-primary w-full">Add Plan</button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Plan" size="sm">
        {deleteTarget && (
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">This action cannot be undone.</p>
                <p className="text-xs text-red-700 mt-1">
                  Plan <span className="font-semibold">{deleteTarget.name}</span> ({deleteTarget.commissionRate}% commission) will be permanently removed. Existing customers on this plan will keep their current commission rate.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={() => { deletePlan(deleteTarget.id); setDeleteTarget(null); }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] flex-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete Plan
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
