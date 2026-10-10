import type {
  User, Partner, Customer, Lead, Employee, Category,
  Announcement, Product, Notification, Plan, AppSettings,
  CommissionTransaction, SiteContent, Role,
} from '@/types';

export const allAdminSections: { key: import('@/types').AdminSectionKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'partners', label: 'Partners' },
  { key: 'leads', label: 'Leads' },
  { key: 'employees', label: 'Employees' },
  { key: 'categories', label: 'Categories' },
  { key: 'plans', label: 'Plans & Rates' },
  { key: 'products', label: 'Products' },
  { key: 'content', label: 'Content Manager' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'leaderboard', label: 'Leaderboard' },
  { key: 'settings', label: 'Settings' },
  { key: 'roles', label: 'Roles & Permissions' },
];

export const defaultRoles: Role[] = [
  { id: 'role-full-admin', name: 'Full Access', description: 'Full access to all admin panel sections', permissions: ['dashboard','partners','leads','employees','categories','plans','products','content','announcements','leaderboard','settings','roles'], isDefault: true },
  { id: 'role-partner-manager', name: 'Partner Manager', description: 'Manage partners, leads, and view dashboard', permissions: ['dashboard','partners','leads','leaderboard'], isDefault: true },
  { id: 'role-support-lead', name: 'Support Lead', description: 'Handle announcements and view leaderboard', permissions: ['dashboard','announcements','leaderboard'], isDefault: true },
  { id: 'role-onboarding', name: 'Onboarding Specialist', description: 'View dashboard and manage announcements', permissions: ['dashboard','announcements'], isDefault: true },
];

export const plans: Plan[] = [
  { id: 'plan-free', name: 'Free Plan', commissionRate: 5, type: 'Monthly', description: 'Starter plan with 5% commission rate' },
  { id: 'plan-premium', name: 'Premium Plan', commissionRate: 15, type: 'Monthly', description: 'Premium plan with 15% commission rate' },
  { id: 'plan-yearly-premium', name: 'Yearly Premium', commissionRate: 15, type: 'Yearly', description: 'Annual premium plan — lump-sum commission' },
];

export const appSettings: AppSettings = {
  leadLockDays: 3,
  commissionCapMonths: 12,
  defaultCurrency: '₹',
};

export const users: User[] = [
  { id: 'user-admin', email: 'admin@zubkas.com', name: 'Rajesh Kumar', role: 'admin', phone: '+91 98765 43210', joinedDate: '2024-01-01' },
  { id: 'user-emp1', email: 'employee@zubkas.com', name: 'Priya Sharma', role: 'employee', employeeRole: 'Partner Manager', phone: '+91 98765 11111', joinedDate: '2024-03-15' },
  { id: 'user-emp2', email: 'support@zubkas.com', name: 'Arjun Mehta', role: 'employee', employeeRole: 'Support Lead', phone: '+91 98765 22222', joinedDate: '2024-05-20' },
  { id: 'user-partner1', email: 'partner@zubkas.com', name: 'Vikram Singh', role: 'partner', partnerId: 'partner-1', phone: '+91 90000 11111', joinedDate: '2024-02-10' },
  { id: 'user-partner2', email: 'neha@zubkas.com', name: 'Neha Gupta', role: 'partner', partnerId: 'partner-2', phone: '+91 90000 22222', joinedDate: '2024-04-05' },
  { id: 'user-partner3', email: 'rahul@zubkas.com', name: 'Rahul Verma', role: 'partner', partnerId: 'partner-3', phone: '+91 90000 33333', joinedDate: '2024-06-18' },
  { id: 'user-partner4', email: 'anita@zubkas.com', name: 'Anita Desai', role: 'partner', partnerId: 'partner-4', phone: '+91 90000 44444', joinedDate: '2025-01-12' },
  { id: 'user-partner5', email: 'suresh@zubkas.com', name: 'Suresh Patel', role: 'partner', partnerId: 'partner-5', phone: '+91 90000 55555', joinedDate: '2025-03-22' },
];

export const partners: Partner[] = [
  { id: 'partner-1', name: 'Vikram Singh', email: 'partner@zubkas.com', phone: '+91 90000 11111', company: 'TechReach Solutions', status: 'Active', joinedDate: '2024-02-10', category: 'Technology', totalCommission: 285000, monthlyCommission: 42000, pendingCommission: 8500, activeCustomers: 28, monthlySales: 840000, badge: 'Top Performer' },
  { id: 'partner-2', name: 'Neha Gupta', email: 'neha@zubkas.com', phone: '+91 90000 22222', company: 'GrowthLink Digital', status: 'Active', joinedDate: '2024-04-05', category: 'Digital Marketing', totalCommission: 192000, monthlyCommission: 31000, pendingCommission: 0, activeCustomers: 19, monthlySales: 620000, badge: 'Rising Star' },
  { id: 'partner-3', name: 'Rahul Verma', email: 'rahul@zubkas.com', phone: '+91 90000 33333', company: 'BizConnect India', status: 'Active', joinedDate: '2024-06-18', category: 'Business Services', totalCommission: 156000, monthlyCommission: 26500, pendingCommission: 12000, activeCustomers: 15, monthlySales: 530000, badge: 'Consistent Earner' },
  { id: 'partner-4', name: 'Anita Desai', email: 'anita@zubkas.com', phone: '+91 90000 44444', company: 'CloudFirst Consulting', status: 'Active', joinedDate: '2025-01-12', category: 'Cloud Services', totalCommission: 48000, monthlyCommission: 18500, pendingCommission: 3000, activeCustomers: 8, monthlySales: 370000, badge: 'New Champion' },
  { id: 'partner-5', name: 'Suresh Patel', email: 'suresh@zubkas.com', phone: '+91 90000 55555', company: 'RetailBoost Partners', status: 'Active', joinedDate: '2025-03-22', category: 'Retail', totalCommission: 22000, monthlyCommission: 12000, pendingCommission: 5000, activeCustomers: 6, monthlySales: 240000 },
];

function calcRemaining(startDate: string, planType: 'Monthly' | 'Yearly'): { monthsElapsed: number; remainingMonths: number; commissionEndDate: string } {
  const start = new Date(startDate);
  const now = new Date('2026-10-08');
  const monthsElapsed = Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()));
  if (planType === 'Yearly') {
    return { monthsElapsed: 1, remainingMonths: 0, commissionEndDate: new Date(start.getFullYear() + 1, start.getMonth(), start.getDate()).toISOString().split('T')[0] };
  }
  const remainingMonths = Math.max(0, 12 - monthsElapsed);
  const endDate = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
  return { monthsElapsed, remainingMonths, commissionEndDate: endDate.toISOString().split('T')[0] };
}

export const customers: Customer[] = [
  // Partner 1 - Vikram Singh
  (() => { const c = calcRemaining('2026-01-15', 'Monthly'); return { id: 'c-1', partnerId: 'partner-1', name: 'Aakash Malhotra', companyName: 'Malhotra Textiles', phone: '+91 80123 45601', email: 'aakash@malhotra-textiles.com', whatsapp: '+91 80123 45601', planType: 'Monthly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 5000, startDate: '2026-01-15', renewalDate: '2026-11-15', status: 'Active' as const, commissionEarned: 7500, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2025-09-01', 'Monthly'); return { id: 'c-2', partnerId: 'partner-1', name: 'Deepika Nair', companyName: 'Nair & Sons', phone: '+91 80123 45602', email: 'deepika@nairsons.com', whatsapp: '+91 80123 45602', planType: 'Monthly' as const, planTier: 'Free', commissionRate: 5, subscriptionAmount: 2000, startDate: '2025-09-01', renewalDate: '2026-10-01', status: 'Active' as const, commissionEarned: 700, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2026-09-01', 'Yearly'); return { id: 'c-3', partnerId: 'partner-1', name: 'Sanjay Rao', companyName: 'Rao Electronics', phone: '+91 80123 45603', email: 'sanjay@raoelectronics.com', whatsapp: '+91 80123 45603', planType: 'Yearly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 60000, startDate: '2026-09-01', renewalDate: '2027-09-01', status: 'Active' as const, commissionEarned: 9000, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2026-08-15', 'Monthly'); return { id: 'c-4', partnerId: 'partner-1', name: 'Meera Joshi', companyName: 'Joshi Fashions', phone: '+91 80123 45604', email: 'meera@joshifashions.com', whatsapp: '+91 80123 45604', planType: 'Monthly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 8000, startDate: '2026-08-15', renewalDate: '2026-10-15', status: 'Unpaid' as const, commissionEarned: 1200, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2025-11-20', 'Monthly'); return { id: 'c-5', partnerId: 'partner-1', name: 'Karthik Iyer', companyName: 'Iyer Logistics', phone: '+91 80123 45605', email: 'karthik@iyerlogistics.com', whatsapp: '+91 80123 45605', planType: 'Monthly' as const, planTier: 'Free', commissionRate: 5, subscriptionAmount: 3000, startDate: '2025-11-20', renewalDate: '2026-11-20', status: 'Active' as const, commissionEarned: 1650, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),

  // Partner 2 - Neha Gupta
  (() => { const c = calcRemaining('2026-02-01', 'Monthly'); return { id: 'c-6', partnerId: 'partner-2', name: 'Pooja Reddy', companyName: 'Reddy Foods', phone: '+91 80123 45611', email: 'pooja@reddyfoods.com', whatsapp: '+91 80123 45611', planType: 'Monthly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 6000, startDate: '2026-02-01', renewalDate: '2026-11-01', status: 'Active' as const, commissionEarned: 8100, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2026-07-10', 'Monthly'); return { id: 'c-7', partnerId: 'partner-2', name: 'Rohit Kapoor', companyName: 'Kapoor Auto', phone: '+91 80123 45612', email: 'rohit@kapoorauto.com', whatsapp: '+91 80123 45612', planType: 'Monthly' as const, planTier: 'Free', commissionRate: 5, subscriptionAmount: 2500, startDate: '2026-07-10', renewalDate: '2026-11-10', status: 'Active' as const, commissionEarned: 750, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2026-08-01', 'Monthly'); return { id: 'c-8', partnerId: 'partner-2', name: 'Sneha Agarwal', companyName: 'Agarwal Pharma', phone: '+91 80123 45613', email: 'sneha@agarwalpharma.com', whatsapp: '+91 80123 45613', planType: 'Monthly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 10000, startDate: '2026-08-01', renewalDate: '2026-10-01', status: 'Unpaid' as const, commissionEarned: 1500, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),

  // Partner 3 - Rahul Verma
  (() => { const c = calcRemaining('2026-01-20', 'Monthly'); return { id: 'c-9', partnerId: 'partner-3', name: 'Imran Khan', companyName: 'Khan Builders', phone: '+91 80123 45621', email: 'imran@khanbuilders.com', whatsapp: '+91 80123 45621', planType: 'Monthly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 7000, startDate: '2026-01-20', renewalDate: '2026-11-20', status: 'Active' as const, commissionEarned: 9450, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2026-03-15', 'Monthly'); return { id: 'c-10', partnerId: 'partner-3', name: 'Farida Sheikh', companyName: 'Sheikh Trading', phone: '+91 80123 45622', email: 'farida@sheikhtrading.com', whatsapp: '+91 80123 45622', planType: 'Monthly' as const, planTier: 'Free', commissionRate: 5, subscriptionAmount: 2000, startDate: '2026-03-15', renewalDate: '2026-11-15', status: 'Active' as const, commissionEarned: 700, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2026-09-01', 'Yearly'); return { id: 'c-11', partnerId: 'partner-3', name: 'Vinod Bhatia', companyName: 'Bhatia Motors', phone: '+91 80123 45623', email: 'vinod@bhatiamotors.com', whatsapp: '+91 80123 45623', planType: 'Yearly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 45000, startDate: '2026-09-01', renewalDate: '2027-09-01', status: 'Active' as const, commissionEarned: 6750, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2026-08-20', 'Monthly'); return { id: 'c-12', partnerId: 'partner-3', name: 'Lakshmi Venkat', companyName: 'Venkat Caterers', phone: '+91 80123 45624', email: 'lakshmi@venkatcaterers.com', whatsapp: '+91 80123 45624', planType: 'Monthly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 5000, startDate: '2026-08-20', renewalDate: '2026-10-20', status: 'Unpaid' as const, commissionEarned: 750, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),

  // Partner 4 - Anita Desai
  (() => { const c = calcRemaining('2026-05-01', 'Monthly'); return { id: 'c-13', partnerId: 'partner-4', name: 'Manish Tiwari', companyName: 'Tiwari Chemicals', phone: '+91 80123 45631', email: 'manish@tiwarichemicals.com', whatsapp: '+91 80123 45631', planType: 'Monthly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 8000, startDate: '2026-05-01', renewalDate: '2026-11-01', status: 'Active' as const, commissionEarned: 7200, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2026-07-15', 'Monthly'); return { id: 'c-14', partnerId: 'partner-4', name: 'Renu Bhardwaj', companyName: 'Bhardwaj Realty', phone: '+91 80123 45632', email: 'renu@bhardwajrealty.com', whatsapp: '+91 80123 45632', planType: 'Monthly' as const, planTier: 'Free', commissionRate: 5, subscriptionAmount: 3000, startDate: '2026-07-15', renewalDate: '2026-11-15', status: 'Active' as const, commissionEarned: 450, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2026-09-01', 'Yearly'); return { id: 'c-15', partnerId: 'partner-4', name: 'Gaurav Saxena', companyName: 'Saxena Exports', phone: '+91 80123 45633', email: 'gaurav@saxenaexports.com', whatsapp: '+91 80123 45633', planType: 'Yearly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 55000, startDate: '2026-09-01', renewalDate: '2027-09-01', status: 'Active' as const, commissionEarned: 8250, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),

  // Partner 5 - Suresh Patel
  (() => { const c = calcRemaining('2026-06-01', 'Monthly'); return { id: 'c-16', partnerId: 'partner-5', name: 'Hemant Shah', companyName: 'Shah Retail', phone: '+91 80123 45641', email: 'hemant@shahretail.com', whatsapp: '+91 80123 45641', planType: 'Monthly' as const, planTier: 'Premium', commissionRate: 15, subscriptionAmount: 6000, startDate: '2026-06-01', renewalDate: '2026-11-01', status: 'Active' as const, commissionEarned: 4500, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
  (() => { const c = calcRemaining('2026-09-01', 'Yearly'); return { id: 'c-17', partnerId: 'partner-5', name: 'Kavita Jain', companyName: 'Jain Supermart', phone: '+91 80123 45642', email: 'kavita@jainsupermart.com', whatsapp: '+91 80123 45642', planType: 'Yearly' as const, planTier: 'Free', commissionRate: 5, subscriptionAmount: 24000, startDate: '2026-09-01', renewalDate: '2027-09-01', status: 'Active' as const, commissionEarned: 1200, commissionEndDate: c.commissionEndDate, monthsElapsed: c.monthsElapsed, remainingMonths: c.remainingMonths }; })(),
];

export const leads: Lead[] = [
  { id: 'l-1', partnerId: 'partner-1', partnerName: 'Vikram Singh', companyName: 'Sunrise Industries', contactName: 'Ramesh Tiwari', email: 'ramesh@sunrise.com', phone: '+91 70000 10001', status: 'Locked', submittedDate: '2026-10-06', lockEndDate: '2026-10-09', notes: 'Interested in Workspace + POS bundle' },
  { id: 'l-2', partnerId: 'partner-2', partnerName: 'Neha Gupta', companyName: 'GreenLeaf Organics', contactName: 'Ananya Bose', email: 'ananya@greenleaf.com', phone: '+91 70000 10002', status: 'Open', submittedDate: '2026-09-28', lockEndDate: '2026-10-01', notes: 'Looking for Storepulse demo' },
  { id: 'l-3', partnerId: 'partner-3', partnerName: 'Rahul Verma', companyName: 'Apex Construction', contactName: 'Vivek Menon', email: 'vivek@apexconstr.com', phone: '+91 70000 10003', status: 'Converted', submittedDate: '2026-08-15', lockEndDate: '2026-08-18', notes: 'Signed up for Construction Management' },
  { id: 'l-4', partnerId: 'partner-1', partnerName: 'Vikram Singh', companyName: 'Pinnacle Retail', contactName: 'Sonia Kapoor', email: 'sonia@pinnacleretail.com', phone: '+91 70000 10004', status: 'Open', submittedDate: '2026-10-01', lockEndDate: '2026-10-04', notes: 'Wants POS + Storepulse' },
  { id: 'l-5', partnerId: 'partner-4', partnerName: 'Anita Desai', companyName: 'TechNova Labs', contactName: 'Aditya Rao', email: 'aditya@technovalabs.com', phone: '+91 70000 10005', status: 'Locked', submittedDate: '2026-10-07', lockEndDate: '2026-10-10', notes: 'Exploring Workspace for 200 users' },
  { id: 'l-6', partnerId: 'partner-2', partnerName: 'Neha Gupta', companyName: 'BlueWave Pharma', contactName: 'Nikhil Deshmukh', email: 'nikhil@bluewavepharma.com', phone: '+91 70000 10006', status: 'Lost', submittedDate: '2026-08-20', lockEndDate: '2026-08-23', notes: 'Went with competitor' },
  { id: 'l-7', partnerId: 'partner-5', partnerName: 'Suresh Patel', companyName: 'Metro Mart Chain', contactName: 'Pallavi Kulkarni', email: 'pallavi@metromart.com', phone: '+91 70000 10007', status: 'Locked', submittedDate: '2026-10-07', lockEndDate: '2026-10-10', notes: '50-store POS deployment' },
  { id: 'l-8', partnerId: 'partner-1', partnerName: 'Vikram Singh', companyName: 'Horizon Tech Solutions', contactName: 'Kavya Iyengar', email: 'kavya@horizontech.com', phone: '+91 70000 10008', status: 'Pending Approval', submittedDate: '2026-10-09', lockEndDate: '2026-10-09', notes: 'Interested in Workspace for 500 users' },
  { id: 'l-9', partnerId: 'partner-3', partnerName: 'Rahul Verma', companyName: 'Verma Logistics Co', contactName: 'Arjun Nair', email: 'arjun@vermalogistics.com', phone: '+91 70000 10009', status: 'Pending Approval', submittedDate: '2026-10-09', lockEndDate: '2026-10-09', notes: 'Needs Storepulse for 12 warehouses' },
];

export const employees: Employee[] = [
  { id: 'emp-1', name: 'Priya Sharma', email: 'employee@zubkas.com', role: 'Partner Manager', roleId: 'role-partner-manager', status: 'Active', joinedDate: '2024-03-15' },
  { id: 'emp-2', name: 'Arjun Mehta', email: 'support@zubkas.com', role: 'Support Lead', roleId: 'role-support-lead', status: 'Active', joinedDate: '2024-05-20' },
  { id: 'emp-3', name: 'Divya Krishnan', email: 'divya@zubkas.com', role: 'Onboarding Specialist', roleId: 'role-onboarding', status: 'Active', joinedDate: '2025-02-01' },
  { id: 'emp-4', name: 'Siddharth Roy', email: 'sid@zubkas.com', role: 'Account Manager', roleId: 'role-partner-manager', status: 'Inactive', joinedDate: '2024-09-10' },
];

export const categories: Category[] = [
  { id: 'cat-1', name: 'Technology', description: 'Software, IT services, and tech consulting partners', partnerCount: 12 },
  { id: 'cat-2', name: 'Digital Marketing', description: 'Marketing agencies and digital growth partners', partnerCount: 8 },
  { id: 'cat-3', name: 'Business Services', description: 'General business consulting and B2B services', partnerCount: 15 },
  { id: 'cat-4', name: 'Cloud Services', description: 'Cloud infrastructure and migration specialists', partnerCount: 6 },
  { id: 'cat-5', name: 'Retail', description: 'Retail chains and e-commerce partners', partnerCount: 10 },
];

export const announcements: Announcement[] = [
  { id: 'a-1', title: 'Zubkas POS v3.0 is now live!', content: 'We are thrilled to announce the launch of Zubkas POS v3.0 with enhanced inventory tracking, multi-store support, and real-time analytics. Partners can now earn 15% commission on all new POS subscriptions.', type: 'product', author: 'Rajesh Kumar', authorRole: 'Admin', date: '2026-10-05', isPinned: true },
  { id: 'a-2', title: 'New Lead Lock Period: 5 Days', content: 'Starting October 10, the lead lock period will be extended from 3 to 5 days, giving partners more time to convert leads before they become open.', type: 'update', author: 'Priya Sharma', authorRole: 'Partner Manager', date: '2026-10-03', isPinned: false },
  { id: 'a-3', title: 'Q3 Commission Payouts Processed', content: 'All Q3 commission payouts have been processed and will reflect in partner accounts by October 12. Thank you for your continued partnership!', type: 'general', author: 'Arjun Mehta', authorRole: 'Support Lead', date: '2026-10-01', isPinned: false },
  { id: 'a-4', title: 'Zubkas Construction Management — New Module', content: 'A new Project Costing module has been added to Zubkas Construction Management. Partners promoting this product are eligible for an additional 2% bonus commission this quarter.', type: 'product', author: 'Rajesh Kumar', authorRole: 'Admin', date: '2026-09-25', isPinned: true },
  { id: 'a-5', title: 'Scheduled Maintenance: Oct 15', content: 'The Zubkas Partner Portal will undergo scheduled maintenance on October 15 from 2:00 AM to 4:00 AM IST. Please plan your activities accordingly.', type: 'maintenance', author: 'Divya Krishnan', authorRole: 'Onboarding Specialist', date: '2026-09-20', isPinned: false },
];

export const products: Product[] = [
  { id: 'p-1', name: 'Zubkas Workspace', description: 'All-in-one team collaboration and productivity platform with docs, tasks, chat, and file sharing.', icon: 'Briefcase', features: ['Unlimited team members', 'Real-time collaboration', 'Custom workflows', 'Advanced permissions'], commissionEligible: true, commissionRate: '15% recurring', price: '₹499/month', status: 'Active', launchDate: '2024-01-15' },
  { id: 'p-2', name: 'Zubkas Storepulse', description: 'Retail analytics and inventory optimization tool for modern stores with predictive demand forecasting.', icon: 'BarChart3', features: ['Real-time stock alerts', 'Demand forecasting', 'Supplier management', 'Sales analytics dashboard'], commissionEligible: true, commissionRate: '15% recurring', price: '₹999/month', status: 'Active', launchDate: '2024-06-01' },
  { id: 'p-3', name: 'Zubkas Construction Management', description: 'End-to-end construction project management with budgeting, scheduling, and resource allocation.', icon: 'HardHat', features: ['Project budgeting', 'Gantt scheduling', 'Resource allocation', 'Project Costing module'], commissionEligible: true, commissionRate: '15% recurring', price: '₹1,499/month', status: 'Active', launchDate: '2025-03-10' },
  { id: 'p-4', name: 'Zubkas POS', description: 'Point-of-sale system for retail and restaurants with multi-store support and offline mode.', icon: 'CreditCard', features: ['Multi-store support', 'Offline mode', 'Inventory sync', 'Real-time analytics'], commissionEligible: true, commissionRate: '15% recurring', price: '₹799/month', status: 'Active', launchDate: '2024-09-20' },
  { id: 'p-5', name: 'Zubkas Payroll', description: 'Automated payroll processing with tax compliance and employee self-service portal.', icon: 'Wallet', features: ['Auto tax calculation', 'Payslip generation', 'Employee portal', 'Compliance reports'], commissionEligible: true, commissionRate: '15% recurring', price: '₹699/month', status: 'Active', launchDate: '2025-06-15' },
  { id: 'p-6', name: 'Zubkas CRM', description: 'Customer relationship management with lead scoring, pipeline tracking, and automation.', icon: 'Users', features: ['Lead scoring', 'Pipeline tracking', 'Email automation', 'Custom dashboards'], commissionEligible: true, commissionRate: '10% recurring', price: '₹899/month', status: 'Beta', launchDate: '2026-01-01' },
  { id: 'p-7', name: 'Zubkas AI Assistant', description: 'AI-powered business assistant that integrates across all Zubkas products for smart automation.', icon: 'Sparkles', features: ['Natural language queries', 'Cross-product insights', 'Automated reports', 'Smart recommendations'], commissionEligible: false, commissionRate: 'Not eligible', price: 'TBD', status: 'Coming Soon' },
];

export const notifications: Notification[] = [
  { id: 'n-1', userId: 'partner-1', title: 'Commission Earned', message: 'You earned ₹750 commission from Aakash Malhotra (Malhotra Textiles) this month.', type: 'commission', date: '2026-10-07', read: false },
  { id: 'n-2', userId: 'partner-1', title: 'Payment Unpaid Alert', message: 'Meera Joshi (Joshi Fashions) has an unpaid subscription. Commission for this month has been blocked.', type: 'payment', date: '2026-10-06', read: false },
  { id: 'n-3', userId: 'partner-1', title: 'New Product Launch', message: 'Zubkas POS v3.0 is now live! Earn 15% commission on new subscriptions.', type: 'announcement', date: '2026-10-05', read: true },
  { id: 'n-4', userId: 'partner-1', title: 'Lead Locked', message: 'Your lead "Sunrise Industries" is locked until October 9.', type: 'lead', date: '2026-10-06', read: false },
  { id: 'n-5', userId: 'partner-2', title: 'Commission Earned', message: 'You earned ₹900 commission from Pooja Reddy (Reddy Foods) this month.', type: 'commission', date: '2026-10-07', read: false },
  { id: 'n-6', userId: 'partner-2', title: 'Payment Unpaid Alert', message: 'Sneha Agarwal (Agarwal Pharma) has an unpaid subscription. Commission blocked for this month.', type: 'payment', date: '2026-10-06', read: false },
  { id: 'n-7', userId: 'admin', title: 'New Partner Registered', message: 'Suresh Patel (RetailBoost Partners) joined the partner program.', type: 'system', date: '2025-03-22', read: true },
  { id: 'n-8', userId: 'partner-3', title: 'Lead Converted', message: 'Your lead "Apex Construction" has been converted to a customer!', type: 'lead', date: '2026-09-15', read: true },
  { id: 'n-9', userId: 'partner-4', title: 'New Badge Earned', message: 'Congratulations! You earned the "New Champion" badge.', type: 'system', date: '2026-09-01', read: true },
];

export const leaderboard = {
  monthlyTop: [
    { partnerId: 'partner-1', partnerName: 'Vikram Singh', company: 'TechReach Solutions', metric: 840000, metricLabel: '₹8,40,000 sales', rank: 1, badge: 'Top Performer' },
    { partnerId: 'partner-2', partnerName: 'Neha Gupta', company: 'GrowthLink Digital', metric: 620000, metricLabel: '₹6,20,000 sales', rank: 2, badge: 'Rising Star' },
    { partnerId: 'partner-3', partnerName: 'Rahul Verma', company: 'BizConnect India', metric: 530000, metricLabel: '₹5,30,000 sales', rank: 3, badge: 'Consistent Earner' },
    { partnerId: 'partner-4', partnerName: 'Anita Desai', company: 'CloudFirst Consulting', metric: 370000, metricLabel: '₹3,70,000 sales', rank: 4, badge: 'New Champion' },
  ],
  highestSales: [
    { partnerId: 'partner-1', partnerName: 'Vikram Singh', company: 'TechReach Solutions', metric: 28, metricLabel: '28 active customers', rank: 1, badge: 'Top Performer' },
    { partnerId: 'partner-2', partnerName: 'Neha Gupta', company: 'GrowthLink Digital', metric: 19, metricLabel: '19 active customers', rank: 2, badge: 'Rising Star' },
    { partnerId: 'partner-3', partnerName: 'Rahul Verma', company: 'BizConnect India', metric: 15, metricLabel: '15 active customers', rank: 3, badge: 'Consistent Earner' },
  ],
  mostActive: [
    { partnerId: 'partner-1', partnerName: 'Vikram Singh', company: 'TechReach Solutions', metric: 7, metricLabel: '7 leads this month', rank: 1, badge: 'Top Performer' },
    { partnerId: 'partner-2', partnerName: 'Neha Gupta', company: 'GrowthLink Digital', metric: 5, metricLabel: '5 leads this month', rank: 2, badge: 'Rising Star' },
    { partnerId: 'partner-5', partnerName: 'Suresh Patel', company: 'RetailBoost Partners', metric: 4, metricLabel: '4 leads this month', rank: 3, badge: '' },
  ],
  newChampion: [
    { partnerId: 'partner-4', partnerName: 'Anita Desai', company: 'CloudFirst Consulting', metric: 18500, metricLabel: '₹18,500 monthly commission', rank: 1, badge: 'New Champion' },
    { partnerId: 'partner-5', partnerName: 'Suresh Patel', company: 'RetailBoost Partners', metric: 12000, metricLabel: '₹12,000 monthly commission', rank: 2, badge: '' },
  ],
};

export const badges = [
  { id: 'b-1', name: 'Top Performer', icon: 'Crown', description: 'Highest monthly sales among all partners', color: 'text-amber-600' },
  { id: 'b-2', name: 'Rising Star', icon: 'Star', description: 'Consistent growth over 3 months', color: 'text-blue-600' },
  { id: 'b-3', name: 'Consistent Earner', icon: 'Award', description: 'Steady commission earnings for 6+ months', color: 'text-emerald-600' },
  { id: 'b-4', name: 'New Champion', icon: 'Rocket', description: 'Top performing new partner (joined within 12 months)', color: 'text-purple-600' },
  { id: 'b-5', name: 'Lead Master', icon: 'Target', description: 'Converted 10+ leads in a quarter', color: 'text-zubkas-700' },
];

export const commissionTransactions: CommissionTransaction[] = [
  // Partner 1
  { id: 'ct-1', partnerId: 'partner-1', customerName: 'Aakash Malhotra', companyName: 'Malhotra Textiles', amount: 750, rate: 15, planTier: 'Premium', month: 'Oct 2026', date: '2026-10-01', status: 'Paid' },
  { id: 'ct-2', partnerId: 'partner-1', customerName: 'Aakash Malhotra', companyName: 'Malhotra Textiles', amount: 750, rate: 15, planTier: 'Premium', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },
  { id: 'ct-3', partnerId: 'partner-1', customerName: 'Deepika Nair', companyName: 'Nair & Sons', amount: 100, rate: 5, planTier: 'Free', month: 'Oct 2026', date: '2026-10-01', status: 'Paid' },
  { id: 'ct-4', partnerId: 'partner-1', customerName: 'Sanjay Rao', companyName: 'Rao Electronics', amount: 9000, rate: 15, planTier: 'Premium', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },
  { id: 'ct-5', partnerId: 'partner-1', customerName: 'Meera Joshi', companyName: 'Joshi Fashions', amount: 1200, rate: 15, planTier: 'Premium', month: 'Oct 2026', date: '2026-10-01', status: 'Blocked' },
  { id: 'ct-6', partnerId: 'partner-1', customerName: 'Karthik Iyer', companyName: 'Iyer Logistics', amount: 150, rate: 5, planTier: 'Free', month: 'Oct 2026', date: '2026-10-01', status: 'Paid' },
  { id: 'ct-7', partnerId: 'partner-1', customerName: 'Aakash Malhotra', companyName: 'Malhotra Textiles', amount: 750, rate: 15, planTier: 'Premium', month: 'Aug 2026', date: '2026-08-01', status: 'Paid' },
  { id: 'ct-8', partnerId: 'partner-1', customerName: 'Meera Joshi', companyName: 'Joshi Fashions', amount: 1200, rate: 15, planTier: 'Premium', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },
  { id: 'ct-9', partnerId: 'partner-1', customerName: 'Aakash Malhotra', companyName: 'Malhotra Textiles', amount: 750, rate: 15, planTier: 'Premium', month: 'Jul 2026', date: '2026-07-01', status: 'Paid' },
  { id: 'ct-10', partnerId: 'partner-1', customerName: 'Deepika Nair', companyName: 'Nair & Sons', amount: 100, rate: 5, planTier: 'Free', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },

  // Partner 2
  { id: 'ct-11', partnerId: 'partner-2', customerName: 'Pooja Reddy', companyName: 'Reddy Foods', amount: 900, rate: 15, planTier: 'Premium', month: 'Oct 2026', date: '2026-10-01', status: 'Paid' },
  { id: 'ct-12', partnerId: 'partner-2', customerName: 'Rohit Kapoor', companyName: 'Kapoor Auto', amount: 125, rate: 5, planTier: 'Free', month: 'Oct 2026', date: '2026-10-01', status: 'Paid' },
  { id: 'ct-13', partnerId: 'partner-2', customerName: 'Sneha Agarwal', companyName: 'Agarwal Pharma', amount: 1500, rate: 15, planTier: 'Premium', month: 'Oct 2026', date: '2026-10-01', status: 'Blocked' },
  { id: 'ct-14', partnerId: 'partner-2', customerName: 'Pooja Reddy', companyName: 'Reddy Foods', amount: 900, rate: 15, planTier: 'Premium', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },
  { id: 'ct-15', partnerId: 'partner-2', customerName: 'Pooja Reddy', companyName: 'Reddy Foods', amount: 900, rate: 15, planTier: 'Premium', month: 'Aug 2026', date: '2026-08-01', status: 'Paid' },

  // Partner 3
  { id: 'ct-16', partnerId: 'partner-3', customerName: 'Imran Khan', companyName: 'Khan Builders', amount: 1050, rate: 15, planTier: 'Premium', month: 'Oct 2026', date: '2026-10-01', status: 'Paid' },
  { id: 'ct-17', partnerId: 'partner-3', customerName: 'Farida Sheikh', companyName: 'Sheikh Trading', amount: 100, rate: 5, planTier: 'Free', month: 'Oct 2026', date: '2026-10-01', status: 'Paid' },
  { id: 'ct-18', partnerId: 'partner-3', customerName: 'Vinod Bhatia', companyName: 'Bhatia Motors', amount: 6750, rate: 15, planTier: 'Premium', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },
  { id: 'ct-19', partnerId: 'partner-3', customerName: 'Lakshmi Venkat', companyName: 'Venkat Caterers', amount: 750, rate: 15, planTier: 'Premium', month: 'Oct 2026', date: '2026-10-01', status: 'Blocked' },
  { id: 'ct-20', partnerId: 'partner-3', customerName: 'Imran Khan', companyName: 'Khan Builders', amount: 1050, rate: 15, planTier: 'Premium', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },

  // Partner 4
  { id: 'ct-21', partnerId: 'partner-4', customerName: 'Manish Tiwari', companyName: 'Tiwari Chemicals', amount: 1200, rate: 15, planTier: 'Premium', month: 'Oct 2026', date: '2026-10-01', status: 'Paid' },
  { id: 'ct-22', partnerId: 'partner-4', customerName: 'Renu Bhardwaj', companyName: 'Bhardwaj Realty', amount: 150, rate: 5, planTier: 'Free', month: 'Oct 2026', date: '2026-10-01', status: 'Paid' },
  { id: 'ct-23', partnerId: 'partner-4', customerName: 'Gaurav Saxena', companyName: 'Saxena Exports', amount: 8250, rate: 15, planTier: 'Premium', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },
  { id: 'ct-24', partnerId: 'partner-4', customerName: 'Manish Tiwari', companyName: 'Tiwari Chemicals', amount: 1200, rate: 15, planTier: 'Premium', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },

  // Partner 5
  { id: 'ct-25', partnerId: 'partner-5', customerName: 'Hemant Shah', companyName: 'Shah Retail', amount: 900, rate: 15, planTier: 'Premium', month: 'Oct 2026', date: '2026-10-01', status: 'Paid' },
  { id: 'ct-26', partnerId: 'partner-5', customerName: 'Kavita Jain', companyName: 'Jain Supermart', amount: 1200, rate: 5, planTier: 'Free', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },
  { id: 'ct-27', partnerId: 'partner-5', customerName: 'Hemant Shah', companyName: 'Shah Retail', amount: 900, rate: 15, planTier: 'Premium', month: 'Sep 2026', date: '2026-09-01', status: 'Paid' },
];

export const defaultSiteContent: SiteContent = {
  landingBadge: 'Zubkas Authorized Partner Program',
  landingHeroTitle1: 'Earn recurring commissions',
  landingHeroTitle2: 'for up to 12 months',
  landingHeroTitle3: 'on every customer you refer',
  landingHeroSubtitle: 'Join the Zubkas Partner Program and earn up to 15% commission on every subscription. Track leads, monitor commissions, and climb the leaderboard — all from one powerful dashboard.',
  landingCtaPrimary: 'Become a Partner',
  landingCtaSecondary: 'Explore Features',
  landingFeaturesHeading: 'Everything you need to grow',
  landingFeaturesSubheading: 'A complete partner management platform with commission tracking, lead protection, and real-time analytics.',
  landingEarningsHeading: 'Watch your commissions grow',
  landingEarningsDesc: 'Every customer you refer generates commission automatically. Monthly plans earn every month for 12 months. Yearly plans earn a lump-sum. Track everything in real-time with visual progress bars and monthly breakdowns.',
  landingHowItWorksHeading: 'Start earning in 3 simple steps',
  landingCtaSectionHeading: 'Ready to start earning?',
  landingCtaSectionDesc: 'Sign in to access your partner dashboard, track commissions, and manage your referrals.',
  landingCtaSectionButton: 'Sign In to Dashboard',
  landingStat1Value: '500+',
  landingStat1Label: 'Active Partners',
  landingStat2Value: '₹2.4Cr+',
  landingStat2Label: 'Commission Paid',
  landingStat3Value: '1,200+',
  landingStat3Label: 'Customers Referred',
  landingStat4Value: '7',
  landingStat4Label: 'Products Suite',
  loginBadge: 'Authorized Partner Portal',
  loginHeroTitle1: 'Earn recurring commissions',
  loginHeroTitle2: 'for up to 12 months',
  loginHeroSubtitle: 'Refer customers to Zubkas products and earn 5-15% commission every month. Track your performance, manage leads, and grow your earnings.',
  loginPartnerTitle: 'Partner Login',
  loginPartnerSubtitle: 'Access your partner dashboard',
  loginAdminTitle: 'Admin / Employee Login',
  loginAdminSubtitle: 'Manage partners, plans, and announcements',
};
