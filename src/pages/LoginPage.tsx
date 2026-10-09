import { useState } from 'react';
import { Mail, Lock, ArrowRight, Shield, User, KeyRound, Sparkles, Eye, EyeOff, ArrowLeft, CircleCheck as CheckCircle2, TrendingUp, Users, DollarSign, Crown } from 'lucide-react';
import { useApp } from '@/context/AppContext';

type LoginMode = 'partner' | 'admin';
type AuthMethod = 'password' | 'otp';

interface LoginPageProps {
  onBack: () => void;
}

export function LoginPage({ onBack }: LoginPageProps) {
  const { login, loginOtp } = useApp();
  const [mode, setMode] = useState<LoginMode>('partner');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const partnerDemoAccounts = [
    { email: 'partner@zubkas.com', label: 'Vikram Singh' },
    { email: 'neha@zubkas.com', label: 'Neha Gupta' },
  ];

  const adminDemoAccounts = [
    { email: 'admin@zubkas.com', label: 'Rajesh Kumar' },
    { email: 'employee@zubkas.com', label: 'Priya Sharma' },
  ];

  const partnerEmails = ['partner@zubkas.com', 'neha@zubkas.com', 'rahul@zubkas.com', 'anita@zubkas.com', 'suresh@zubkas.com'];
  const adminEmails = ['admin@zubkas.com', 'employee@zubkas.com', 'support@zubkas.com'];

  const validateMode = (emailToCheck: string): boolean => {
    const lower = emailToCheck.toLowerCase();
    if (mode === 'partner' && adminEmails.includes(lower)) {
      setError('This is an admin account. Switch to the Admin tab to sign in.');
      return false;
    }
    if (mode === 'admin' && partnerEmails.includes(lower)) {
      setError('This is a partner account. Switch to the Partner tab to sign in.');
      return false;
    }
    return true;
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateMode(email)) return;
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      if (!success) setError('Invalid email or password. Use a demo account below to try it out.');
      setLoading(false);
    }, 500);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateMode(email)) return;
    setLoading(true);
    setTimeout(() => {
      const allEmails = [...partnerEmails, ...adminEmails];
      if (allEmails.includes(email.toLowerCase())) {
        setOtpSent(true);
      } else {
        setError('No account found with this email.');
      }
      setLoading(false);
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (otp.length === 6) {
        const success = loginOtp(email);
        if (!success) setError('Verification failed. Please try again.');
      } else {
        setError('Please enter the 6-digit code.');
      }
      setLoading(false);
    }, 500);
  };

  const switchMode = (newMode: LoginMode) => {
    setMode(newMode);
    setEmail('');
    setPassword('');
    setOtp('');
    setOtpSent(false);
    setError('');
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side — dark crimson gradient with value props */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-zubkas-800 via-zubkas-900 to-zubkas-950 px-8 py-10 lg:w-1/2 lg:px-12 lg:py-12">
        {/* Glowing abstract shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-zubkas-600/30 blur-3xl" />
          <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-zubkas-500/20 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-zubkas-700/30 blur-3xl" />
          <div className="absolute top-1/2 right-1/3 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        </div>

        {/* Top — back button + logo */}
        <div className="relative z-10 flex items-center justify-between">
          <button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white font-display font-bold text-lg backdrop-blur-sm">
              Z
            </div>
            <div>
              <p className="font-display text-base font-bold text-white leading-tight">Zubkas</p>
              <p className="text-[10px] text-zubkas-200 leading-tight">Partner Program</p>
            </div>
          </div>
        </div>

        {/* Middle — value propositions */}
        <div className="relative z-10 my-12 lg:my-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Authorized Partner Portal
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Earn recurring commissions
            <br />
            <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              for up to 12 months
            </span>
          </h1>
          <p className="mt-4 max-w-md text-zubkas-100 leading-relaxed">
            Refer customers to Zubkas products and earn 5-15% commission every month. Track your performance, manage leads, and grow your earnings.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-4">
            {[
              { icon: DollarSign, title: 'Up to 15% Commission', desc: 'On every subscription you refer' },
              { icon: TrendingUp, title: '1-Year Recurring Earnings', desc: 'Commission for 12 months on monthly plans' },
              { icon: Shield, title: 'Lead Lock Protection', desc: 'Your leads are protected for exclusive conversion' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3.5 animate-slide-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <f.icon className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{f.title}</p>
                  <p className="text-sm text-zubkas-200">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — live stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          {[
            { icon: Users, value: '500+', label: 'Partners' },
            { icon: DollarSign, value: '₹2.4Cr+', label: 'Commission Paid' },
            { icon: Crown, value: '#1', label: 'Partner Program' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <s.icon className="mx-auto h-5 w-5 text-amber-300/70" />
              <p className="mt-1.5 font-display text-xl font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-zubkas-200">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side — glassmorphic login card */}
      <div className="relative flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-zubkas-50/30 px-6 py-10 lg:w-1/2 lg:px-12">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 h-48 w-48 rounded-full bg-zubkas-100/30 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-zubkas-50/50 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md animate-slide-up">
          {/* Glassmorphic card */}
          <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl shadow-gray-200/50 backdrop-blur-xl sm:p-10">
            {/* Mode toggle — animated */}
            <div className="relative mb-6 flex rounded-xl bg-gray-100/80 p-1">
              <div
                className={`absolute inset-y-1 w-1/2 rounded-lg bg-zubkas-700 shadow-md transition-all duration-300 ease-out ${mode === 'admin' ? 'left-1/2' : 'left-1'}`}
                style={{ width: 'calc(50% - 4px)' }}
              />
              <button
                onClick={() => switchMode('partner')}
                className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 ${mode === 'partner' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <User className="h-4 w-4" />
                Partner
              </button>
              <button
                onClick={() => switchMode('admin')}
                className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 ${mode === 'admin' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            </div>

            <h2 className="font-display text-2xl font-bold text-gray-900">
              {mode === 'partner' ? 'Partner Login' : 'Admin / Employee Login'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {mode === 'partner' ? 'Access your partner dashboard' : 'Manage partners, plans, and announcements'}
            </p>

            {/* Auth method toggle */}
            <div className="mt-6 flex gap-4 border-b border-gray-100">
              <button
                onClick={() => { setAuthMethod('password'); setError(''); setOtpSent(false); }}
                className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-sm font-medium transition-colors ${authMethod === 'password' ? 'border-zubkas-700 text-zubkas-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <Lock className="h-3.5 w-3.5" />
                Password
              </button>
              <button
                onClick={() => { setAuthMethod('otp'); setError(''); setOtpSent(false); }}
                className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-sm font-medium transition-colors ${authMethod === 'otp' ? 'border-zubkas-700 text-zubkas-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <KeyRound className="h-3.5 w-3.5" />
                OTP Login
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 animate-fade-in">
                {error}
              </div>
            )}

            {/* Password form */}
            {authMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@zubkas.com"
                      className="w-full rounded-xl border border-gray-200 bg-white/80 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-zubkas-700 focus:ring-4 focus:ring-zubkas-700/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-200 bg-white/80 py-3 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-zubkas-700 focus:ring-4 focus:ring-zubkas-700/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                  {loading ? 'Signing in...' : 'Sign In'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            )}

            {/* OTP form */}
            {authMethod === 'otp' && !otpSent && (
              <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@zubkas.com"
                      className="w-full rounded-xl border border-gray-200 bg-white/80 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-zubkas-700 focus:ring-4 focus:ring-zubkas-700/10"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                  {loading ? 'Sending...' : 'Send OTP'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            )}

            {authMethod === 'otp' && otpSent && (
              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  OTP sent to {email}. Use any 6 digits for this demo.
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-3.5 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 outline-none transition-all focus:border-zubkas-700 focus:ring-4 focus:ring-zubkas-700/10"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
                <button type="button" onClick={() => setOtpSent(false)} className="btn-ghost w-full">
                  Change email
                </button>
              </form>
            )}

            {/* Demo accounts */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-400 mb-2">Demo accounts — click to auto-fill:</p>
              <div className="flex flex-wrap gap-2">
                {(mode === 'partner' ? partnerDemoAccounts : adminDemoAccounts).map(acc => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => fillDemoAccount(acc.email)}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-600 transition-all hover:border-zubkas-300 hover:bg-zubkas-50 hover:text-zubkas-700"
                  >
                    {acc.label}
                    <span className="block text-[10px] text-gray-400">{acc.email}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 text-center">
          <span className="text-xs text-gray-400">Powered by <span className="font-display font-bold text-zubkas-700">Zubkas</span></span>
        </div>
      </div>
    </div>
  );
}
