import { useState } from 'react';
import { UserPlus, Shield, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, EmptyState } from '@/components/Shared';
import { Modal } from '@/components/Modal';
import { formatDate, getInitials } from '@/utils/helpers';

export function AdminEmployees() {
  const { employees, addEmployee } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', role: 'Partner Manager' });

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({ name: form.name, email: form.email, role: form.role, status: 'Active', joinedDate: new Date().toISOString().split('T')[0] });
    setForm({ name: '', email: '', role: 'Partner Manager' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Employee Management"
        subtitle="Add team members and assign role access"
        action={<button onClick={() => setShowAdd(true)} className="btn-primary"><UserPlus className="h-4 w-4" /> Add Employee</button>}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 sm:max-w-xs" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full"><EmptyState icon={UserPlus} title="No employees found" message="Add your first team member" /></div>
        ) : (
          filtered.map(e => (
            <div key={e.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zubkas-700 text-sm font-bold text-white">{getInitials(e.name)}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{e.name}</p>
                    <p className="text-xs text-gray-500">{e.email}</p>
                  </div>
                </div>
                <Shield className="h-5 w-5 text-zubkas-700" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium text-gray-900">{e.role}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Joined</span>
                  <span className="font-medium text-gray-900">{formatDate(e.joinedDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`badge ${e.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>{e.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Employee">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1" placeholder="Employee name" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field mt-1" placeholder="employee@zubkas.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Role / Access Level</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field mt-1">
              <option>Partner Manager</option>
              <option>Support Lead</option>
              <option>Onboarding Specialist</option>
              <option>Account Manager</option>
              <option>Full Admin Access</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">Add Employee</button>
        </form>
      </Modal>
    </div>
  );
}
