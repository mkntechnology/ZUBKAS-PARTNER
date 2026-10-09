import { useState, useEffect } from 'react';
import { usePersistentState } from '@/utils/usePersistentState';
import { LayoutDashboard, Users, Settings, FolderTree, Layers, Megaphone, Trophy, Target, Bell, User as UserIcon, DollarSign, Package, CircleUser as UserCircle, Type } from 'lucide-react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AppLayout } from '@/components/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';

// Admin pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminPartners } from '@/pages/admin/AdminPartners';
import { AdminEmployees } from '@/pages/admin/AdminEmployees';
import { AdminCategories } from '@/pages/admin/AdminCategories';
import { AdminPlans } from '@/pages/admin/AdminPlans';
import { AdminLeads } from '@/pages/admin/AdminLeads';
import { AdminAnnouncements } from '@/pages/admin/AdminAnnouncements';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { AdminLeaderboard } from '@/pages/admin/AdminLeaderboard';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { AdminContentManager } from '@/pages/admin/AdminContentManager';
import { AdminProfile } from '@/pages/admin/AdminProfile';

// Partner pages
import { PartnerDashboard } from '@/pages/partner/PartnerDashboard';
import { PartnerCustomers } from '@/pages/partner/PartnerCustomers';
import { PartnerLeads } from '@/pages/partner/PartnerLeads';
import { PartnerCommissions } from '@/pages/partner/PartnerCommissions';
import { PartnerProducts } from '@/pages/partner/PartnerProducts';
import { PartnerAnnouncements } from '@/pages/partner/PartnerAnnouncements';
import { PartnerLeaderboard } from '@/pages/partner/PartnerLeaderboard';
import { PartnerNotifications } from '@/pages/partner/PartnerNotifications';
import { PartnerProfile } from '@/pages/partner/PartnerProfile';

const adminNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'partners', label: 'Partners', icon: Users },
  { key: 'leads', label: 'Leads', icon: Target },
  { key: 'employees', label: 'Employees', icon: UserIcon },
  { key: 'categories', label: 'Categories', icon: FolderTree },
  { key: 'plans', label: 'Plans & Rates', icon: Layers },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'content', label: 'Content Manager', icon: Type },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
  { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'profile', label: 'My Profile', icon: UserCircle },
];

const partnerNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'customers', label: 'My Customers', icon: Users },
  { key: 'leads', label: 'My Leads', icon: Target },
  { key: 'commissions', label: 'Commissions', icon: DollarSign },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
  { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'profile', label: 'My Profile', icon: UserCircle },
];

function AdminPortal() {
  const { currentUser, notifications } = useApp();
  const [page, setPage] = usePersistentState<string>('zubkas_admin_page', 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = notifications.filter(n => (n.userId === 'admin' || n.userId === 'broadcast') && !n.read).length;
  const items = adminNavItems.map(item =>
    item.key === 'announcements' ? { ...item, badge: unreadCount } : item
  );

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <AdminDashboard />;
      case 'partners': return <AdminPartners />;
      case 'leads': return <AdminLeads />;
      case 'employees': return <AdminEmployees />;
      case 'categories': return <AdminCategories />;
      case 'plans': return <AdminPlans />;
      case 'products': return <AdminProducts />;
      case 'announcements': return <AdminAnnouncements />;
      case 'leaderboard': return <AdminLeaderboard />;
      case 'settings': return <AdminSettings />;
      case 'content': return <AdminContentManager />;
      case 'profile': return <AdminProfile />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <AppLayout
      sidebarItems={items}
      activePage={page}
      onNavigate={setPage}
      userName={currentUser?.name ?? ''}
      userRole={currentUser?.role === 'admin' ? 'Administrator' : currentUser?.employeeRole ?? 'Employee'}
      variant="admin"
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      onCloseSidebar={() => setSidebarOpen(false)}
    >
      {renderPage()}
    </AppLayout>
  );
}

function PartnerPortal() {
  const { currentUser, notifications } = useApp();
  const [page, setPage] = usePersistentState<string>('zubkas_partner_page', 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = notifications.filter(n =>
    (n.userId === currentUser?.partnerId || n.userId === 'broadcast') && !n.read
  ).length;
  const items = partnerNavItems.map(item =>
    item.key === 'notifications' ? { ...item, badge: unreadCount } : item
  );

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <PartnerDashboard />;
      case 'customers': return <PartnerCustomers />;
      case 'leads': return <PartnerLeads />;
      case 'commissions': return <PartnerCommissions />;
      case 'products': return <PartnerProducts />;
      case 'announcements': return <PartnerAnnouncements />;
      case 'leaderboard': return <PartnerLeaderboard />;
      case 'notifications': return <PartnerNotifications />;
      case 'profile': return <PartnerProfile />;
      default: return <PartnerDashboard />;
    }
  };

  return (
    <AppLayout
      sidebarItems={items}
      activePage={page}
      onNavigate={setPage}
      userName={currentUser?.name ?? ''}
      userRole="Partner"
      variant="partner"
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      onCloseSidebar={() => setSidebarOpen(false)}
    >
      {renderPage()}
    </AppLayout>
  );
}

function AppContent() {
  const { currentUser, logout } = useApp();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem('zubkas_admin_page');
      localStorage.removeItem('zubkas_partner_page');
    }
  }, [currentUser]);

  if (!currentUser && !showLogin) return <LandingPage onSignIn={() => setShowLogin(true)} />;
  if (!currentUser && showLogin) return <LoginPage onBack={() => setShowLogin(false)} />;
  if (currentUser!.role === 'admin' || currentUser!.role === 'employee') return <AdminPortal />;
  return <PartnerPortal />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
