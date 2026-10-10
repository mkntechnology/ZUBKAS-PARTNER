import { createContext, useContext, useCallback, useRef, type ReactNode } from 'react';
import type {
  User, Partner, Customer, Lead, Employee, Category,
  Announcement, Notification, Plan, AppSettings, Product, SiteContent,
  CommissionTransaction, Role, AdminSectionKey,
  ChatThread, ChatMessage, LeadPaymentStatus, PlanType,
} from '@/types';
import * as mock from '@/data/mockData';
import { usePersistentState } from '@/utils/usePersistentState';

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
  login: (email: string, password: string) => boolean;
  loginOtp: (email: string) => boolean;
  logout: () => void;

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

  addPartner: (p: Omit<Partner, 'id' | 'totalCommission' | 'monthlyCommission' | 'pendingCommission' | 'activeCustomers' | 'monthlySales'>) => void;
  deletePartner: (id: string) => void;
  addEmployee: (e: Omit<Employee, 'id'>) => void;
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
  const hasHardReset = useRef(false);
  if (!hasHardReset.current) {
    localStorage.clear();
    hasHardReset.current = true;
  }

  const [currentUser, setCurrentUser] = usePersistentState<User | null>('zubkas_currentUser', null);
  const [partners, setPartners] = usePersistentState<Partner[]>('zubkas_partners', []);
  const [customers, setCustomers] = usePersistentState<Customer[]>('zubkas_customers', []);
  const [leads, setLeads] = usePersistentState<Lead[]>('zubkas_leads', []);
  const [employees, setEmployees] = usePersistentState<Employee[]>('zubkas_employees', []);
  const [categories, setCategories] = usePersistentState<Category[]>('zubkas_categories', []);
  const [announcements, setAnnouncements] = usePersistentState<Announcement[]>('zubkas_announcements', []);
  const [notifications, setNotifications] = usePersistentState<Notification[]>('zubkas_notifications', []);
  const [plans, setPlans] = usePersistentState<Plan[]>('zubkas_plans', []);
  const [products, setProducts] = usePersistentState<Product[]>('zubkas_products', []);
  const [settings, setSettings] = usePersistentState<AppSettings>('zubkas_settings', mock.appSettings);
  const [siteContent, setSiteContent] = usePersistentState<SiteContent>('zubkas_siteContent', mock.defaultSiteContent);
  const [transactions, setTransactions] = usePersistentState<CommissionTransaction[]>('zubkas_transactions', []);
  const [userPasswords, setUserPasswords] = usePersistentState<Record<string, string>>('zubkas_userPasswords', {});
  const [roles, setRoles] = usePersistentState<Role[]>('zubkas_roles', []);
  const [chatThreads, setChatThreads] = usePersistentState<ChatThread[]>('zubkas_chatThreads', []);
  const [chatMessages, setChatMessages] = usePersistentState<ChatMessage[]>('zubkas_chatMessages', []);

  const login = useCallback((email: string, _password: string) => {
    const user = mock.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [setCurrentUser]);

  const loginOtp = useCallback((email: string) => {
    const user = mock.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [setCurrentUser]);

  const logout = useCallback(() => setCurrentUser(null), [setCurrentUser]);

  const addPartner: AppContextValue['addPartner'] = useCallback((p) => {
    const newPartner: Partner = {
      ...p,
      id: `partner-${Date.now()}`,
      totalCommission: 0,
      monthlyCommission: 0,
      pendingCommission: 0,
      activeCustomers: 0,
      monthlySales: 0,
    };
    setPartners(prev => [...prev, newPartner]);
  }, [setPartners]);

  const deletePartner: AppContextValue['deletePartner'] = useCallback((id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
    setCustomers(prev => prev.filter(c => c.partnerId !== id));
    setLeads(prev => prev.filter(l => l.partnerId !== id));
    setTransactions(prev => prev.filter(t => t.partnerId !== id));
    setNotifications(prev => prev.filter(n => n.userId !== id));
  }, [setPartners, setCustomers, setLeads, setTransactions, setNotifications]);

  const addEmployee: AppContextValue['addEmployee'] = useCallback((e) => {
    setEmployees(prev => [...prev, { ...e, id: `emp-${Date.now()}` }]);
  }, [setEmployees]);

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

  const deleteEmployee: AppContextValue['deleteEmployee'] = useCallback((id) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, [setEmployees]);

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
    const lockEnd = new Date('2026-10-08');
    lockEnd.setDate(lockEnd.getDate() + settings.leadLockDays);
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
        message: `Your lead "${lead.companyName}" has been approved and locked for ${settings.leadLockDays} days. Convert it before the lock expires.`,
        type: 'lead',
        date: '2026-10-08',
        read: false,
      }]);
    }
  }, [leads, settings.leadLockDays, setLeads, setNotifications]);

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
        date: '2026-10-08',
        read: false,
      }]);
    }
  }, [leads, setLeads, setCustomers, setNotifications]);

  const convertLead: AppContextValue['convertLead'] = useCallback((id) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const startDate = '2026-10-08';
    const renewalDate = lead.renewalDate ?? (lead.planType === 'Yearly'
      ? new Date(2027, 9, 8).toISOString().split('T')[0]
      : new Date(2026, 10, 8).toISOString().split('T')[0]);
    const commissionEndDate = new Date(2027, 9, 8).toISOString().split('T')[0];
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
      startDate,
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
      date: '2026-10-08',
      read: false,
    }]);
  }, [leads, setCustomers, setLeads, setNotifications]);

  const adminAddLead: AppContextValue['adminAddLead'] = useCallback((l) => {
    const partner = l.partnerId === 'none' ? null : partners.find(p => p.id === l.partnerId);
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
      submittedDate: '2026-10-08',
      lockEndDate: '2026-10-08',
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
        date: '2026-10-08',
        read: false,
      }]);
    }
  }, [partners, setLeads, setNotifications]);

  const addCustomer: AppContextValue['addCustomer'] = useCallback((c) => {
    const start = new Date(c.startDate);
    const now = new Date('2026-10-08');
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
      const newLead: Lead = {
        ...l,
        id: `l-${Date.now()}`,
        status: 'Pending Approval',
        submittedDate: '2026-10-08',
        lockEndDate: '2026-10-08',
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
    setSettings(prev => ({ ...prev, ...s }));
  }, [setSettings]);

  const updateSiteContent = useCallback((s: Partial<SiteContent>) => {
    setSiteContent(prev => ({ ...prev, ...s }));
  }, [setSiteContent]);

  const resetSiteContent = useCallback(() => {
    setSiteContent(mock.defaultSiteContent);
  }, [setSiteContent]);

  const clearDemoData = useCallback(() => {
    setCustomers([]);
    setLeads([]);
    setTransactions([]);
    setNotifications(prev => prev.filter(n => n.type !== 'commission' && n.type !== 'lead' && n.type !== 'payment'));
  }, [setCustomers, setLeads, setTransactions, setNotifications]);

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
    setSettings(mock.appSettings);
    setSiteContent(mock.defaultSiteContent);
    setTransactions([]);
    setUserPasswords({});
    setRoles([]);
    setChatThreads([]);
    setChatMessages([]);
  }, [setPartners, setCustomers, setLeads, setEmployees, setCategories, setAnnouncements, setNotifications, setPlans, setProducts, setSettings, setSiteContent, setTransactions, setUserPasswords, setRoles, setChatThreads, setChatMessages]);

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
  }, [currentUser, setCurrentUser, setPartners, setEmployees]);

  const updateUserPassword = useCallback((updates: PasswordUpdate): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Not logged in' };
    const storedPassword = userPasswords[currentUser.id];
    if (storedPassword !== undefined && storedPassword !== updates.currentPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }
    if (updates.newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters' };
    }
    if (updates.newPassword === updates.currentPassword) {
      return { success: false, error: 'New password must be different from current password' };
    }
    setUserPasswords(prev => ({ ...prev, [currentUser.id]: updates.newPassword }));
    return { success: true };
  }, [currentUser, userPasswords, setUserPasswords]);

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
      senderName: fromSupport ? currentUser.name : currentUser.name,
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
      currentUser, login, loginOtp, logout,
      partners, customers, leads, employees, categories, announcements, notifications, plans, products, settings, siteContent, transactions, roles,
      hasPermission, getEmployeePermissions, addRole, updateRole, deleteRole, assignEmployeeRole,
      addPartner, deletePartner, addEmployee, deleteEmployee, addCategory, deleteCategory, addPlan, deletePlan, addProduct, deleteProduct, addAnnouncement, deleteAnnouncement, addLead, adminAddLead, deleteLead, updateLeadStatus, approveLead, updateLeadPayment, convertLead, addCustomer, deleteCustomer,
      markNotificationRead, markAllRead, updateSettings, updateSiteContent, resetSiteContent,
      clearDemoData, resetAllData, updateUserProfile, updateUserPassword,
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
