import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DealsKanbanView } from './components/DealsKanbanView';
import { ClientsView } from './components/ClientsView';
import { TeamView } from './components/TeamView';
import { SalesHistoryView } from './components/SalesHistoryView';
import { CreateDealModal } from './components/CreateDealModal';
import { CreateClientModal } from './components/CreateClientModal';
import { LoginView } from './components/LoginView';
import { User, DemoAccount, DashboardMetrics, Deal, Client } from './types';
import { api, getStoredUser, removeAuthToken } from './api/client';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser());
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);
  const [showCreateDeal, setShowCreateDeal] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);

  // Read initial tab from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['dashboard', 'deals', 'clients', 'team', 'history'].includes(tabParam)) {
      setCurrentTab(tabParam);
    }
  }, []);

  // Load demo accounts list and auto-login on first load if no user
  useEffect(() => {
    api.auth.getDemoAccounts()
      .then(async (accounts) => {
        setDemoAccounts(accounts);
        if (!getStoredUser() && accounts.length > 0) {
          try {
            const res = await api.auth.login(accounts[0].email, accounts[0].defaultPassword);
            setCurrentUser(res.user);
          } catch (e) {
            console.error('Auto login error', e);
          }
        }
      })
      .catch((err) => console.error('Failed to load demo accounts', err));

    const handleUnauthorized = () => {
      setCurrentUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // When user is authenticated, load app data
  const loadAppData = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [metricsData, dealsData, clientsData, usersData] = await Promise.all([
        api.analytics.getDashboard(),
        api.deals.getAll(),
        api.clients.getAll(),
        api.users.getAll()
      ]);
      setMetrics(metricsData);
      setDeals(dealsData);
      setClients(clientsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading CRM data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadAppData();
    }
  }, [currentUser]);

  // Quick switch role
  const handleSwitchUser = async (account: DemoAccount) => {
    try {
      const res = await api.auth.login(account.email, account.defaultPassword);
      setCurrentUser(res.user);
    } catch (err) {
      console.error('Switch user error', err);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <LoginView
        demoAccounts={demoAccounts}
        onLoginSuccess={() => setCurrentUser(getStoredUser())}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#0b0e14] text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          currentTab={currentTab}
          currentUser={currentUser}
          demoAccounts={demoAccounts}
          onSwitchUser={handleSwitchUser}
          onOpenCreateDeal={() => setShowCreateDeal(true)}
          onOpenCreateClient={() => setShowCreateClient(true)}
        />

        <main className="flex-1 pb-16">
          {currentTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              loading={loading}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'deals' && (
            <DealsKanbanView
              deals={deals}
              users={users}
              clients={clients}
              onRefresh={loadAppData}
              onOpenCreateDeal={() => setShowCreateDeal(true)}
            />
          )}

          {currentTab === 'clients' && (
            <ClientsView
              clients={clients}
              users={users}
              onOpenCreateClient={() => setShowCreateClient(true)}
            />
          )}

          {currentTab === 'team' && (
            <TeamView
              users={users}
              currentUser={currentUser}
              onRefresh={loadAppData}
            />
          )}

          {currentTab === 'history' && (
            <SalesHistoryView
              users={users}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {showCreateDeal && (
        <CreateDealModal
          clients={clients}
          users={users}
          onClose={() => setShowCreateDeal(false)}
          onSuccess={loadAppData}
        />
      )}

      {showCreateClient && (
        <CreateClientModal
          users={users}
          onClose={() => setShowCreateClient(false)}
          onSuccess={loadAppData}
        />
      )}
    </div>
  );
}

export default App;
