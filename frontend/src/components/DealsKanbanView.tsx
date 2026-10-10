import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Clock,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { Deal, DealStage, User, Client, ActivityType } from '../types';
import { api } from '../api/client';

interface DealsKanbanViewProps {
  deals: Deal[];
  users: User[];
  clients: Client[];
  onRefresh: () => void;
  onOpenCreateDeal: () => void;
}

export const DealsKanbanView: React.FC<DealsKanbanViewProps> = ({
  deals,
  users,
  clients,
  onRefresh,
  onOpenCreateDeal
}) => {
  const [selectedRep, setSelectedRep] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [newActivityType, setNewActivityType] = useState<ActivityType>('Note');
  const [newActivityDesc, setNewActivityDesc] = useState<string>('');
  const [isSubmittingActivity, setIsSubmittingActivity] = useState(false);

  const stages: { key: DealStage; label: string; color: string; badge: string }[] = [
    { key: 'Lead', label: '1. Lead Inbound', color: 'border-slate-700 bg-slate-900/40', badge: 'bg-slate-800 text-slate-300' },
    { key: 'Contacted', label: '2. Contacted / Demo', color: 'border-blue-900/60 bg-blue-950/20', badge: 'bg-blue-900/50 text-blue-300' },
    { key: 'ProposalSent', label: '3. Proposal Sent', color: 'border-amber-900/60 bg-amber-950/20', badge: 'bg-amber-900/50 text-amber-300' },
    { key: 'Negotiation', label: '4. In Negotiation', color: 'border-purple-900/60 bg-purple-950/20', badge: 'bg-purple-900/50 text-purple-300' },
    { key: 'Won', label: '5. Closed Won', color: 'border-emerald-900/60 bg-emerald-950/20', badge: 'bg-emerald-900/50 text-emerald-300' },
    { key: 'Lost', label: '6. Closed Lost', color: 'border-rose-900/60 bg-rose-950/20', badge: 'bg-rose-900/50 text-rose-300' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      case 'High':
        return 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
      case 'Medium':
        return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesRep = selectedRep === 'all' || deal.assignedUserId.toString() === selectedRep;
    const matchesSearch = !searchQuery ||
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.clientCompany.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRep && matchesSearch;
  });

  const handleStageChange = async (dealId: number, nextStage: DealStage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deals.updateStage(dealId, nextStage);
      onRefresh();
      if (selectedDeal?.id === dealId) {
        const updated = await api.deals.getById(dealId);
        setSelectedDeal(updated);
      }
    } catch (err) {
      alert('Failed to update stage');
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal || !newActivityDesc.trim()) return;

    try {
      setIsSubmittingActivity(true);
      await api.deals.addActivity(selectedDeal.id, newActivityType, newActivityDesc.trim());
      setNewActivityDesc('');
      const updated = await api.deals.getById(selectedDeal.id);
      setSelectedDeal(updated);
      onRefresh();
    } catch (err) {
      alert('Failed to add activity');
    } finally {
      setIsSubmittingActivity(false);
    }
  };

  const getNextStage = (current: DealStage): DealStage | null => {
    switch (current) {
      case 'Lead': return 'Contacted';
      case 'Contacted': return 'ProposalSent';
      case 'ProposalSent': return 'Negotiation';
      case 'Negotiation': return 'Won';
      default: return null;
    }
  };

  const getPrevStage = (current: DealStage): DealStage | null => {
    switch (current) {
      case 'Lost': return 'Negotiation';
      case 'Won': return 'Negotiation';
      case 'Negotiation': return 'ProposalSent';
      case 'ProposalSent': return 'Contacted';
      case 'Contacted': return 'Lead';
      default: return null;
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#121824] p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter deals or client company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#ff6b4a]"
            />
          </div>

          {/* Rep filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
            >
              <option value="all">All Sales Reps</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onOpenCreateDeal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Deal
        </button>
      </div>

      {/* Kanban Board Columns (Horizontal Scrollable Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 min-h-[650px] items-start">
        {stages.map((col) => {
          const colDeals = filteredDeals.filter(d => d.stage === col.key);
          const totalAmount = colDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div
              key={col.key}
              className={`rounded-2xl border ${col.color} p-3 flex flex-col gap-3 min-h-[500px] shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${col.badge}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {colDeals.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">
                  {formatCurrency(totalAmount)}
                </div>
              </div>

              {/* Deal Cards list */}
              <div className="space-y-3 flex-1">
                {colDeals.map((deal) => {
                  const nextStage = getNextStage(deal.stage);
                  const prevStage = getPrevStage(deal.stage);

                  return (
                    <div
                      key={deal.id}
                      onClick={async () => {
                        const fullDeal = await api.deals.getById(deal.id);
                        setSelectedDeal(fullDeal);
                      }}
                      className="p-4 rounded-xl bg-[#141b29] hover:bg-[#1a2336] border border-slate-800/90 hover:border-[#ff6b4a]/50 transition-all cursor-pointer shadow group relative"
                    >
                      {/* Priority and Probability */}
                      <div className="flex items-center justify-between gap-2 text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${getPriorityBadge(deal.priority)}`}>
                          {deal.priority}
                        </span>
                        <span className="text-slate-300 font-semibold">
                          {deal.probability}% Prob
                        </span>
                      </div>

                      {/* Title & Company */}
                      <div className="mt-2.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-[#ff6b4a] transition-colors leading-snug">
                          {deal.title}
                        </h4>
                        <div className="text-[11px] text-slate-300 mt-1 font-medium truncate">
                          🏢 {deal.clientCompany}
                        </div>
                      </div>

                      {/* Deal Amount */}
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-sm font-extrabold text-white">
                          {formatCurrency(deal.amount)}
                        </span>
                        {deal.expectedCloseDate && (
                          <span className="text-[10px] text-slate-300 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {new Date(deal.expectedCloseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>

                      {/* Rep & Stage Transitions */}
                      <div className="mt-3 pt-3 border-t border-slate-800/70 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={deal.assignedUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={deal.assignedUserName}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <span className="text-[11px] text-slate-300 truncate max-w-[80px]">
                            {deal.assignedUserName.split(' ')[0]}
                          </span>
                        </div>

                        {/* Stage Controls */}
                        <div className="flex items-center gap-1">
                          {prevStage && (
                            <button
                              onClick={(e) => handleStageChange(deal.id, prevStage, e)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title={`Move to ${prevStage}`}
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {nextStage && (
                            <button
                              onClick={(e) => handleStageChange(deal.id, nextStage, e)}
                              className="p-1 rounded bg-slate-800 hover:bg-[#ff6b4a] text-slate-300 hover:text-white transition"
                              title={`Advance to ${nextStage}`}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {deal.stage !== 'Won' && (
                            <button
                              onClick={(e) => handleStageChange(deal.id, 'Won', e)}
                              className="p-1 rounded bg-emerald-950 hover:bg-emerald-800 text-emerald-400 hover:text-emerald-200 transition"
                              title="Mark Won"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colDeals.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                    No deals in {col.key}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal Details Modal / Drawer */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${getPriorityBadge(selectedDeal.priority)}`}>
                  {selectedDeal.priority} Priority
                </span>
                <h3 className="text-xl font-bold text-white mt-2">
                  {selectedDeal.title}
                </h3>
                <div className="text-xs text-slate-400 mt-1">
                  Client: <span className="text-white font-medium">{selectedDeal.clientCompany}</span> ({selectedDeal.clientName})
                </div>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <div>
                <div className="text-[11px] text-slate-300">Amount</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {formatCurrency(selectedDeal.amount)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-300">Current Stage</div>
                <div className="text-xs font-bold text-[#ff6b4a] mt-1">
                  {selectedDeal.stage}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-300">Win Probability</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">
                  {selectedDeal.probability}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-300">Assigned Rep</div>
                <div className="text-xs font-medium text-white mt-1 truncate">
                  {selectedDeal.assignedUserName}
                </div>
              </div>
            </div>

            {/* Stage Quick Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Advance Stage:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {stages.map((st) => (
                  <button
                    key={st.key}
                    onClick={async () => {
                      await api.deals.updateStage(selectedDeal.id, st.key);
                      const updated = await api.deals.getById(selectedDeal.id);
                      setSelectedDeal(updated);
                      onRefresh();
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedDeal.stage === st.key
                        ? 'bg-[#ff6b4a] text-white shadow-sm'
                        : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {st.key}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            {selectedDeal.description && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Description</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
                  {selectedDeal.description}
                </p>
              </div>
            )}

            {/* Activity History & Add Activity */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#ff6b4a]" />
                  Activity History & Logs ({selectedDeal.activities?.length || 0})
                </h4>
              </div>

              {/* Add Activity Form */}
              <form onSubmit={handleAddActivity} className="space-y-2 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  {(['Note', 'Call', 'Meeting', 'Email'] as ActivityType[]).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setNewActivityType(type)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                        newActivityType === type
                          ? 'bg-[#ff6b4a] text-white'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Log a ${newActivityType.toLowerCase()} note...`}
                    value={newActivityDesc}
                    onChange={(e) => setNewActivityDesc(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingActivity || !newActivityDesc.trim()}
                    className="px-3 py-1.5 bg-[#ff6b4a] hover:bg-[#ea580c] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Post
                  </button>
                </div>
              </form>

              {/* Activity List */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {selectedDeal.activities?.map((act) => (
                  <div key={act.id} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold text-slate-200">
                        {act.userName} • <span className="text-[#ff6b4a]">{act.typeName}</span>
                      </span>
                      <span>{new Date(act.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-slate-300 leading-relaxed">
                      {act.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
