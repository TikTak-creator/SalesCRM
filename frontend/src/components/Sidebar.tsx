import React from 'react';
import {
  LayoutDashboard,
  Kanban,
  Building2,
  Users,
  Receipt,
  LogOut,
  TrendingUp,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onLogout
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deals', label: 'Deals Pipeline', icon: Kanban },
    { id: 'clients', label: 'Clients & Accounts', icon: Building2 },
    { id: 'team', label: 'Sales Team', icon: Users },
    { id: 'history', label: 'Sales History', icon: Receipt },
  ];

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-900/40 text-purple-400 border border-purple-500/30';
      case 'Manager':
        return 'bg-blue-900/40 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30';
    }
  };

  return (
    <aside className="w-64 bg-[#0d121c] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Logo */}
        <div className="h-18 px-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff6b4a] to-[#f97316] flex items-center justify-center shadow-lg shadow-orange-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
              SalesCRM <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-[#ff6b4a]">PRO</span>
            </div>
            <div className="text-xs text-slate-400">Enterprise Revenue Suite</div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-6 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff6b4a]/15 to-transparent text-[#ff6b4a] border-l-3 border-[#ff6b4a] shadow-inner font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#ff6b4a]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User info & quick switch */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        {currentUser ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {currentUser.fullName}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-md transition-colors border border-slate-800/80 hover:border-rose-900/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-300 text-center">Not signed in</div>
        )}
      </div>
    </aside>
  );
};
