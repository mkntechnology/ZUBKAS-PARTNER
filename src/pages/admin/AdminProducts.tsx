import { useState } from 'react';
import { Package, Plus, CheckCircle2, Sparkles, Briefcase, BarChart3, HardHat, CreditCard, Wallet, Users, Trash2, X, DollarSign, Percent, Tag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, EmptyState } from '@/components/Shared';
import { Modal } from '@/components/Modal';
import type { Product } from '@/types';

const iconOptions = [
  { name: 'Briefcase', icon: Briefcase },
  { name: 'BarChart3', icon: BarChart3 },
  { name: 'HardHat', icon: HardHat },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'Wallet', icon: Wallet },
  { name: 'Users', icon: Users },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Package', icon: Package },
];

const iconMap: Record<string, typeof Package> = Object.fromEntries(
  iconOptions.map(o => [o.name, o.icon])
);

const statusOptions: Product['status'][] = ['Active', 'Beta', 'Coming Soon'];

interface FormState {
  name: string;
  description: string;
  icon: string;
  price: string;
  commissionRate: string;
  commissionEligible: boolean;
  status: Product['status'];
  features: string[];
}

const emptyForm: FormState = {
  name: '',
  description: '',
  icon: 'Package',
  price: '',
  commissionRate: '15% recurring',
  commissionEligible: true,
  status: 'Active',
  features: [''],
};

export function AdminProducts() {
  const { products, addProduct } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredFeatures = form.features.filter(f => f.trim() !== '');
    addProduct({
      name: form.name,
      description: form.description,
      icon: form.icon,
      price: form.price,
      commissionRate: form.commissionEligible ? form.commissionRate : 'Not eligible',
      commissionEligible: form.commissionEligible,
      status: form.status,
      features: filteredFeatures,
      launchDate: new Date().toISOString().split('T')[0],
    });
    setForm(emptyForm);
    setShowAdd(false);
  };

  const addFeature = () => setForm(f => ({ ...f, features: [...f.features, ''] }));
  const removeFeature = (index: number) => setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== index) }));
  const updateFeature = (index: number, value: string) => setForm(f => ({ ...f, features: f.features.map((feat, i) => i === index ? value : feat) }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Products Suite"
        subtitle="Manage Zubkas products available for partner referral"
        action={<button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Product</button>}
      />

      {products.length === 0 ? (
        <EmptyState icon={Package} title="No products yet" message="Add your first product to the suite" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(p => {
            const Icon = iconMap[p.icon] ?? Package;
            return (
              <div key={p.id} className="card p-5 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zubkas-50">
                    <Icon className="h-5 w-5 text-zubkas-700" />
                  </div>
                  <span className={`badge ${p.status === 'Active' ? 'badge-success' : p.status === 'Beta' ? 'badge-warning' : 'badge-neutral'}`}>{p.status}</span>
                </div>
                <h3 className="mt-3 font-display font-semibold text-gray-900">{p.name}</h3>
                <p className="mt-1 text-sm text-gray-500 flex-1">{p.description}</p>
                <div className="mt-3 space-y-1">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Price</span>
                    <span className="font-medium text-gray-900">{p.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Commission</span>
                    {p.commissionEligible ? (
                      <span className="font-medium text-zubkas-700">{p.commissionRate}</span>
                    ) : (
                      <span className="text-gray-400">Not eligible</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Product" size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Product Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field mt-1"
              placeholder="e.g. Zubkas Inventory Pro"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field mt-1 min-h-20"
              placeholder="Brief description of the product and its purpose"
            />
          </div>

          {/* Price + Commission Rate */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Price</label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input-field pl-9"
                  placeholder="₹499/month"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Commission Rate</label>
              <div className="relative mt-1">
                <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={form.commissionRate}
                  onChange={(e) => setForm({ ...form, commissionRate: e.target.value })}
                  className="input-field pl-9"
                  placeholder="15% recurring"
                  disabled={!form.commissionEligible}
                />
              </div>
            </div>
          </div>

          {/* Commission Eligible toggle */}
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.commissionEligible}
                onChange={(e) => setForm({ ...form, commissionEligible: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-zubkas-700 focus:ring-zubkas-700/20"
              />
              <span className="text-sm font-medium text-gray-700">Commission eligible</span>
            </label>
            <span className="text-xs text-gray-400">Partners can earn commission on referrals</span>
          </div>

          {/* Status + Icon */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Product['status'] })}
                className="input-field mt-1"
              >
                {statusOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Icon</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {iconOptions.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setForm({ ...form, icon: opt.name })}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${form.icon === opt.name ? 'border-zubkas-700 bg-zubkas-50 text-zubkas-700' : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'}`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Key Features — dynamic add/remove */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Key Features</label>
              <button type="button" onClick={addFeature} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zubkas-700 hover:bg-zubkas-50 transition-colors">
                <Plus className="h-3.5 w-3.5" />
                Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {form.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <input
                    value={feature}
                    onChange={(e) => updateFeature(i, e.target.value)}
                    className="input-field flex-1"
                    placeholder={`Feature ${i + 1}`}
                  />
                  {form.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
