import { useState } from 'react';
import { Plus, Layers, Percent, Trash2, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader } from '@/components/Shared';
import { Modal } from '@/components/Modal';
import type { Plan } from '@/types';

export function AdminPlans() {
  const { plans, addPlan, deletePlan } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', commissionRate: '10', description: '', features: [''] });
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFeatures = form.features.map(f => f.trim()).filter(Boolean);
    addPlan({ name: form.name, commissionRate: Number(form.commissionRate), type: 'Monthly', description: form.description, features: cleanFeatures });
    setForm({ name: '', commissionRate: '10', description: '', features: [''] });
    setShowAdd(false);
  };

  const addFeature = () => {
    setForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    setForm(prev => ({ ...prev, features: prev.features.map((f, i) => i === index ? value : f) }));
  };

  const removeFeature = (index: number) => {
    setForm(prev => ({ ...prev, features: prev.features.length > 1 ? prev.features.filter((_, i) => i !== index) : [''] }));
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
            {p.features && p.features.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-zubkas-700" />
                <span className="text-lg font-bold text-zubkas-700">{p.commissionRate}%</span>
                <span className="text-xs text-gray-500">commission</span>
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
          <div>
            <label className="text-sm font-medium text-gray-700">Commission Rate (%)</label>
            <input required type="number" min="1" max="50" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field mt-1 min-h-20" placeholder="Plan features and details" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Plan Features</label>
              <button type="button" onClick={addFeature} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zubkas-700 hover:bg-zubkas-50 transition-colors">
                <Plus className="h-3.5 w-3.5" />
                Add Feature
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {form.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder={`Feature ${index + 1} (e.g. "Priority support")`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                    title="Remove feature"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
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
