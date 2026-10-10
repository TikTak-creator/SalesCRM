import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, UserCheck, KeyRound, ArrowRight } from 'lucide-react';
import { DemoAccount } from '../types';
import { api } from '../api/client';

interface LoginViewProps {
  demoAccounts: DemoAccount[];
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ demoAccounts, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.auth.login(email.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (account: DemoAccount) => {
    try {
      setLoading(true);
      setError('');
      await api.auth.login(account.email, account.defaultPassword);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff6b4a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ff6b4a] to-[#ea580c] items-center justify-center shadow-xl shadow-orange-500/20">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            SalesCRM <span className="text-[#ff6b4a]">PRO</span>
          </h1>
          <p className="text-xs text-slate-300">
            Enterprise Sales Intelligence & Pipeline Management
          </p>
        </div>

        {/* 1-Click Quick Demo Sign-In */}
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#ff6b4a]" /> Instant Demo Access:
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
              Ready to Test
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                disabled={loading}
                className="w-full p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-[#ff6b4a]/50 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={acc.avatarUrl}
                    alt={acc.fullName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#ff6b4a] transition-colors">
                      {acc.fullName}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      {acc.department}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    acc.role === 'Admin' ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30' :
                    acc.role === 'Manager' ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30' :
                    'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {acc.role}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Credentials Form */}
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider text-center">
            Or Sign In with Email
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@salescrm.com"
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#ff6b4a] to-[#ea580c] hover:from-[#ea580c] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 transition cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
