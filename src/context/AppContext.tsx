import { createContext, useContext, useCallback, useEffect, useState, useRef, type ReactNode } from 'react';
import type {
  User, Partner, Customer, Lead, Employee, Category,
  Announcement, Notification, Plan, AppSettings, Product, SiteContent,
  CommissionTransaction, Role, AdminSectionKey,
  ChatThread, ChatMessage, LeadPaymentStatus, PlanType,
} from '@/types';
import { appSettings as defaultAppSettings, defaultSiteContent, defaultRoles } from '@/data/mockData';
import { usePersistentState } from '@/utils/usePersistentState';
import { useSupabaseState } from '@/utils/useSupabaseState';
import { supabase } from '@/lib/supabase';

interface ProfileUpdate {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  company?: string;
}

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

interface AppContextValue {
  currentUser: User | null;
  partnerUsers: User[];
  login: (email: string, password: string) => boolean;
  loginOtp: (email: string) => boolean;
  logout: () => void;
  dataLoaded: boolean;

  partners: Partner[];
  customers: Customer[];
  leads: Lead[];
  employees: Employee[];
  categories: Category[];
  announcements: Announcement[];
  notifications: Notification[];
  plans: Plan[];
  products: Product[];
  settings: AppSettings;
  siteContent: SiteContent;
  transactions: CommissionTransaction[];
  roles: Role[];

  hasPermission: (section: AdminSectionKey) => boolean;
  getEmployeePermissions: (roleId: string) => AdminSectionKey[];
  addRole: (r: Omit<Role, 'id'>) => void;
  updateRole: (id: string, updates: Partial<Omit<Role, 'id'>>) => void;
  deleteRole: (id: string) => void;
  assignEmployeeRole: (employeeId: string, roleId: string) => void;

  addPartner: (p: Omit<Partner, 'id' | 'totalCommission' | 'monthlyCommission' | 'pendingCommission' | 'activeCustomers' | 'monthlySales'> & { password: string }) => void;
  updatePartner: (id: string, updates: Partial<Omit<Partner, 'id'>>) => void;
  deletePartner: (id: string) => void;
  addEmployee: (e: Omit<Employee, 'id'> & { password: string }) => void;
  updateEmployee: (id: string, updates: Partial<Omit<Employee, 'id'>>) => void;
  deleteEmployee: (id: string) => void;
  addCategory: (c: Omit<Category, 'id' | 'partnerCount'>) => void;
  deleteCategory: (id: string) => void;
  addPlan: (p: Omit<Plan, 'id'>) => void;
  deletePlan: (id: string) => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  addAnnouncement: (a: Omit<Announcement, 'id' | 'date' | 'author' | 'authorRole' | 'isPinned'>) => void;
  deleteAnnouncement: (id: string) => void;
  deleteLead: (id: string) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  approveLead: (id: string, details: { productId?: string; productName?: string; planType: Lead['planType']; planPrice: number; commissionRate: number }) => void;
  updateLeadPayment: (id: string, details: { paymentStatus: LeadPaymentStatus; planPrice: number; commissionRate: number; renewalDate: string }) => void;
  convertLead: (id: string) => void;
  addLead: (l: Omit<Lead, 'id' | 'submittedDate' | 'lockEndDate' | 'status' | 'partnerName'>) => boolean;
  adminAddLead: (l: { partnerId: string; companyName: string; contactName: string; email: string; phone: string; whatsapp: string; productId?: string; productName?: string; planType: PlanType; notes: string }) => void;
  addCustomer: (c: Omit<Customer, 'id' | 'commissionEarned' | 'commissionEndDate' | 'monthsElapsed' | 'remainingMonths'>) => void;
  deleteCustomer: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  updateSiteContent: (s: Partial<SiteContent>) => void;
  resetSiteContent: () => void;
  clearDemoData: () => void;
  resetAllData: () => void;
  updateUserProfile: (updates: ProfileUpdate) => void;
  updateUserPassword: (updates: PasswordUpdate) => { success: boolean; error?: string };

  chatThreads: ChatThread[];
  chatMessages: ChatMessage[];
  startChatThread: (subject: string) => string;
  sendChatMessage: (threadId: string, text: string, fromSupport?: boolean) => void;
  markThreadReadByPartner: (threadId: string) => void;
  markThreadReadBySupport: (threadId: string) => void;
  closeChatThread: (threadId: string) => void;
  reopenChatThread: (threadId: string) => void;
  totalUnreadChatBySupport: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Session state stays in localStorage (it's just the current user)
  const [currentUser, setCurrentUser] = usePersistentState<User | null>('zubkas_currentUser', null);

  // Core data lives in Supabase
  const [partners, setPartners] = useSupabaseState<Partner[]>('partners', []);
  const [customers, setCustomers] = useSupabaseState<Customer[]>('customers', []);
  const [leads, setLeads] = useSupabaseState<Lead[]>('leads', []);
  const [employees, setEmployees] = useSupabaseState<Employee[]>('employees', []);
  const [categories, setCategories] = useSupabaseState<Category[]>('categories', []);
  const [announcements, setAnnouncements] = useSupabaseState<Announcement[]>('announcements', []);
  const [notifications, setNotifications] = useSupabaseState<Notification[]>('notifications', []);
  const [plans, setPlans] = useSupabaseState<Plan[]>('plans', []);
  const [products, setProducts] = useSupabaseState<Product[]>('products', []);
  const [transactions, setTransactions] = useSupabaseState<CommissionTransaction[]>('commission_transactions', []);
  const [roles, setRoles] = useSupabaseState<Role[]>('roles', defaultRoles);
  const [chatThreads, setChatThreads] = useSupabaseState<ChatThread[]>('chat_threads', []);
  const [chatMessages, setChatMessages] = useSupabaseState<ChatMessage[]>('chat_messages', []);

  // Site content is a JSON blob singleton
  const [siteContent, setSiteContent] = useSupabaseState<SiteContent>('site_content', defaultSiteContent, { singleton: true, singletonColumn: 'content' });

  // Settings has multiple columns, so we manage it with useState + manual Supabase sync
  const [settingsState, setSettingsState] = useState<AppSettings>(defaultAppSettings);
  const settingsLoadedRef = useRef(false);

  // App users (login system) — loaded from Supabase but kept in local state for synchronous login
  const [appUsers, setAppUsers] = useState<User[]>([]);
  const [userPasswords, setUserPasswords] = useState<Record<string, string>>({});
  const [partnerUsers, setPartnerUsers] = useState<User[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);

  // Track whether all data has loaded
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load app users + settings from Supabase on mount
  useEffect(() => {
    (async () => {
      // Load app users
      try {
        const { data, error } = await supabase.from('app_users').select('*');
        if (!error && data) {
          const users = data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            email: row.email as string,
            name: row.name as string,
            role: row.role as User['role'],
            phone: (row.phone as string) ?? undefined,
            whatsapp: (row.whatsapp as string) ?? undefined,
            company: (row.company as string) ?? undefined,
            partnerId: (row.partner_id as string) ?? undefined,
            employeeRole: (row.employee_role as string) ?? undefined,
            joinedDate: row.joined_date as string,
          }));
          setAppUsers(users);
          const pwdMap: Record<string, string> = {};
          for (const row of data as Record<string, unknown>[]) {
            if (row.password) pwdMap[row.id as string] = row.password as string;
          }
          setUserPasswords(pwdMap);
          setPartnerUsers(users.filter(u => u.role === 'partner'));
        }
      } catch {
        // ignore
      }

      // Load settings
      try {
        const { data: sData, error: sError } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 'singleton')
          .maybeSingle();
        if (!sError && sData) {
          const s = sData as Record<string, unknown>;
          settingsLoadedRef.current = true;
          setSettingsState({
            leadLockDays: (s.lead_lock_days as number) ?? 3,
            commissionCapMonths: (s.commission_cap_months as number) ?? 12,
            defaultCurrency: (s.default_currency as string) ?? '₹',
          });
        }
      } catch {
        // ignore
      }

      setUsersLoaded(true);
      setDataLoaded(true);
    })();
  }, []);

  // Persist settings to Supabase when they change (skip initial load)
  useEffect(() => {
    if (!settingsLoadedRef.current) return;
    settingsLoadedRef.current = true;
    (async () => {
      try {
        await supabase.from('app_settings').upsert({
          id: 'singleton',
          lead_lock_days: settingsState.leadLockDays,
          commission_cap_months: settingsState.commissionCapMonths,
          default_currency: settingsState.defaultCurrency,
          updated_at: new Date().toISOString(),
        });
      } catch {
        // ignore
      }
    })();
  }, [settingsState]);

  // Helper to insert an app_user into Supabase
  const insertAppUser = useCallback(async (user: User & { password?: string }) => {
    try {
      await supabase.from('app_users').insert({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone ?? null,
        whatsapp: user.whatsapp ?? null,
        company: user.company ?? null,
        partner_id: user.partnerId ?? null,
        employee_role: user.employeeRole ?? null,
        joined_date: user.joinedDate,
        password: user.password ?? '',
      });
    } catch {
      // ignore
    }
  }, []);

  // Helper to delete an app_user from Supabase
  const deleteAppUser = useCallback(async (id: string) => {
    try {
      await supabase.from('app_users').delete().eq('id', id);
    } catch {
      // ignore
    }
  }, []);

  // Helper to update an app_user in Supabase
  const updateAppUserInDb = useCallback(async (id: string, updates: Record<string, unknown>) => {
    try {
      await supabase.from('app_users').update(updates).eq('id', id);
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    const lowerEmail = email.toLowerCase();
    // Check app users (admin + seeded users)
    const dbUser = appUsers.find(u => u.email.toLowerCase() === lowerEmail);
    if (dbUser) {
      const storedPassword = userPasswords[dbUser.id];
      if (storedPassword !== undefined && storedPassword !== '' && storedPassword !== password) return false;
      setCurrentUser(dbUser);
      return true;
    }
    // Check partner users
    const partnerUser = partnerUsers.find(u => u.email.toLowerCase() === lowerEmail);
    if (partnerUser) {
      const storedPassword = userPasswords[partnerUser.id];
      if (storedPassword !== undefined && storedPassword !== '' && storedPassword !== password) return false;
      setCurrentUser(partnerUser);
      return true;
    }
    // Check employees
    const employee = employees.find(e => e.email.toLowerCase() === lowerEmail && e.status === 'Active');
    if (employee) {
      const empPwd = userPasswords[employee.id];
      if (empPwd !== undefined && empPwd !== '' && empPwd !== password) return false;
      setCurrentUser({
        id: employee.id,
        email: employee.email,
        name: employee.name,
        role: 'employee',
        employeeRole: employee.role,
        phone: employee.phone,
        whatsapp: employee.whatsapp,
        joinedDate: employee.joinedDate,
      });
      return true;
    }
    return false;
  }, [setCurrentUser, appUsers, userPasswords, partnerUsers, employees]);

  const loginOtp = useCallback((email: string) => {
    const lowerEmail = email.toLowerCase();
    const dbUser = appUsers.find(u => u.email.toLowerCase() === lowerEmail);
    if (dbUser) {
      setCurrentUser(dbUser);
      return true;
    }
    const partnerUser = partnerUsers.find(u => u.email.toLowerCase() === lowerEmail);
    if (partnerUser) {
      setCurrentUser(partnerUser);
      return true;
    }
    const employee = employees.find(e => e.email.toLowerCase() === lowerEmail && e.status === 'Active');
    if (employee) {
      setCurrentUser({
        id: employee.id,
        email: employee.email,
        name: employee.name,
        role: 'employee',
        employeeRole: employee.role,
        phone: employee.phone,
        whatsapp: employee.whatsapp,
        joinedDate: employee.joinedDate,
      });
      return true;
    }
    return false;
  }, [setCurrentUser, appUsers, partnerUsers, employees]);

  const logout = useCallback(() => setCurrentUser(null), [setCurrentUser]);

  const addPartner: AppContextValue['addPartner'] = useCallback((p) => {
    const partnerId = `partner-${Date.now()}`;
    const newPartner: Partner = {
      name: p.name,
      email: p.email,
      phone: p.phone,
      company: p.company,
      category: p.category,
      status: p.status,
      joinedDate: p.joinedDate,
      id: partnerId,
      totalCommission: 0,
      monthlyCommission: 0,
      pendingCommission: 0,
      activeCustomers: 0,
      monthlySales: 0,
    };
    setPartners(prev => [...prev, newPartner]);

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: p.email,
      name: p.name,
      role: 'partner',
      partnerId,
      phone: p.phone,
      company: p.company,
      joinedDate: p.joinedDate,
    };
    setPartnerUsers(prev => [...prev, newUser]);
    setAppUsers(prev => [...prev, newUser]);
    setUserPasswords(prev => ({ ...prev, [newUser.id]: p.password }));
    insertAppUser({ ...newUser, password: p.password });
  }, [setPartners, setPartnerUsers, setAppUsers, setUserPasswords, insertAppUser]);

  const updatePartner: AppContextValue['updatePartner'] = useCallback((id, updates) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    setPartnerUsers(prev => prev.map(u => u.partnerId === id ? { ...u, name: updates.name ?? u.name, email: updates.email ?? u.email, phone: updates.phone ?? u.phone, company: updates.company ?? u.company } : u));
    // Sync to app_users in Supabase
    const partnerUser = partnerUsers.find(u => u.partnerId === id);
    if (partnerUser) {
      updateAppUserInDb(partnerUser.id, {
        name: updates.name, email: updates.email, phone: updates.phone, company: updates.company,
      });
    }
  }, [setPartners, setPartnerUsers, partnerUsers, updateAppUserInDb]);

  const deletePartner: AppContextValue['deletePartner'] = useCallback((id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
    setCustomers(prev => prev.filter(c => c.partnerId !== id));
    setLeads(prev => prev.filter(l => l.partnerId !== id));
    setTransactions(prev => prev.filter(t => t.partnerId !== id));
    setNotifications(prev => prev.filter(n => n.userId !== id));
    const removedPartnerUsers = partnerUsers.filter(u => u.partnerId === id);
    setPartnerUsers(prev => prev.filter(u => u.partnerId !== id));
    setAppUsers(prev => prev.filter(u => u.partnerId !== id));
    setUserPasswords(prev => {
      const next = { ...prev };
      for (const u of removedPartnerUsers) delete next[u.id];
      return next;
    });
    for (const u of removedPartnerUsers) {
      deleteAppUser(u.id);
    }
  }, [setPartners, setCustomers, setLeads, setTransactions, setNotifications, setPartnerUsers, setAppUsers, setUserPasswords, partnerUsers, deleteAppUser]);

  const addEmployee: AppContextValue['addEmployee'] = useCallback((e) => {
    const employeeId = `emp-${Date.now()}`;
    const { password, ...employee } = e;
    setEmployees(prev => [...prev, { ...employee, id: employeeId }]);
    setUserPasswords(prev => ({ ...prev, [employeeId]: password }));
    // Also create an app_user for login
    const newUser: User = {
      id: employeeId,
      email: employee.email,
      name: employee.name,
      role: 'employee',
      employeeRole: employee.role,
      phone: employee.phone,
      whatsapp: employee.whatsapp,
      joinedDate: employee.joinedDate,
    };
    setAppUsers(prev => [...prev, newUser]);
    insertAppUser({ ...newUser, password });
  }, [setEmployees, setUserPasswords, setAppUsers, insertAppUser]);

  const assignEmployeeRole = useCallback((employeeId: string, roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    setEmployees(prev => prev.map(e =>
      e.id === employeeId ? { ...e, roleId, role: role?.name ?? e.role } : e
    ));
  }, [roles, setEmployees]);

  const addRole = useCallback((r: Omit<Role, 'id'>) => {
    setRoles(prev => [...prev, { ...r, id: `role-${Date.now()}` }]);
  }, [setRoles]);

  const updateRole = useCallback((id: string, updates: Partial<Omit<Role, 'id'>>) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, [setRoles]);

  const deleteRole = useCallback((id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  }, [setRoles]);

  const getEmployeePermissions = useCallback((roleId: string): AdminSectionKey[] => {
    return roles.find(r => r.id === roleId)?.permissions ?? [];
  }, [roles]);

  const hasPermission = useCallback((section: AdminSectionKey): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role !== 'employee') return false;
    const employee = employees.find(e => e.email === currentUser.email);
    if (!employee) return false;
    return getEmployeePermissions(employee.roleId).includes(section);
  }, [currentUser, employees, getEmployeePermissions]);

  const updateEmployee: AppContextValue['updateEmployee'] = useCallback((id, updates) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    // Sync to app_users
    updateAppUserInDb(id, {
      name: updates.name, email: updates.email, phone: updates.phone, whatsapp: updates.whatsapp,
    });
  }, [setEmployees, updateAppUserInDb]);

  const deleteEmployee: AppContextValue['deleteEmployee'] = useCallback((id) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setAppUsers(prev => prev.filter(u => u.id !== id));
    setUserPasswords(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    deleteAppUser(id);
  }, [setEmployees, setAppUsers, setUserPasswords, deleteAppUser]);

  const addCategory: AppContextValue['addCategory'] = useCallback((c) => {
    setCategories(prev => [...prev, { ...c, id: `cat-${Date.now()}`, partnerCount: 0 }]);
  }, [setCategories]);

  const deleteCategory: AppContextValue['deleteCategory'] = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, [setCategories]);

  const addPlan: AppContextValue['addPlan'] = useCallback((p) => {
    setPlans(prev => [...prev, { ...p, id: `plan-${Date.now()}`, isCustom: true }]);
  }, [setPlans]);

  const deletePlan: AppContextValue['deletePlan'] = useCallback((id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  }, [setPlans]);

  const addProduct: AppContextValue['addProduct'] = useCallback((p) => {
    setProducts(prev => [...prev, { ...p, id: `prod-${Date.now()}` }]);
  }, [setProducts]);

  const deleteProduct: AppContextValue['deleteProduct'] = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, [setProducts]);

  const deleteLead: AppContextValue['deleteLead'] = useCallback((id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  }, [setLeads]);

  const updateLeadStatus: AppContextValue['updateLeadStatus'] = useCallback((id, status) => {
    setLeads(prev => prev.map(l => l.id !== id ? l : { ...l, status }));
  }, [setLeads]);

  const approveLead: AppContextValue['approveLead'] = useCallback((id, details) => {
    const today = new Date().toISOString().split('T')[0];
    const lockEnd = new Date();
    lockEnd.setDate(lockEnd.getDate() + settingsState.leadLockDays);
    const lockEndDate = lockEnd.toISOString().split('T')[0];
    setLeads(prev => prev.map(l =>
      l.id !== id ? l : {
        ...l,
        status: 'Approved',
        lockEndDate,
        productId: details.productId,
        productName: details.productName,
        planType: details.planType,
        planPrice: details.planPrice,
        commissionRate: details.commissionRate,
      }
    ));
    const lead = leads.find(l => l.id === id);
    if (lead) {
      setNotifications(prev => [...prev, {
        id: `n-${Date.now()}`,
        userId: lead.partnerId,
        title: 'Lead Approved',
        message: `Your lead "${lead.companyName}" has been approved and locked for ${settingsState.leadLockDays} days. Convert it before the lock expires.`,
        type: 'lead',
        date: today,
        read: false,
      }]);
    }
  }, [leads, settingsState.leadLockDays, setLeads, setNotifications]);

  const updateLeadPayment: AppContextValue['updateLeadPayment'] = useCallback((id, details) => {
    setLeads(prev => prev.map(l =>
      l.id !== id ? l : {
        ...l,
        status: details.paymentStatus === 'Paid' ? 'Approved' : (l.status === 'Pending Approval' ? 'Locked' : l.status),
        paymentStatus: details.paymentStatus,
        planPrice: details.planPrice,
        commissionRate: details.commissionRate,
        renewalDate: details.renewalDate,
      }
    ));
    setCustomers(prev => prev.map(c =>
      c.leadId !== id ? c : {
        ...c,
        status: details.paymentStatus === 'Paid' ? 'Active' : 'Unpaid',
        commissionRate: details.commissionRate,
        subscriptionAmount: details.planPrice,
        renewalDate: details.renewalDate,
      }
    ));
    const lead = leads.find(l => l.id === id);
    if (lead) {
      setNotifications(prev => [...prev, {
        id: `n-${Date.now()}`,
        userId: lead.partnerId,
        title: details.paymentStatus === 'Paid' ? 'Payment Confirmed' : 'Payment Marked Unpaid',
        message: `Payment for lead "${lead.companyName}" has been marked as ${details.paymentStatus} by admin.${details.paymentStatus === 'Unpaid' ? ' Commissions are paused until payment is confirmed.' : ''}`,
        type: 'payment',
        date: new Date().toISOString().split('T')[0],
        read: false,
      }]);
    }
  }, [leads, setLeads, setCustomers, setNotifications]);

  const convertLead: AppContextValue['convertLead'] = useCallback((id) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const today = new Date().toISOString().split('T')[0];
    const renewalDate = lead.renewalDate ?? (lead.planType === 'Yearly'
      ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      : new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]);
    const commissionEndDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      partnerId: lead.partnerId,
      name: lead.contactName,
      companyName: lead.companyName,
      phone: lead.phone,
      email: lead.email,
      whatsapp: lead.whatsapp ?? lead.phone,
      planType: lead.planType ?? 'Monthly',
      planTier: 'Premium',
      commissionRate: lead.commissionRate ?? 15,
      subscriptionAmount: lead.planPrice ?? 0,
      startDate: today,
      renewalDate,
      status: lead.paymentStatus === 'Paid' ? 'Active' : 'Unpaid',
      commissionEarned: 0,
      commissionEndDate,
      monthsElapsed: 0,
      remainingMonths: 12,
      leadId: lead.id,
    };
    setCustomers(prev => [...prev, newCustomer]);
    setLeads(prev => prev.map(l => l.id !== id ? l : { ...l, status: 'Converted' }));
    setNotifications(prev => [...prev, {
      id: `n-${Date.now()}`,
      userId: lead.partnerId,
      title: 'Lead Converted',
      message: `Your lead "${lead.companyName}" has been converted to a customer.`,
      type: 'lead',
      date: today,
      read: false,
    }]);
  }, [leads, setCustomers, setLeads, setNotifications]);

  const adminAddLead: AppContextValue['adminAddLead'] = useCallback((l) => {
    const partner = l.partnerId === 'none' ? null : partners.find(p => p.id === l.partnerId);
    const today = new Date().toISOString().split('T')[0];
    const newLead: Lead = {
      id: `l-${Date.now()}`,
      partnerId: l.partnerId,
      partnerName: partner?.name ?? 'Admin (Direct)',
      companyName: l.companyName,
      contactName: l.contactName,
      email: l.email,
      phone: l.phone,
      whatsapp: l.whatsapp,
      status: 'Open',
      submittedDate: today,
      lockEndDate: today,
      notes: l.notes,
      productId: l.productId,
      productName: l.productName,
      planType: l.planType,
    };
    setLeads(prev => [...prev, newLead]);
    if (partner) {
      setNotifications(prev => [...prev, {
        id: `n-${Date.now()}`,
        userId: partner.id,
        title: 'New Lead Assigned',
        message: `A new lead for "${l.companyName}" has been created by admin and assigned to you.`,
        type: 'lead',
        date: today,
        read: false,
      }]);
    }
  }, [partners, setLeads, setNotifications]);

  const addCustomer: AppContextValue['addCustomer'] = useCallback((c) => {
    const start = new Date(c.startDate);
    const now = new Date();
    const monthsElapsed = c.planType === 'Yearly'
      ? 1
      : Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()));
    const remainingMonths = c.planType === 'Yearly' ? 0 : Math.max(0, 12 - monthsElapsed);
    const commissionEndDate = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate()).toISOString().split('T')[0];
    const newCustomer: Customer = {
      ...c,
      id: `c-${Date.now()}`,
      commissionEarned: 0,
      commissionEndDate,
      monthsElapsed,
      remainingMonths,
    };
    setCustomers(prev => [...prev, newCustomer]);
  }, [setCustomers]);

  const deleteCustomer: AppContextValue['deleteCustomer'] = useCallback((id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, [setCustomers]);

  const addAnnouncement: AppContextValue['addAnnouncement'] = useCallback((a) => {
    const newAnn: Announcement = {
      ...a,
      id: `a-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: currentUser?.name ?? 'Admin',
      authorRole: currentUser?.role === 'admin' ? 'Admin' : (currentUser?.employeeRole ?? 'Employee'),
      isPinned: false,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setNotifications(prev => [
      ...prev,
      { id: `n-${Date.now()}`, userId: 'broadcast', title: 'New Announcement', message: a.title, type: 'announcement', date: newAnn.date, read: false },
    ]);
  }, [currentUser, setAnnouncements, setNotifications]);

  const deleteAnnouncement: AppContextValue['deleteAnnouncement'] = useCallback((id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    setNotifications(prev => prev.filter(n => n.message !== announcements.find(a => a.id === id)?.title));
  }, [announcements, setAnnouncements, setNotifications]);

  const addLead: AppContextValue['addLead'] = useCallback((l) => {
    let success = true;
    setLeads(prev => {
      const existing = prev.find(
        ld => ld.companyName.toLowerCase() === l.companyName.toLowerCase() &&
          (ld.status === 'Locked' || ld.status === 'Approved' || ld.status === 'Pending Approval') &&
          ld.partnerId !== l.partnerId
      );
      if (existing) {
        success = false;
        return prev;
      }
      const partner = partners.find(p => p.id === l.partnerId);
      const today = new Date().toISOString().split('T')[0];
      const newLead: Lead = {
        ...l,
        id: `l-${Date.now()}`,
        status: 'Pending Approval',
        submittedDate: today,
        lockEndDate: today,
        partnerName: partner?.name ?? 'Unknown',
      };
      return [...prev, newLead];
    });
    return success;
  }, [leads, partners, setLeads]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setNotifications]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const updateSettings = useCallback((s: Partial<AppSettings>) => {
    setSettingsState(prev => ({ ...prev, ...s }));
  }, []);

  const updateSiteContent = useCallback((s: Partial<SiteContent>) => {
    setSiteContent(prev => ({ ...prev, ...s }));
  }, [setSiteContent]);

  const resetSiteContent = useCallback(() => {
    setSiteContent(defaultSiteContent);
  }, [setSiteContent]);

  const clearDemoData = useCallback(() => {
    setCustomers([]);
    setLeads([]);
    setTransactions([]);
    setNotifications([]);
    setAnnouncements([]);
  }, [setCustomers, setLeads, setTransactions, setNotifications, setAnnouncements]);

  const resetAllData = useCallback(() => {
    setPartners([]);
    setCustomers([]);
    setLeads([]);
    setEmployees([]);
    setCategories([]);
    setAnnouncements([]);
    setNotifications([]);
    setPlans([]);
    setProducts([]);
    setTransactions([]);
    setChatThreads([]);
    setChatMessages([]);
    setSettingsState(defaultAppSettings);
    setSiteContent(defaultSiteContent);
  }, [setPartners, setCustomers, setLeads, setEmployees, setCategories, setAnnouncements, setNotifications, setPlans, setProducts, setTransactions, setChatThreads, setChatMessages, setSiteContent]);

  const updateUserProfile = useCallback((updates: ProfileUpdate) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      return { ...prev, name: updates.name, email: updates.email, phone: updates.phone, whatsapp: updates.whatsapp, company: updates.company };
    });
    setPartners(prev => prev.map(p =>
      p.id === (currentUser?.partnerId) ? { ...p, name: updates.name, email: updates.email, phone: updates.phone, company: updates.company ?? p.company } : p
    ));
    setEmployees(prev => prev.map(e =>
      e.email === currentUser?.email ? { ...e, name: updates.name, email: updates.email } : e
    ));
    // Sync to app_users
    if (currentUser) {
      updateAppUserInDb(currentUser.id, {
        name: updates.name, email: updates.email, phone: updates.phone, whatsapp: updates.whatsapp, company: updates.company,
      });
    }
  }, [currentUser, setCurrentUser, setPartners, setEmployees, updateAppUserInDb]);

  const updateUserPassword = useCallback((updates: PasswordUpdate): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Not logged in' };
    const storedPassword = userPasswords[currentUser.id];
    if (storedPassword !== undefined && storedPassword !== '' && storedPassword !== updates.currentPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }
    if (updates.newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters' };
    }
    if (updates.newPassword === updates.currentPassword) {
      return { success: false, error: 'New password must be different from current password' };
    }
    setUserPasswords(prev => ({ ...prev, [currentUser.id]: updates.newPassword }));
    updateAppUserInDb(currentUser.id, { password: updates.newPassword });
    return { success: true };
  }, [currentUser, userPasswords, setUserPasswords, updateAppUserInDb]);

  const startChatThread = useCallback((subject: string): string => {
    if (!currentUser || !currentUser.partnerId) return '';
    const threadId = `chat-${Date.now()}`;
    const now = new Date().toISOString();
    const partner = partners.find(p => p.id === currentUser.partnerId);
    const newThread: ChatThread = {
      id: threadId,
      partnerId: currentUser.partnerId,
      partnerName: currentUser.name,
      partnerCompany: partner?.company ?? '',
      subject,
      status: 'open',
      createdAt: now,
      lastMessageAt: now,
      unreadByPartner: 0,
      unreadBySupport: 0,
    };
    setChatThreads(prev => [newThread, ...prev]);
    return threadId;
  }, [currentUser, partners, setChatThreads]);

  const sendChatMessage = useCallback((threadId: string, text: string, fromSupport = false) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      senderType: fromSupport ? 'support' : 'partner',
      senderName: currentUser.name,
      text,
      timestamp: now,
      read: false,
    };
    setChatMessages(prev => [...prev, msg]);
    setChatThreads(prev => prev.map(t =>
      t.id === threadId
        ? {
            ...t,
            lastMessageAt: now,
            unreadByPartner: fromSupport ? t.unreadByPartner + 1 : t.unreadByPartner,
            unreadBySupport: !fromSupport ? t.unreadBySupport + 1 : t.unreadBySupport,
          }
        : t
    ));
  }, [currentUser, setChatMessages, setChatThreads]);

  const markThreadReadByPartner = useCallback((threadId: string) => {
    setChatThreads(prev => prev.map(t => t.id === threadId ? { ...t, unreadByPartner: 0 } : t));
    setChatMessages(prev => prev.map(m => m.threadId === threadId && m.senderType === 'support' ? { ...m, read: true } : m));
  }, [setChatThreads, setChatMessages]);

  const markThreadReadBySupport = useCallback((threadId: string) => {
    setChatThreads(prev => prev.map(t => t.id === threadId ? { ...t, unreadBySupport: 0 } : t));
    setChatMessages(prev => prev.map(m => m.threadId === threadId && m.senderType === 'partner' ? { ...m, read: true } : m));
  }, [setChatThreads, setChatMessages]);

  const closeChatThread = useCallback((threadId: string) => {
    setChatThreads(prev => prev.map(t => t.id === threadId ? { ...t, status: 'closed' } : t));
  }, [setChatThreads]);

  const reopenChatThread = useCallback((threadId: string) => {
    setChatThreads(prev => prev.map(t => t.id === threadId ? { ...t, status: 'open' } : t));
  }, [setChatThreads]);

  const totalUnreadChatBySupport = chatThreads.reduce((s, t) => s + t.unreadBySupport, 0);

  return (
    <AppContext.Provider value={{
      currentUser, login, loginOtp, logout, dataLoaded: dataLoaded && usersLoaded,
      partners, customers, leads, employees, categories, announcements, notifications, plans, products,
      settings: settingsState, siteContent, transactions, roles,
      hasPermission, getEmployeePermissions, addRole, updateRole, deleteRole, assignEmployeeRole,
      addPartner, updatePartner, deletePartner, addEmployee, updateEmployee, deleteEmployee, addCategory, deleteCategory, addPlan, deletePlan, addProduct, deleteProduct, addAnnouncement, deleteAnnouncement, addLead, adminAddLead, deleteLead, updateLeadStatus, approveLead, updateLeadPayment, convertLead, addCustomer, deleteCustomer,
      markNotificationRead, markAllRead, updateSettings, updateSiteContent, resetSiteContent,
      clearDemoData, resetAllData, updateUserProfile, updateUserPassword, partnerUsers,
      chatThreads, chatMessages, startChatThread, sendChatMessage, markThreadReadByPartner, markThreadReadBySupport, closeChatThread, reopenChatThread, totalUnreadChatBySupport,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
