import { createContext, useContext, useCallback, type ReactNode } from 'react';
import type {
  User, Partner, Customer, Lead, Employee, Category,
  Announcement, Notification, Plan, AppSettings, Product, SiteContent,
  CommissionTransaction,
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
  addLead: (l: Omit<Lead, 'id' | 'submittedDate' | 'lockEndDate' | 'status' | 'partnerName'>) => boolean;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  updateSiteContent: (s: Partial<SiteContent>) => void;
  resetSiteContent: () => void;
  clearDemoData: () => void;
  resetAllData: () => void;
  updateUserProfile: (updates: ProfileUpdate) => void;
  updateUserPassword: (updates: PasswordUpdate) => { success: boolean; error?: string };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = usePersistentState<User | null>('zubkas_currentUser', null);
  const [partners, setPartners] = usePersistentState<Partner[]>('zubkas_partners', mock.partners);
  const [customers, setCustomers] = usePersistentState<Customer[]>('zubkas_customers', mock.customers);
  const [leads, setLeads] = usePersistentState<Lead[]>('zubkas_leads', mock.leads);
  const [employees, setEmployees] = usePersistentState<Employee[]>('zubkas_employees', mock.employees);
  const [categories, setCategories] = usePersistentState<Category[]>('zubkas_categories', mock.categories);
  const [announcements, setAnnouncements] = usePersistentState<Announcement[]>('zubkas_announcements', mock.announcements);
  const [notifications, setNotifications] = usePersistentState<Notification[]>('zubkas_notifications', mock.notifications);
  const [plans, setPlans] = usePersistentState<Plan[]>('zubkas_plans', mock.plans);
  const [products, setProducts] = usePersistentState<Product[]>('zubkas_products', mock.products);
  const [settings, setSettings] = usePersistentState<AppSettings>('zubkas_settings', mock.appSettings);
  const [siteContent, setSiteContent] = usePersistentState<SiteContent>('zubkas_siteContent', mock.defaultSiteContent);
  const [transactions, setTransactions] = usePersistentState<CommissionTransaction[]>('zubkas_transactions', mock.commissionTransactions);
  const [userPasswords, setUserPasswords] = usePersistentState<Record<string, string>>('zubkas_userPasswords', {});

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
          ld.status === 'Locked' &&
          new Date(ld.lockEndDate) > new Date('2026-10-08')
      );
      if (existing && existing.partnerId !== l.partnerId) {
        success = false;
        return prev;
      }
      const lockEnd = new Date('2026-10-08');
      lockEnd.setDate(lockEnd.getDate() + settings.leadLockDays);
      const partner = partners.find(p => p.id === l.partnerId);
      const newLead: Lead = {
        ...l,
        id: `l-${Date.now()}`,
        status: 'Locked',
        submittedDate: '2026-10-08',
        lockEndDate: lockEnd.toISOString().split('T')[0],
        partnerName: partner?.name ?? 'Unknown',
      };
      return [...prev, newLead];
    });
    return success;
  }, [leads, partners, settings.leadLockDays, setLeads]);

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
    setPartners(mock.partners);
    setCustomers(mock.customers);
    setLeads(mock.leads);
    setEmployees(mock.employees);
    setCategories(mock.categories);
    setAnnouncements(mock.announcements);
    setNotifications(mock.notifications);
    setPlans(mock.plans);
    setProducts(mock.products);
    setSettings(mock.appSettings);
    setSiteContent(mock.defaultSiteContent);
    setTransactions(mock.commissionTransactions);
    setUserPasswords({});
  }, [setPartners, setCustomers, setLeads, setEmployees, setCategories, setAnnouncements, setNotifications, setPlans, setProducts, setSettings, setSiteContent, setTransactions, setUserPasswords]);

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

  return (
    <AppContext.Provider value={{
      currentUser, login, loginOtp, logout,
      partners, customers, leads, employees, categories, announcements, notifications, plans, products, settings, siteContent, transactions,
      addPartner, deletePartner, addEmployee, deleteEmployee, addCategory, deleteCategory, addPlan, deletePlan, addProduct, deleteProduct, addAnnouncement, deleteAnnouncement, addLead, deleteLead,
      markNotificationRead, markAllRead, updateSettings, updateSiteContent, resetSiteContent,
      clearDemoData, resetAllData, updateUserProfile, updateUserPassword,
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
