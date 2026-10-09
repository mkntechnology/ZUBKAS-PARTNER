import { Crown, Star, Award, Rocket, Trophy, Target, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader } from '@/components/Shared';
import { leaderboard, badges } from '@/data/mockData';
import { getInitials } from '@/utils/helpers';

const badgeIcons: Record<string, typeof Crown> = { 'Top Performer': Crown, 'Rising Star': Star, 'Consistent Earner': Award, 'New Champion': Rocket };

export function PartnerLeaderboard() {
  const { currentUser, partners } = useApp();
  const partner = partners.find(p => p.id === currentUser?.partnerId);

  const sections = [
    { key: 'monthlyTop', title: 'Monthly Top Partners', subtitle: 'Highest sales this month', icon: Trophy, data: leaderboard.monthlyTop },
    { key: 'highestSales', title: 'Most Active Customers', subtitle: 'Partners with most active customers', icon: TrendingUp, data: leaderboard.highestSales },
    { key: 'mostActive', title: 'Most Active Partners', subtitle: 'Most leads submitted this month', icon: Target, data: leaderboard.mostActive },
    { key: 'newChampion', title: 'New Partner Champion', subtitle: 'Top new partner (joined within 12 months)', icon: Rocket, data: leaderboard.newChampion },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Leaderboard & Badges" subtitle="See how you rank among all partners" />

      {/* My rank */}
      {partner && (
        <div className="card p-5 bg-gradient-to-r from-zubkas-50 to-white border-zubkas-200">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zubkas-700 text-lg font-bold text-white">
              {getInitials(partner.name)}
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-gray-900">{partner.name}</p>
              <p className="text-sm text-gray-500">{partner.company}</p>
            </div>
            {partner.badge && (() => { const Icon = badgeIcons[partner.badge] ?? Trophy; return (
              <div className="flex items-center gap-2 rounded-full bg-zubkas-700 px-4 py-2 text-sm font-medium text-white">
                <Icon className="h-4 w-4" />
                {partner.badge}
              </div>
            ); })()}
          </div>
        </div>
      )}

      {/* Badges legend */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-gray-900 mb-3">Badge System</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map(b => {
            const Icon = badgeIcons[b.name] ?? Award;
            return (
              <div key={b.id} className="flex items-start gap-3 rounded-lg border border-gray-50 p-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 ${b.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{b.name}</p>
                  <p className="text-xs text-gray-500">{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard sections */}
      {sections.map(section => {
        const Icon = section.icon;
        return (
          <div key={section.key} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zubkas-50">
                <Icon className="h-5 w-5 text-zubkas-700" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900">{section.title}</h3>
                <p className="text-xs text-gray-500">{section.subtitle}</p>
              </div>
            </div>
            <div className="space-y-2">
              {section.data.map((entry, i) => {
                const isMe = entry.partnerId === currentUser?.partnerId;
                const BadgeIcon = badgeIcons[entry.badge] ?? null;
                return (
                  <div key={entry.partnerId} className={`flex items-center gap-4 rounded-lg p-3 ${isMe ? 'bg-zubkas-50 border-2 border-zubkas-300' : i === 0 ? 'bg-gradient-to-r from-amber-50 to-transparent border border-amber-100' : 'bg-gray-50'}`}>
                    {isMe && <span className="badge badge-zubkas shrink-0">YOU</span>}
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      #{entry.rank}
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zubkas-700 text-xs font-bold text-white">
                      {getInitials(entry.partnerName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{entry.partnerName}</p>
                      <p className="text-xs text-gray-500 truncate">{entry.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{entry.metricLabel}</p>
                    </div>
                    {BadgeIcon && <BadgeIcon className={`h-5 w-5 ${i === 0 ? 'text-amber-500' : 'text-zubkas-700'}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
