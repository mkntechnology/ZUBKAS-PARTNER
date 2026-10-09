import { useState } from 'react';
import {
  ArrowRight, Shield, Lock, TrendingUp, Users, Sparkles,
  CheckCircle2, BarChart3, Target, DollarSign, Layers, Zap,
  Crown, Star, Award, Rocket, Briefcase, CreditCard, HardHat, Wallet,
} from 'lucide-react';

interface LandingPageProps {
  onSignIn: () => void;
}

const features = [
  { icon: DollarSign, title: 'Up to 15% Recurring Commission', desc: 'Earn commission every month on every subscription you refer — Free Plan (5%) or Premium Plan (15%).' },
  { icon: Lock, title: '1-Year Cap Protection', desc: 'Commissions run for a full 12 months from each subscription start date. Track remaining months in real-time.' },
  { icon: Shield, title: 'Lead Lock Security', desc: 'When you register a lead, the company is locked for 3-5 days. No other partner can claim the same company.' },
  { icon: BarChart3, title: 'Real-Time Dashboard', desc: 'Monitor active customers, monthly sales, pending commissions, and top performance — all in one place.' },
  { icon: Target, title: 'Lead Management', desc: 'Submit, track, and convert leads with status tracking: Locked, Open, Converted, or Lost.' },
  { icon: Crown, title: 'Leaderboard & Badges', desc: 'Compete with fellow partners and earn badges: Top Performer, Rising Star, Consistent Earner, New Champion.' },
];

const products = [
  { icon: Briefcase, name: 'Zubkas Workspace', desc: 'Team collaboration & productivity' },
  { icon: BarChart3, name: 'Zubkas Storepulse', desc: 'Retail analytics & inventory' },
  { icon: HardHat, name: 'Zubkas Construction Mgmt', desc: 'Project & resource management' },
  { icon: CreditCard, name: 'Zubkas POS', desc: 'Point-of-sale & multi-store' },
  { icon: Wallet, name: 'Zubkas Payroll', desc: 'Automated payroll & compliance' },
  { icon: Users, name: 'Zubkas CRM', desc: 'Lead scoring & pipeline tracking' },
];

const trustBadges = [
  { icon: TrendingUp, label: '15% Recurring Commission', sub: 'On Premium plans' },
  { icon: Lock, label: '1-Year Cap Protection', sub: '12 months guaranteed' },
  { icon: Shield, label: 'Lead Lock Security', sub: '3-5 day exclusivity' },
];

const stats = [
  { value: '500+', label: 'Active Partners' },
  { value: '₹2.4Cr+', label: 'Commission Paid' },
  { value: '1,200+', label: 'Customers Referred' },
  { value: '7', label: 'Products Suite' },
];

export function LandingPage({ onSignIn }: LandingPageProps) {
  const [showProducts, setShowProducts] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zubkas-700 text-white font-display font-bold text-lg shadow-lg shadow-zubkas-700/20">
              Z
            </div>
            <div>
              <p className="font-display text-base font-bold text-gray-900 leading-tight">Zubkas</p>
              <p className="text-[10px] text-gray-400 leading-tight">Partner Program</p>
            </div>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <button onClick={() => setShowProducts(!showProducts)} className="text-sm font-medium text-gray-600 hover:text-zubkas-700 transition-colors">Products</button>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-zubkas-700 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-zubkas-700 transition-colors">How It Works</a>
          </div>
          <button onClick={onSignIn} className="btn-primary">
            Sign In
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {showProducts && (
          <div className="border-t border-gray-100 bg-white shadow-lg animate-slide-up">
            <div className="mx-auto grid max-w-7xl gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(p => (
                <div key={p.name} className="flex items-start gap-3 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zubkas-50">
                    <p.icon className="h-5 w-5 text-zubkas-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-zubkas-100/40 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-96 w-96 rounded-full bg-zubkas-50/60 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zubkas-200 bg-zubkas-50/80 px-4 py-1.5 text-sm font-medium text-zubkas-700 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Zubkas Authorized Partner Program
          </div>

          {/* Headline */}
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl animate-slide-up">
            Earn recurring commissions
            <br />
            <span className="bg-gradient-to-r from-zubkas-700 via-zubkas-600 to-zubkas-800 bg-clip-text text-transparent">
              for up to 12 months
            </span>
            <br />
            on every customer you refer
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 leading-relaxed animate-slide-up">
            Join the Zubkas Partner Program and earn up to 15% commission on every subscription.
            Track leads, monitor commissions, and climb the leaderboard — all from one powerful dashboard.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-slide-up">
            <button onClick={onSignIn} className="btn-primary text-base px-6 py-3">
              Become a Partner
              <ArrowRight className="h-5 w-5" />
            </button>
            <a href="#features" className="btn-secondary text-base px-6 py-3">
              Explore Features
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-fade-in">
            {trustBadges.map(b => (
              <div key={b.label} className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zubkas-50">
                  <b.icon className="h-5 w-5 text-zubkas-700" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{b.label}</p>
                  <p className="text-xs text-gray-400">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live stats bar */}
        <div className="mx-auto mt-16 max-w-4xl animate-slide-up">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 sm:grid-cols-4">
            {stats.map(s => (
              <div key={s.label} className="bg-white p-6 text-center">
                <p className="font-display text-3xl font-bold text-zubkas-700">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-zubkas-700">Features</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to grow
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              A complete partner management platform with commission tracking, lead protection, and real-time analytics.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-zubkas-200 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zubkas-50 transition-all duration-300 group-hover:bg-zubkas-700 group-hover:scale-110">
                  <f.icon className="h-6 w-6 text-zubkas-700 transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Commission Cards Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zubkas-50/40 via-white to-zubkas-50/20" />
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-zubkas-700">Real-Time Earnings</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Watch your commissions grow
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Every customer you refer generates commission automatically. Monthly plans earn every month for 12 months.
                Yearly plans earn a lump-sum. Track everything in real-time with visual progress bars and monthly breakdowns.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { icon: CheckCircle2, text: 'Automatic commission calculation on every subscription' },
                  { icon: CheckCircle2, text: 'Monthly breakdown chart with 6-month history' },
                  { icon: CheckCircle2, text: 'Unpaid subscription alerts with blocked commission tracking' },
                  { icon: CheckCircle2, text: 'Commission end dates with remaining months countdown' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating commission cards */}
            <div className="relative h-96">
              {/* Card 1 - Monthly commission */}
              <div className="absolute left-0 top-0 w-72 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Monthly Commission</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
                <p className="mt-2 font-display text-3xl font-bold text-gray-900">₹42,000</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% vs last month
                </div>
                <div className="mt-3 h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '72%' }} />
                </div>
              </div>

              {/* Card 2 - Top performer */}
              <div className="absolute right-0 top-24 w-64 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-semibold text-gray-900">Top Performer</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">Vikram Singh</p>
                <p className="font-display text-2xl font-bold text-gray-900">₹8.4L</p>
                <p className="text-xs text-gray-400">Monthly sales</p>
              </div>

              {/* Card 3 - Active customers */}
              <div className="absolute bottom-8 left-8 w-60 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zubkas-50">
                    <Users className="h-4 w-4 text-zubkas-700" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Active Customers</span>
                </div>
                <p className="mt-2 font-display text-2xl font-bold text-gray-900">28</p>
                <div className="mt-2 flex gap-1">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 8 ? 'bg-zubkas-700' : 'bg-gray-100'}`} />
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-gray-400">8/12 months commission active</p>
              </div>

              {/* Card 4 - Badge */}
              <div className="absolute bottom-0 right-4 w-52 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-xl animate-slide-up" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">New Champion</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Badge earned</p>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-zubkas-700">How It Works</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Start earning in 3 simple steps
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { step: '01', icon: Layers, title: 'Get Approved', desc: 'Admins create your partner account and assign your category. No self-registration — every partner is verified.' },
              { step: '02', icon: Target, title: 'Refer Customers', desc: 'Submit leads with lead-lock protection. When a lead converts, commission starts automatically.' },
              { step: '03', icon: DollarSign, title: 'Earn Commission', desc: 'Earn 5-15% every month for 12 months on monthly plans, or a lump-sum on yearly plans. Track everything in real-time.' },
            ].map((s, i) => (
              <div key={s.step} className="relative">
                {i < 2 && (
                  <div className="absolute top-8 left-full hidden h-px w-full -translate-x-8 bg-gradient-to-r from-zubkas-200 to-transparent md:block" />
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zubkas-700 text-white shadow-lg shadow-zubkas-700/20">
                  <s.icon className="h-7 w-7" />
                </div>
                <p className="mt-4 text-xs font-bold text-zubkas-700">STEP {s.step}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zubkas-700 via-zubkas-800 to-zubkas-900 p-12 text-center shadow-2xl">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
            <Zap className="mx-auto h-10 w-10 text-white/80" />
            <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
              Ready to start earning?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zubkas-100">
              Sign in to access your partner dashboard, track commissions, and manage your referrals.
            </p>
            <button onClick={onSignIn} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-zubkas-700 transition-all hover:bg-zubkas-50 active:scale-[0.98]">
              Sign In to Dashboard
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zubkas-700 text-white font-display font-bold text-sm">
                Z
              </div>
              <div>
                <p className="font-display text-sm font-bold text-gray-900">Zubkas Partner Program</p>
                <p className="text-[10px] text-gray-400">Affiliate & Partner Management</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
              <span className="text-xs text-gray-400">© {new Date().getFullYear()} Zubkas Partner Program. All rights reserved.</span>
              <span className="hidden sm:block text-gray-300">·</span>
              <span className="text-xs font-medium">Powered by <span className="font-display font-bold text-zubkas-700">Zubkas</span></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
