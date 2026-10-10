export type UserRole = 'admin' | 'employee' | 'partner';

export type AdminSectionKey =
  | 'dashboard' | 'partners' | 'leads' | 'employees' | 'categories'
  | 'plans' | 'products' | 'content' | 'announcements' | 'leaderboard'
  | 'settings' | 'roles' | 'support';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: AdminSectionKey[];
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  whatsapp?: string;
  company?: string;
  partnerId?: string;
  employeeRole?: string;
  joinedDate: string;
}

export type PlanType = 'Monthly' | 'Yearly';
export type SubscriptionStatus = 'Active' | 'Unpaid';
export type PlanTier = 'Free' | 'Premium' | string;

export interface Plan {
  id: string;
  name: string;
  commissionRate: number;
  type: 'Monthly' | 'Yearly';
  description: string;
  isCustom?: boolean;
}

export interface Customer {
  id: string;
  partnerId: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  whatsapp: string;
  planType: PlanType;
  planTier: PlanTier;
  commissionRate: number;
  subscriptionAmount: number;
  startDate: string;
  renewalDate: string;
  status: SubscriptionStatus;
  commissionEarned: number;
  commissionEndDate: string;
  monthsElapsed: number;
  remainingMonths: number;
}

export interface Lead {
  id: string;
  partnerId: string;
  partnerName: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: 'Locked' | 'Open' | 'Converted' | 'Lost';
  submittedDate: string;
  lockEndDate: string;
  notes: string;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Active' | 'Suspended' | 'Pending';
  joinedDate: string;
  category: string;
  totalCommission: number;
  monthlyCommission: number;
  pendingCommission: number;
  activeCustomers: number;
  monthlySales: number;
  badge?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  partnerCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'product' | 'update' | 'maintenance' | 'general';
  author: string;
  authorRole: string;
  date: string;
  isPinned: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  commissionEligible: boolean;
  commissionRate: string;
  price: string;
  status: 'Active' | 'Beta' | 'Coming Soon';
  launchDate?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'commission' | 'lead' | 'announcement' | 'payment' | 'system';
  date: string;
  read: boolean;
}

export interface LeaderboardEntry {
  partnerId: string;
  partnerName: string;
  company: string;
  metric: number;
  metricLabel: string;
  rank: number;
  badge: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface AppSettings {
  leadLockDays: number;
  commissionCapMonths: number;
  defaultCurrency: string;
}

export interface CommissionTransaction {
  id: string;
  partnerId: string;
  customerName: string;
  companyName: string;
  amount: number;
  rate: number;
  planTier: string;
  month: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Blocked';
}

export interface SiteContent {
  // Landing page
  landingBadge: string;
  landingHeroTitle1: string;
  landingHeroTitle2: string;
  landingHeroTitle3: string;
  landingHeroSubtitle: string;
  landingCtaPrimary: string;
  landingCtaSecondary: string;
  landingFeaturesHeading: string;
  landingFeaturesSubheading: string;
  landingEarningsHeading: string;
  landingEarningsDesc: string;
  landingHowItWorksHeading: string;
  landingCtaSectionHeading: string;
  landingCtaSectionDesc: string;
  landingCtaSectionButton: string;
  landingStat1Value: string;
  landingStat1Label: string;
  landingStat2Value: string;
  landingStat2Label: string;
  landingStat3Value: string;
  landingStat3Label: string;
  landingStat4Value: string;
  landingStat4Label: string;
  // Login page
  loginBadge: string;
  loginHeroTitle1: string;
  loginHeroTitle2: string;
  loginHeroSubtitle: string;
  loginPartnerTitle: string;
  loginPartnerSubtitle: string;
  loginAdminTitle: string;
  loginAdminSubtitle: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderType: 'partner' | 'support';
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerCompany: string;
  subject: string;
  status: 'open' | 'closed';
  createdAt: string;
  lastMessageAt: string;
  unreadByPartner: number;
  unreadBySupport: number;
}
