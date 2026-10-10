import React from 'react';
import {
  Plus,
  Bell,
  Search,
  UserCheck,
  Shield,
  Briefcase,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import { User, DemoAccount } from '../types';

interface HeaderProps {
  currentTab: string;
  currentUser: User | null;
  demoAccounts: DemoAccount[];
  onSwitchUser: (account: DemoAccount) => void;
  onOpenCreateDeal: () => void;
  onOpenCreateClient: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  currentUser,
  demoAccounts,
  onSwitchUser,
  onOpenCreateDeal,
  onOpenCreateClient,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Executive Overview';
      case 'deals':
        return 'Sales Pipeline & Kanban';
      case 'clients':
        return 'Accounts & Client Directory';
      case 'team':
        return 'Sales Team & Quota Performance';
      case 'history':
        return 'Closed Sales & Invoicing Ledger';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-18 px-8 bg-[#0b0e14]/90 backdrop-blur border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-30">
      {/* Title & Status */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {getTabTitle()}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              MySQL 8.4 Online
            </span>
            <span>•</span>
            <span>Q4 Enterprise Sales Cycle</span>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Switcher Pill */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-1 rounded-xl text-xs">
          <span className="text-[11px] font-semibold text-slate-300 px-2 uppercase tracking-wider flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#ff6b4a]" /> Switch Role:
          </span>
          {demoAccounts.map((acc) => {
            const isCurrent = currentUser?.id === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => onSwitchUser(acc)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-[#ff6b4a] text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={`Switch to ${acc.fullName} (${acc.role})`}
              >
                <span>{acc.fullName.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75">({acc.role})</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateClient}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Account
          </button>

          <button
            onClick={onOpenCreateDeal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white text-xs font-semibold rounded-lg shadow-md shadow-orange-500/20 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Deal
          </button>
        </div>
      </div>
    </header>
  );
};
