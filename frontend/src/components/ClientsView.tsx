import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Globe,
  Briefcase,
  User,
  DollarSign
} from 'lucide-react';
import { Client, User as UserType, ClientStatus } from '../types';

interface ClientsViewProps {
  clients: Client[];
  users: UserType[];
  onOpenCreateClient: () => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  users,
  onOpenCreateClient
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  const industries = Array.from(new Set(clients.map(c => c.industry))).filter(Boolean);

  const filteredClients = clients.filter(c => {
    const matchesSearch = !search ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || c.industry === industryFilter;
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'Prospect':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'Lead':
        return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30';
      case 'Churned':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#121824] p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies, contacts, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#ff6b4a]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Prospect">Prospect</option>
              <option value="Lead">Lead</option>
              <option value="Churned">Churned</option>
            </select>
          </div>

          {/* Industry Filter */}
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
          >
            <option value="all">All Industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onOpenCreateClient}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#ea580c] hover:from-[#ea580c] text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-5 rounded-2xl bg-[#121824] border border-slate-800/90 hover:border-[#ff6b4a]/40 transition-all shadow-lg flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-white text-sm group-hover:border-[#ff6b4a]/50 transition-colors">
                    {client.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-[#ff6b4a] transition-colors">
                      {client.companyName}
                    </h3>
                    <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-3 h-3" />
                      {client.region} • {client.industry}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold shrink-0 ${getStatusBadge(client.status)}`}>
                  {client.status}
                </span>
              </div>

              {/* Contact info */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#ff6b4a]" />
                  {client.contactPerson}
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${client.email}`} className="hover:text-slate-200 truncate">
                    {client.email || 'No email registered'}
                  </a>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.phone || 'No phone registered'}</span>
                </div>
              </div>

              {/* Notes */}
              {client.notes && (
                <p className="text-xs text-slate-400 mt-3 line-clamp-2 italic">
                  "{client.notes}"
                </p>
              )}
            </div>

            {/* Bottom: Deal stats & Assigned Rep */}
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-slate-300">Total Deals: </span>
                <span className="font-bold text-white">{client.dealsCount}</span>
                <span className="text-[11px] text-slate-300 ml-1">({formatCurrency(client.totalDealValue)})</span>
              </div>
              <div className="text-slate-300 flex items-center gap-1">
                <span>Rep:</span>
                <span className="font-medium text-white truncate max-w-[100px]">
                  {client.assignedUserName || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
