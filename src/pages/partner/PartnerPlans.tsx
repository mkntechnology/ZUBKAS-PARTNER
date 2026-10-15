import { Layers, Percent, CheckCircle2, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader } from '@/components/Shared';

export function PartnerPlans() {
  const { plans } = useApp();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Plans & Features"
        subtitle="Subscription plans and commission rates available for your referrals"
      />

      <div className="rounded-xl bg-gradient-to-r from-zubkas-700 to-zubkas-800 p-6 text-white">
        <h3 className="font-display text-lg font-bold">Earn Commission on Every Referral</h3>
        <p className="text-sm text-zubkas-100 mt-1">Refer customers to any Zubkas plan and earn recurring commission for up to 12 months on monthly plans, or a one-time lump-sum on yearly plans.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map(p => (
          <div key={p.id} className={`card p-5 flex flex-col ${p.isCustom ? 'border-zubkas-200' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zubkas-50">
                <Layers className="h-6 w-6 text-zubkas-700" />
              </div>
              {p.isCustom && <span className="badge badge-zubkas">Custom</span>}
            </div>

            <h3 className="mt-3 font-display font-semibold text-gray-900">{p.name}</h3>
            <p className="mt-1 text-sm text-gray-500 flex-1">{p.description}</p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-zubkas-700" />
                <span className="text-2xl font-bold text-zubkas-700">{p.commissionRate}%</span>
              </div>
              <span className="text-xs text-gray-500">commission</span>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">{p.type} plan</span>
            </div>

            {p.features && p.features.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-50 space-y-2">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
