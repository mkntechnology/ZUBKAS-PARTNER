import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  User, Partner, Customer, Lead, Employee, Category,
  Announcement, Notification, Plan, AppSettings, Product, SiteContent,
  CommissionTransaction,
} from '@/types';
import * as mock from '@/data/mockData';

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
  addEmployee: (e: Omit<Employee, 'id'>) => void;
  addCategory: (c: Omit<Category, 'id' | 'partnerCount'>) => void;
  addPlan: (p: Omit<Plan, 'id'>) => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  addAnnouncement: (a: Omit<Announcement, 'id' | 'date' | 'author' | 'authorRole' | 'isPinned'>) => void;
  addLead: (l: Omit<Lead, 'id' | 'submittedDate' | 'lockEndDate' | 'status' | 'partnerName'>) => boolean;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  updateSiteContent: (s: Partial<SiteContent>) => void;
  resetSiteContent: () => void;
  clearDemoData: () => void;
  updateUserProfile: (updates: ProfileUpdate) => void;
  updateUserPassword: (updates: PasswordUpdate) => { success: boolean; error?: string };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [partners, setPartners] = useState<Partner[]>(mock.partners);
  const [customers, setCustomers] = useState<Customer[]>(mock.customers);
  const [leads, setLeads] = useState<Lead[]>(mock.leads);
  const [employees, setEmployees] = useState<Employee[]>(mock.employees);
  const [categories, setCategories] = useState<Category[]>(mock.categories);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mock.announcements);
  const [notifications, setNotifications] = useState<Notification[]>(mock.notifications);
  const [plans, setPlans] = useState<Plan[]>(mock.plans);
  const [products, setProducts] = useState<Product[]>(mock.products);
  const [settings, setSettings] = useState<AppSettings>(mock.appSettings);
  const [siteContent, setSiteContent] = useState<SiteContent>(mock.defaultSiteContent);
  const [transactions, setTransactions] = useState<CommissionTransaction[]>(mock.commissionTransactions);
  const [userPasswords, setUserPasswords] = useState<Record<string, string>>({});

  const login = useCallback((email: string, _password: string) => {
    const user = mock.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const loginOtp = useCallback((email: string) => {
    const user = mock.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

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
  }, []);

  const addEmployee: AppContextValue['addEmployee'] = useCallback((e) => {
    setEmployees(prev => [...prev, { ...e, id: `emp-${Date.now()}` }]);
  }, []);

  const addCategory: AppContextValue['addCategory'] = useCallback((c) => {
    setCategories(prev => [...prev, { ...c, id: `cat-${Date.now()}`, partnerCount: 0 }]);
  }, []);

  const addPlan: AppContextValue['addPlan'] = useCallback((p) => {
    setPlans(prev => [...prev, { ...p, id: `plan-${Date.now()}`, isCustom: true }]);
  }, []);

  const addProduct: AppContextValue['addProduct'] = useCallback((p) => {
    setProducts(prev => [...prev, { ...p, id: `prod-${Date.now()}` }]);
  }, []);

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
  }, [currentUser]);

  const addLead: AppContextValue['addLead'] = useCallback((l) => {
    const existing = leads.find(
      ld => ld.companyName.toLowerCase() === l.companyName.toLowerCase() &&
        ld.status === 'Locked' &&
        new Date(ld.lockEndDate) > new Date('2026-10-08')
    );
    if (existing && existing.partnerId !== l.partnerId) {
      return false;
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
    setLeads(prev => [...prev, newLead]);
    return true;
  }, [leads, partners, settings.leadLockDays]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const updateSettings = useCallback((s: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
  }, []);

  const updateSiteContent = useCallback((s: Partial<SiteContent>) => {
    setSiteContent(prev => ({ ...prev, ...s }));
  }, []);

  const resetSiteContent = useCallback(() => {
    setSiteContent(mock.defaultSiteContent);
  }, []);

  const clearDemoData = useCallback(() => {
    setCustomers([]);
    setLeads([]);
    setTransactions([]);
    setNotifications(prev => prev.filter(n => n.type !== 'commission' && n.type !== 'lead' && n.type !== 'payment'));
  }, []);

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
  }, [currentUser]);

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
  }, [currentUser, userPasswords]);

  return (
    <AppContext.Provider value={{
      currentUser, login, loginOtp, logout,
      partners, customers, leads, employees, categories, announcements, notifications, plans, products, settings, siteContent, transactions,
      addPartner, addEmployee, addCategory, addPlan, addProduct, addAnnouncement, addLead,
      markNotificationRead, markAllRead, updateSettings, updateSiteContent, resetSiteContent,
      clearDemoData, updateUserProfile, updateUserPassword,
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
