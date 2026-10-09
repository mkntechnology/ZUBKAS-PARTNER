import { useState } from 'react';
import { Save, RotateCcw, LayoutDashboard, LogIn, Type, BarChart3, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader } from '@/components/Shared';
import type { SiteContent } from '@/types';

type Tab = 'landing' | 'login';

const landingFields: { key: keyof SiteContent; label: string; type: 'input' | 'textarea' }[] = [
  { key: 'landingBadge', label: 'Hero Badge Text', type: 'input' },
  { key: 'landingHeroTitle1', label: 'Hero Title (Line 1)', type: 'input' },
  { key: 'landingHeroTitle2', label: 'Hero Title (Line 2 — highlighted)', type: 'input' },
  { key: 'landingHeroTitle3', label: 'Hero Title (Line 3)', type: 'input' },
  { key: 'landingHeroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
  { key: 'landingCtaPrimary', label: 'Primary CTA Button', type: 'input' },
  { key: 'landingCtaSecondary', label: 'Secondary CTA Button', type: 'input' },
  { key: 'landingFeaturesHeading', label: 'Features Section Heading', type: 'input' },
  { key: 'landingFeaturesSubheading', label: 'Features Section Subheading', type: 'textarea' },
  { key: 'landingEarningsHeading', label: 'Earnings Section Heading', type: 'input' },
  { key: 'landingEarningsDesc', label: 'Earnings Section Description', type: 'textarea' },
  { key: 'landingHowItWorksHeading', label: 'How It Works Heading', type: 'input' },
  { key: 'landingCtaSectionHeading', label: 'CTA Section Heading', type: 'input' },
  { key: 'landingCtaSectionDesc', label: 'CTA Section Description', type: 'textarea' },
  { key: 'landingCtaSectionButton', label: 'CTA Section Button', type: 'input' },
  { key: 'landingStat1Value', label: 'Stat 1 Value', type: 'input' },
  { key: 'landingStat1Label', label: 'Stat 1 Label', type: 'input' },
  { key: 'landingStat2Value', label: 'Stat 2 Value', type: 'input' },
  { key: 'landingStat2Label', label: 'Stat 2 Label', type: 'input' },
  { key: 'landingStat3Value', label: 'Stat 3 Value', type: 'input' },
  { key: 'landingStat3Label', label: 'Stat 3 Label', type: 'input' },
  { key: 'landingStat4Value', label: 'Stat 4 Value', type: 'input' },
  { key: 'landingStat4Label', label: 'Stat 4 Label', type: 'input' },
];

const loginFields: { key: keyof SiteContent; label: string; type: 'input' | 'textarea' }[] = [
  { key: 'loginBadge', label: 'Login Badge Text', type: 'input' },
  { key: 'loginHeroTitle1', label: 'Hero Title (Line 1)', type: 'input' },
  { key: 'loginHeroTitle2', label: 'Hero Title (Line 2 — highlighted)', type: 'input' },
  { key: 'loginHeroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
  { key: 'loginPartnerTitle', label: 'Partner Login Title', type: 'input' },
  { key: 'loginPartnerSubtitle', label: 'Partner Login Subtitle', type: 'input' },
  { key: 'loginAdminTitle', label: 'Admin Login Title', type: 'input' },
  { key: 'loginAdminSubtitle', label: 'Admin Login Subtitle', type: 'input' },
];

export function AdminContentManager() {
  const { siteContent, updateSiteContent, resetSiteContent } = useApp();
  const [tab, setTab] = useState<Tab>('landing');
  const [form, setForm] = useState<SiteContent>(siteContent);
  const [saved, setSaved] = useState(false);

  const fields = tab === 'landing' ? landingFields : loginFields;

  const handleSave = () => {
    updateSiteContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetSiteContent();
    setForm({ ...siteContent });
  };

  const handleChange = (key: keyof SiteContent, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Content Manager"
        subtitle="Edit all headings, text, and paragraphs on the Home and Login pages"
        action={
          <div className="flex gap-2">
            {saved && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 animate-fade-in">
                <CheckCircle2 className="h-4 w-4" />
                Saved!
              </span>
            )}
            <button onClick={handleReset} className="btn-secondary">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button onClick={handleSave} className="btn-primary">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        }
      />

      <div className="rounded-xl bg-zubkas-50 border border-zubkas-200 p-4 text-sm text-zubkas-700 flex items-center gap-2">
        <Type className="h-4 w-4 shrink-0" />
        Changes are applied instantly. Click "Save Changes" to persist them. Use "Reset" to restore defaults.
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 border-b border-gray-100">
        <button
          onClick={() => setTab('landing')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${tab === 'landing' ? 'border-zubkas-700 text-zubkas-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Home / Landing Page
        </button>
        <button
          onClick={() => setTab('login')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${tab === 'login' ? 'border-zubkas-700 text-zubkas-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <LogIn className="h-4 w-4" />
          Login Page
        </button>
      </div>

      {/* Form fields */}
      <div className="card p-6">
        {tab === 'landing' && (
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3">
            <BarChart3 className="h-5 w-5 text-zubkas-700" />
            <p className="text-sm font-medium text-gray-700">Landing Page Content</p>
          </div>
        )}
        {tab === 'login' && (
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3">
            <LogIn className="h-5 w-5 text-zubkas-700" />
            <p className="text-sm font-medium text-gray-700">Login Page Content</p>
          </div>
        )}
        <div className="space-y-4">
          {fields.map(field => (
            <div key={field.key}>
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="input-field mt-1 min-h-20"
                />
              ) : (
                <input
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="input-field mt-1"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={handleSave} className="btn-primary flex-1">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
          <button onClick={handleReset} className="btn-secondary">
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
