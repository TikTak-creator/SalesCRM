import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Briefcase,
  Target,
  CheckCircle2,
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { DashboardMetrics } from '../types';

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  loading: boolean;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  loading,
  onNavigateTab
}) => {
  const [chartMode, setChartMode] = useState<'revenue' | 'deals'>('revenue');

  if (loading || !metrics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#ff6b4a] border-t-transparent rounded-full animate-spin" />
          <div className="text-sm text-slate-400 font-medium">Loading executive analytics...</div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead':
        return { bg: 'bg-slate-500/10', text: 'text-slate-300', bar: 'bg-slate-400' };
      case 'Contacted':
        return { bg: 'bg-blue-500/10', text: 'text-blue-400', bar: 'bg-blue-500' };
      case 'ProposalSent':
        return { bg: 'bg-amber-500/10', text: 'text-amber-400', bar: 'bg-amber-500' };
      case 'Negotiation':
        return { bg: 'bg-purple-500/10', text: 'text-purple-400', bar: 'bg-purple-500' };
      case 'Won':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500' };
      case 'Lost':
        return { bg: 'bg-rose-500/10', text: 'text-rose-400', bar: 'bg-rose-500' };
      default:
        return { bg: 'bg-slate-500/10', text: 'text-slate-400', bar: 'bg-slate-400' };
    }
  };

  const maxRevenue = Math.max(...metrics.revenueVsTarget.map(r => Math.max(r.revenue, r.target)), 1);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Executive Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#121824] border border-slate-800/90 relative overflow-hidden group hover:border-[#ff6b4a]/40 transition-all shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b4a]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#ff6b4a]/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Won Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-[#ff6b4a] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(metrics.totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="flex items-center text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +{metrics.revenueGrowthPercent}%
              </span>
              <span className="text-slate-300">vs last cycle</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Pipeline */}
        <div className="p-5 rounded-2xl bg-[#121824] border border-slate-800/90 relative overflow-hidden group hover:border-purple-500/40 transition-all shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Active Pipeline</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(metrics.activePipelineValue)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300">
              <span className="font-semibold text-purple-400">{metrics.activeDealsCount} opportunities</span>
              <span>in progress</span>
            </div>
          </div>
        </div>

        {/* Card 3: Deals Won */}
        <div className="p-5 rounded-2xl bg-[#121824] border border-slate-800/90 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Win Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {metrics.winRatePercent}%
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">{metrics.dealsWonCount} closed won</span>
              <span>deals</span>
            </div>
          </div>
        </div>

        {/* Card 4: Average Deal Size */}
        <div className="p-5 rounded-2xl bg-[#121824] border border-slate-800/90 relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Avg Deal Size</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(metrics.averageDealSize)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300">
              <span className="font-semibold text-blue-400">{metrics.totalClientsCount} accounts</span>
              <span>managed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Chart: Revenue vs Target (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#121824] border border-slate-800/90 shadow-lg">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Revenue vs Quota Target
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">Past 6 Months</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">Comparison of booked revenue against executive sales quotas</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gradient-to-tr from-[#ff6b4a] to-[#f97316]" />
                <span className="text-slate-300">Actual Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500/50 border border-indigo-400" />
                <span className="text-slate-300">Monthly Target</span>
              </div>
            </div>
          </div>

          {/* SVG Bar & Target Chart */}
          <div className="pt-6">
            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {metrics.revenueVsTarget.map((item, index) => {
                const revenueHeight = Math.max(10, Math.round((item.revenue / maxRevenue) * 200));
                const targetHeight = Math.max(10, Math.round((item.target / maxRevenue) * 200));
                const isOverTarget = item.revenue >= item.target;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-48 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2.5 shadow-xl pointer-events-none z-20 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">{item.month}</div>
                      <div className="text-[#ff6b4a] mt-0.5">Rev: {formatCurrency(item.revenue)}</div>
                      <div className="text-indigo-400">Target: {formatCurrency(item.target)}</div>
                      <div className="text-slate-400 text-[10px]">{item.dealsCount} deals closed</div>
                    </div>

                    {/* Bars pair */}
                    <div className="w-full flex items-end justify-center gap-1.5 h-52">
                      {/* Target bar */}
                      <div
                        style={{ height: `${targetHeight}px` }}
                        className="w-1/3 rounded-t-md bg-indigo-950/60 border border-dashed border-indigo-500/50 group-hover:border-indigo-400 transition-all"
                        title={`Target: ${formatCurrency(item.target)}`}
                      />
                      {/* Revenue bar */}
                      <div
                        style={{ height: `${revenueHeight}px` }}
                        className={`w-1/2 rounded-t-md bg-gradient-to-t from-[#ea580c] to-[#ff6b4a] group-hover:from-[#f97316] group-hover:to-[#ff8c70] shadow-md transition-all relative ${
                          isOverTarget ? 'ring-1 ring-emerald-400/50' : ''
                        }`}
                      >
                        {isOverTarget && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        )}
                      </div>
                    </div>

                    {/* Month Label */}
                    <div className="text-center">
                      <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                        {item.month.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Chart: Sales Pipeline Breakdown (1 col) */}
        <div className="p-6 rounded-2xl bg-[#121824] border border-slate-800/90 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <h2 className="text-base font-bold text-white">Pipeline Stages</h2>
              <button
                onClick={() => onNavigateTab('deals')}
                className="text-xs text-[#ff6b4a] hover:underline flex items-center gap-0.5"
              >
                Kanban <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {metrics.pipelineStages.map((stage) => {
                const color = getStageColor(stage.stage);
                return (
                  <div key={stage.stage} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-300 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${color.bar}`} />
                        {stage.stage}
                        <span className="text-[11px] text-slate-300">({stage.dealsCount})</span>
                      </span>
                      <span className="font-semibold text-white">
                        {formatCurrency(stage.totalAmount)}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${Math.min(100, stage.percentage)}%` }}
                        className={`h-full ${color.bar} rounded-full transition-all duration-500`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Total Weighted Pipeline:</span>
            <span className="text-sm font-bold text-white">
              {formatCurrency(metrics.activePipelineValue + metrics.totalRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Leaderboard & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Team Leaderboard (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#121824] border border-slate-800/90 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-amber-400" />
                Sales Rep Leaderboard
              </h2>
              <p className="text-xs text-slate-300 mt-1">Individual performance against monthly quotas</p>
            </div>
            <button
              onClick={() => onNavigateTab('team')}
              className="text-xs text-[#ff6b4a] hover:underline flex items-center gap-0.5"
            >
              View Team <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-300 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-2">Rank & Representative</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Won Deals</th>
                  <th className="py-3 px-2">Closed Revenue</th>
                  <th className="py-3 px-2">Attainment</th>
                  <th className="py-3 px-2 text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics.leaderboard.map((rep, idx) => (
                  <tr key={rep.userId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-2 flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        idx === 0 ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/40' :
                        idx === 1 ? 'bg-slate-300 text-slate-950' :
                        idx === 2 ? 'bg-amber-700 text-amber-100' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <img
                        src={rep.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={rep.fullName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <span className="font-medium text-white">{rep.fullName}</span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-400">{rep.role}</td>
                    <td className="py-3.5 px-2 font-semibold text-slate-200">{rep.wonDealsCount}</td>
                    <td className="py-3.5 px-2 font-bold text-white">{formatCurrency(rep.totalWonRevenue)}</td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, rep.quotaAttainmentPercent)}%` }}
                            className={`h-full rounded-full ${
                              rep.quotaAttainmentPercent >= 100 ? 'bg-emerald-400' : 'bg-[#ff6b4a]'
                            }`}
                          />
                        </div>
                        <span className={`font-semibold ${
                          rep.quotaAttainmentPercent >= 100 ? 'text-emerald-400' : 'text-slate-300'
                        }`}>
                          {rep.quotaAttainmentPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-right font-medium text-slate-300">
                      {rep.winRatePercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Feed (1 col) */}
        <div className="p-6 rounded-2xl bg-[#121824] border border-slate-800/90 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-[#ff6b4a]" />
                Live Sales Activity
              </h2>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Realtime
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              {metrics.recentActivities.map((act) => {
                const getIcon = (type: string) => {
                  switch (type) {
                    case 'Call': return <Phone className="w-3.5 h-3.5 text-blue-400" />;
                    case 'Email': return <Mail className="w-3.5 h-3.5 text-purple-400" />;
                    case 'Meeting': return <Calendar className="w-3.5 h-3.5 text-emerald-400" />;
                    case 'StageChange': return <TrendingUp className="w-3.5 h-3.5 text-[#ff6b4a]" />;
                    default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
                  }
                };

                return (
                  <div key={act.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(act.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-white text-xs truncate">{act.dealTitle}</span>
                        <span className="text-[10px] text-slate-300 shrink-0">
                          {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                        {act.description}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-1 font-medium">
                        by {act.userName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/60">
            <button
              onClick={() => onNavigateTab('deals')}
              className="w-full py-2 text-center text-xs text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
            >
              View All Deals Pipeline →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
