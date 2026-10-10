import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  Phone,
  Briefcase,
  Target,
  DollarSign,
  Award,
  Shield,
  UserCheck
} from 'lucide-react';
import { User, UserRole } from '../types';
import { api } from '../api/client';

interface TeamViewProps {
  users: User[];
  currentUser: User | null;
  onRefresh: () => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  users,
  currentUser,
  onRefresh
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('SalesRep');
  const [department, setDepartment] = useState('Direct Sales');
  const [monthlyQuota, setMonthlyQuota] = useState(50000);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canManage = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-900/40 text-purple-400 border border-purple-500/30';
      case 'Manager':
        return 'bg-blue-900/40 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30';
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.users.create({
        fullName,
        email,
        password,
        role,
        department,
        monthlyQuota,
        phoneNumber
      });
      setShowAddModal(false);
      setFullName('');
      setEmail('');
      setPassword('');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#121824] p-5 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ff6b4a]" />
            Sales Personnel & Account Executives
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Tracking individual quotas, active pipelines and revenue attribution
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#ea580c] hover:from-[#ea580c] text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
        )}
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((member) => {
          const attainment = member.monthlyQuota > 0
            ? Math.round((member.totalSalesCurrentMonth / member.monthlyQuota) * 100)
            : 0;

          return (
            <div
              key={member.id}
              className="p-6 rounded-2xl bg-[#121824] border border-slate-800/90 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Header with avatar & role */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={member.fullName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        {member.fullName}
                      </h3>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {member.department}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${getRoleBadge(member.role)}`}>
                    {member.role}
                  </span>
                </div>

                {/* Contact info */}
                <div className="mt-5 space-y-1.5 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phoneNumber || '+1 (555) 010-0000'}</span>
                  </div>
                </div>

                {/* Quota & Attainment */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      Monthly Target:
                    </span>
                    <span className="font-semibold text-white">
                      {formatCurrency(member.monthlyQuota)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Current Sales:</span>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(member.totalSalesCurrentMonth)}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div
                      style={{ width: `${Math.min(100, attainment)}%` }}
                      className={`h-full rounded-full transition-all ${
                        attainment >= 100 ? 'bg-emerald-400' : 'bg-[#ff6b4a]'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                    <span>Quota Attainment</span>
                    <span className={`font-bold ${attainment >= 100 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {attainment}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom: Active deals count */}
              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Active Pipeline:</span>
                <span className="font-bold text-white">
                  {member.activeDealsCount} deals in progress
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Team Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Taylor"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="jessica@salescrm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Temporary Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
                  >
                    <option value="SalesRep">SalesRep</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Monthly Quota ($)</label>
                  <input
                    type="number"
                    value={monthlyQuota}
                    onChange={(e) => setMonthlyQuota(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#ff6b4a] hover:bg-[#ea580c] disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition"
                >
                  {submitting ? 'Creating...' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
