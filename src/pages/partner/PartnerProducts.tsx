import { CheckCircle2, Sparkles, Briefcase, BarChart3, HardHat, CreditCard, Wallet, Users, Package } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader } from '@/components/Shared';

const iconMap: Record<string, typeof Package> = {
  Briefcase, BarChart3, HardHat, CreditCard, Wallet, Users, Sparkles, Package,
};

export function PartnerProducts() {
  const { products } = useApp();

  return (
    <div className="space-y-6">
      <SectionHeader title="Products Suite" subtitle="Zubkas products you can refer and earn commission on" />

      <div className="rounded-xl bg-gradient-to-r from-zubkas-700 to-zubkas-800 p-6 text-white">
        <h3 className="font-display text-lg font-bold">Earn Commission on Every Referral</h3>
        <p className="text-sm text-zubkas-100 mt-1">Refer customers to any Zubkas product and earn up to 15% recurring commission for 12 months on monthly plans, or a one-time lump-sum on yearly plans.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(p => {
          const Icon = iconMap[p.icon] ?? Package;
          return (
            <div key={p.id} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zubkas-50">
                  <Icon className="h-6 w-6 text-zubkas-700" />
                </div>
                <span className={`badge ${p.status === 'Active' ? 'badge-success' : p.status === 'Beta' ? 'badge-warning' : 'badge-neutral'}`}>{p.status}</span>
              </div>
              <h3 className="mt-3 font-display font-semibold text-gray-900">{p.name}</h3>
              <p className="mt-1 text-sm text-gray-500 flex-1">{p.description}</p>
              <div className="mt-3 space-y-1.5">
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
    </div>
  );
}
