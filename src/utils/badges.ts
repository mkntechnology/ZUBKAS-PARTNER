import type { Partner, Customer, Lead, CommissionTransaction, Badge } from '@/types';
import { formatCurrency } from './helpers';

export const BADGE_DEFINITIONS: Omit<Badge, 'id'>[] = [
  { name: 'Top Performer', icon: 'Crown', description: 'Highest monthly sales among all partners', color: 'text-amber-600' },
  { name: 'Rising Star', icon: 'Star', description: 'Consistent growth over 3 months', color: 'text-blue-600' },
  { name: 'Consistent Earner', icon: 'Award', description: 'Steady commission earnings for 6+ months', color: 'text-emerald-600' },
  { name: 'New Champion', icon: 'Rocket', description: 'Top performing new partner (joined within 12 months)', color: 'text-purple-600' },
  { name: 'Lead Master', icon: 'Target', description: 'Converted 10+ leads in a quarter', color: 'text-zubkas-700' },
];

export function getBadges(): Badge[] {
  return BADGE_DEFINITIONS.map((b, i) => ({ ...b, id: `badge-${i}` }));
}

export function calculatePartnerBadge(
  partner: Partner,
  customers: Customer[],
  leads: Lead[],
  transactions: CommissionTransaction[],
  allPartners: Partner[],
): string {
  const now = new Date('2026-10-10');
  const joinedDate = new Date(partner.joinedDate);
  const monthsSinceJoin = (now.getFullYear() - joinedDate.getFullYear()) * 12 + (now.getMonth() - joinedDate.getMonth());

  const partnerTxns = transactions.filter(t => t.partnerId === partner.id && t.status === 'Paid');
  const convertedLeads = leads.filter(l => l.partnerId === partner.id && l.status === 'Converted').length;

  const has6PlusMonthsEarnings = partnerTxns.length >= 6;
  const isNewWithin12 = monthsSinceJoin <= 12;
  const isLeadMaster = convertedLeads >= 10;

  const topBySales = [...allPartners].sort((a, b) => b.monthlySales - a.monthlySales)[0];
  const isTopPerformer = allPartners.length > 0 && topBySales?.id === partner.id && partner.monthlySales > 0;

  const top3BySales = [...allPartners].sort((a, b) => b.monthlySales - a.monthlySales).slice(0, 3);
  const isRisingStar = top3BySales.some(p => p.id === partner.id) && partner.monthlySales > 0 && !isTopPerformer;

  const newPartners = allPartners.filter(p => {
    const j = new Date(p.joinedDate);
    const ms = (now.getFullYear() - j.getFullYear()) * 12 + (now.getMonth() - j.getMonth());
    return ms <= 12;
  });
  const topNew = [...newPartners].sort((a, b) => b.monthlyCommission - a.monthlyCommission)[0];
  const isNewChampion = newPartners.length > 0 && topNew?.id === partner.id && partner.monthlyCommission > 0;

  if (isLeadMaster) return 'Lead Master';
  if (isTopPerformer) return 'Top Performer';
  if (isRisingStar) return 'Rising Star';
  if (has6PlusMonthsEarnings) return 'Consistent Earner';
  if (isNewChampion) return 'New Champion';
  return '';
}

export interface LeaderboardSection {
  key: string;
  title: string;
  subtitle: string;
  iconName: string;
  entries: { partnerId: string; partnerName: string; company: string; metric: number; metricLabel: string; rank: number; badge: string }[];
}

export function calculateLeaderboard(
  partners: Partner[],
  customers: Customer[],
  leads: Lead[],
  transactions: CommissionTransaction[],
): LeaderboardSection[] {
  const sections: LeaderboardSection[] = [];

  const monthlyTop = [...partners]
    .filter(p => p.monthlySales > 0)
    .sort((a, b) => b.monthlySales - a.monthlySales)
    .slice(0, 10)
    .map((p, i) => ({
      partnerId: p.id,
      partnerName: p.name,
      company: p.company,
      metric: p.monthlySales,
      metricLabel: `${formatCurrency(p.monthlySales)} sales`,
      rank: i + 1,
      badge: calculatePartnerBadge(p, customers, leads, transactions, partners),
    }));
  sections.push({ key: 'monthlyTop', title: 'Monthly Top Partners', subtitle: 'Highest sales this month', iconName: 'Trophy', entries: monthlyTop });

  const highestSales = [...partners]
    .filter(p => p.activeCustomers > 0)
    .sort((a, b) => b.activeCustomers - a.activeCustomers)
    .slice(0, 10)
    .map((p, i) => ({
      partnerId: p.id,
      partnerName: p.name,
      company: p.company,
      metric: p.activeCustomers,
      metricLabel: `${p.activeCustomers} active customers`,
      rank: i + 1,
      badge: calculatePartnerBadge(p, customers, leads, transactions, partners),
    }));
  sections.push({ key: 'highestSales', title: 'Most Active Customers', subtitle: 'Partners with most active customers', iconName: 'TrendingUp', entries: highestSales });

  const now = new Date('2026-10-10');
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const mostActive = [...partners]
    .map(p => {
      const count = leads.filter(l => l.partnerId === p.id && new Date(l.submittedDate) >= monthStart).length;
      return { partner: p, count };
    })
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((x, i) => ({
      partnerId: x.partner.id,
      partnerName: x.partner.name,
      company: x.partner.company,
      metric: x.count,
      metricLabel: `${x.count} leads this month`,
      rank: i + 1,
      badge: calculatePartnerBadge(x.partner, customers, leads, transactions, partners),
    }));
  sections.push({ key: 'mostActive', title: 'Most Active Partners', subtitle: 'Most leads submitted this month', iconName: 'Target', entries: mostActive });

  const newChampion = partners
    .filter(p => {
      const j = new Date(p.joinedDate);
      const ms = (now.getFullYear() - j.getFullYear()) * 12 + (now.getMonth() - j.getMonth());
      return ms <= 12 && p.monthlyCommission > 0;
    })
    .sort((a, b) => b.monthlyCommission - a.monthlyCommission)
    .slice(0, 10)
    .map((p, i) => ({
      partnerId: p.id,
      partnerName: p.name,
      company: p.company,
      metric: p.monthlyCommission,
      metricLabel: `${formatCurrency(p.monthlyCommission)} monthly commission`,
      rank: i + 1,
      badge: calculatePartnerBadge(p, customers, leads, transactions, partners),
    }));
  sections.push({ key: 'newChampion', title: 'New Partner Champion', subtitle: 'Top new partner (joined within 12 months)', iconName: 'Rocket', entries: newChampion });

  return sections;
}
