import { useState } from 'react';
import { Plus, Tag, FolderTree } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, EmptyState } from '@/components/Shared';
import { Modal } from '@/components/Modal';

export function AdminCategories() {
  const { categories, addCategory } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({ name: form.name, description: form.description });
    setForm({ name: '', description: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Partner Categories"
        subtitle="Organize partners by business type"
        action={<button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Category</button>}
      />

      {categories.length === 0 ? (
        <EmptyState icon={FolderTree} title="No categories yet" message="Create your first partner category" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(c => (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zubkas-50">
                  <Tag className="h-5 w-5 text-zubkas-700" />
                </div>
                <span className="badge badge-zubkas">{c.partnerCount} partners</span>
              </div>
              <h3 className="mt-3 font-display font-semibold text-gray-900">{c.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{c.description}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Category">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Category Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1" placeholder="e.g. Healthcare" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field mt-1 min-h-20" placeholder="Brief description of this category" />
          </div>
          <button type="submit" className="btn-primary w-full">Add Category</button>
        </form>
      </Modal>
    </div>
  );
}
