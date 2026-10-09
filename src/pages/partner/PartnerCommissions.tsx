import { useState } from 'react';
import { DollarSign, TrendingUp, Clock, AlertTriangle, Calendar, Info, CheckCircle2, Wallet, BarChart3 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader, StatCard, EmptyState } from '@/components/Shared';
import { formatCurrency, formatCurrencyFull, formatDate } from '@/utils/helpers';
export function PartnerCommissions() {
  const { currentUser, customers, settings, plans, transactions } = useApp();
  const [view, setView] = useState<'all' | 'active' | 'unpaid' | 'capped'>('all');
  const [txFilter, setTxFilter] = useState<'All' | 'Paid' | 'Pending' | 'Blocked'>('All');

  const myCustomers = customers.filter(c => c.partnerId === currentUser?.partnerId);
  const myTransactions = transactions.filter(t => t.partnerId === currentUser?.partnerId);
  const filteredTx = myTransactions.filter(t => txFilter === 'All' || t.status === txFilter);

  const totalEarned = myCustomers.reduce((s, c) => s + c.commissionEarned, 0);
  const paidAmount = myTransactions.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amount, 0);
  const monthlyCommission = myCustomers.filter(c => c.status === 'Active').reduce((s, c) => {
    if (c.planType === 'Monthly' && c.remainingMonths > 0) return s + (c.subscriptionAmount * c.commissionRate / 100);
    if (c.planType === 'Yearly') return s + c.commissionEarned;
    return s;
  }, 0);
  const blockedCommission = myCustomers.filter(c => c.status === 'Unpaid').reduce((s, c) => s + (c.subscriptionAmount * c.commissionRate / 100), 0);
  const cappedCount = myCustomers.filter(c => c.planType === 'Monthly' && c.remainingMonths === 0).length;

  // Monthly breakdown for chart
  const monthlyData = myTransactions.reduce((acc, t) => {
    if (t.status === 'Paid') {
      acc[t.month] = (acc[t.month] ?? 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);
  const monthLabels = Object.keys(monthlyData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).slice(-6);
  const maxMonthly = Math.max(...monthLabels.map(m => monthlyData[m] ?? 0), 1);

  const filteredCustomers = myCustomers.filter(c => {
    if (view === 'active') return c.status === 'Active';
    if (view === 'unpaid') return c.status === 'Unpaid';
    if (view === 'capped') return c.planType === 'Monthly' && c.remainingMonths === 0;
    return true;
  });

  const freePlan = plans.find(p => p.name === 'Free Plan');
  const premiumPlan = plans.find(p => p.name === 'Premium Plan');

  return (
    <div className="space-y-6">
      <SectionHeader title="Commission Center" subtitle="Track your earnings, payout history, and commission rules" />

      {/* Commission Rules */}
      <div className="rounded-xl bg-zubkas-50 border border-zubkas-200 p-5">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-zubkas-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-zubkas-800">Commission Rules & Rates</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs font-medium text-gray-500">Free Plan</p>
                <p className="text-lg font-bold text-zubkas-700">{freePlan?.commissionRate ?? 5}% commission</p>
                <p className="text-xs text-gray-400">Monthly recurring</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs font-medium text-gray-500">Premium Plan</p>
                <p className="text-lg font-bold text-zubkas-700">{premiumPlan?.commissionRate ?? 15}% commission</p>
                <p className="text-xs text-gray-400">Monthly or yearly</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs font-medium text-gray-500">1-Year Cap</p>
                <p className="text-lg font-bold text-zubkas-700">{settings.commissionCapMonths} months max</p>
                <p className="text-xs text-gray-400">Then payout stops</p>
              </div>
            </div>
            <p className="text-xs text-zubkas-700 mt-3">
              Monthly plans: Earn commission every month for up to {settings.commissionCapMonths} months from the subscription start date. After {settings.commissionCapMonths} months, commission payout stops automatically.
              Yearly plans: Earn a one-time lump-sum commission for that year.
              Unpaid customers: Commission is automatically blocked for that month and resumes once payment is received.
            </p>
          </div>
        </div>
      </div>

      {/* Core metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Earned" value={formatCurrency(totalEarned)} icon={DollarSign} trend="All-time earnings" trendUp accent="emerald" />
        <StatCard label="Paid Out" value={formatCurrency(paidAmount)} icon={CheckCircle2} trend="Processed & deposited" trendUp accent="zubkas" />
        <StatCard label="This Month" value={formatCurrency(monthlyCommission)} icon={TrendingUp} trend="Current active earnings" trendUp accent="blue" />
        <StatCard label="Blocked / Pending" value={formatCurrency(blockedCommission)} icon={AlertTriangle} trend={`${myCustomers.filter(c => c.status === 'Unpaid').length} unpaid customer(s)`} accent="amber" />
      </div>

      {/* Monthly breakdown chart */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zubkas-50">
            <BarChart3 className="h-5 w-5 text-zubkas-700" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-900">Monthly Commission History</h3>
            <p className="text-xs text-gray-500">Paid commission earnings over the last 6 months</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-3 h-48 pt-4">
          {monthLabels.length === 0 ? (
            <p className="text-sm text-gray-400 w-full text-center">No paid commission history yet</p>
          ) : (
            monthLabels.map(m => {
              const val = monthlyData[m] ?? 0;
              const heightPct = Math.max(5, (val / maxMonthly) * 100);
              return (
                <div key={m} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">{formatCurrency(val)}</span>
                  <div className="flex w-full items-end justify-center" style={{ height: '120px' }}>
                    <div
                      className="w-full max-w-16 rounded-t-lg bg-gradient-to-t from-zubkas-700 to-zubkas-500 transition-all duration-500 hover:from-zubkas-800 hover:to-zubkas-600"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{m}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Filter tabs for customer commission breakdown */}
      <div className="flex gap-2 border-b border-gray-100">
        {([
          { key: 'all', label: 'All Customers' },
          { key: 'active', label: 'Active Earning' },
          { key: 'unpaid', label: 'Unpaid / Blocked' },
          { key: 'capped', label: 'Commission Capped' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={`border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${view === t.key ? 'border-zubkas-700 text-zubkas-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Commission breakdown table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Plan</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Subscription</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Rate</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Monthly Commission</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Total Earned</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500">Progress</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => {
                const monthlyAmt = (c.subscriptionAmount * c.commissionRate / 100);
                const progress = c.planType === 'Monthly' ? Math.min(100, (c.monthsElapsed / 12) * 100) : 100;
                return (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.companyName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${c.planType === 'Yearly' ? 'badge-zubkas' : 'badge-neutral'}`}>{c.planType}</span>
                      <span className="text-xs text-gray-500 block mt-0.5">{c.planTier}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrencyFull(c.subscriptionAmount)}</td>
                    <td className="px-4 py-3 text-right font-medium text-zubkas-700">{c.commissionRate}%</td>
                    <td className="px-4 py-3 text-right">
                      {c.status === 'Unpaid' ? (
                        <span className="text-amber-600 font-medium line-through">{formatCurrency(monthlyAmt)}</span>
                      ) : c.planType === 'Monthly' && c.remainingMonths === 0 ? (
                        <span className="text-gray-400">Capped</span>
                      ) : (
                        <span className="font-medium text-gray-900">{formatCurrency(monthlyAmt)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(c.commissionEarned)}</td>
                    <td className="px-4 py-3">
                      <div className="w-24 mx-auto">
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${c.status === 'Unpaid' ? 'bg-amber-400' : progress >= 100 ? 'bg-gray-400' : 'bg-emerald-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {c.planType === 'Monthly' && (
                          <p className="text-[10px] text-gray-400 text-center mt-1">{c.monthsElapsed}/12 mo</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {c.status === 'Unpaid' ? (
                        <span className="badge badge-error"><AlertTriangle className="h-3 w-3" /> Blocked</span>
                      ) : c.planType === 'Monthly' && c.remainingMonths === 0 ? (
                        <span className="badge badge-neutral"><Clock className="h-3 w-3" /> Capped</span>
                      ) : (
                        <span className="badge badge-success">Earning</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction history */}
      <div className="card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zubkas-50">
              <Wallet className="h-5 w-5 text-zubkas-700" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-gray-900">Transaction History</h3>
              <p className="text-xs text-gray-500">{myTransactions.length} commission transactions</p>
            </div>
          </div>
          <select value={txFilter} onChange={(e) => setTxFilter(e.target.value as typeof txFilter)} className="input-field sm:w-40">
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Blocked</option>
          </select>
        </div>
        {filteredTx.length === 0 ? (
          <EmptyState icon={Wallet} title="No transactions found" message="Commission transactions will appear here" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Plan</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Month</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(t.date)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{t.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">{t.companyName}</td>
                    <td className="px-4 py-3 text-gray-600">{t.planTier}</td>
                    <td className="px-4 py-3 text-right font-medium text-zubkas-700">{t.rate}%</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrencyFull(t.amount)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.month}</td>
                    <td className="px-4 py-3">
                      {t.status === 'Paid' ? (
                        <span className="badge badge-success"><CheckCircle2 className="h-3 w-3" /> Paid</span>
                      ) : t.status === 'Blocked' ? (
                        <span className="badge badge-error"><AlertTriangle className="h-3 w-3" /> Blocked</span>
                      ) : (
                        <span className="badge badge-warning"><Clock className="h-3 w-3" /> Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Commission end dates */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-gray-900 mb-4">Commission End Dates (1-Year Cap)</h3>
        <div className="space-y-2">
          {myCustomers.map(c => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-gray-50 p-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.companyName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatDate(c.commissionEndDate)}</p>
                <p className="text-xs text-gray-400">
                  {c.planType === 'Monthly'
                    ? c.remainingMonths > 0 ? `${c.remainingMonths} months remaining` : 'Cap reached'
                    : 'One-time payout'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
