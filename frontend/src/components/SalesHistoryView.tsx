import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Calendar,
  CreditCard,
  User,
  Building2,
  DollarSign
} from 'lucide-react';
import { SaleHistory, User as UserType } from '../types';
import { api } from '../api/client';

interface SalesHistoryViewProps {
  users: UserType[];
}

export const SalesHistoryView: React.FC<SalesHistoryViewProps> = ({ users }) => {
  const [sales, setSales] = useState<SaleHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [repFilter, setRepFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const loadHistory = async () => {
    try {
      setLoading(true);
      const repId = repFilter !== 'all' ? Number(repFilter) : undefined;
      const data = await api.analytics.getSalesHistory(repId);
      setSales(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [repFilter]);

  const filteredSales = sales.filter(s => {
    return !search ||
      s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.salesRepName.toLowerCase().includes(search.toLowerCase());
  });

  const totalAmount = filteredSales.reduce((sum, s) => sum + s.amount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Company', 'Contact', 'Sales Rep', 'Amount', 'Closed Date', 'Payment Method'];
    const rows = filteredSales.map(s => [
      s.invoiceNumber,
      `"${s.companyName}"`,
      `"${s.clientName}"`,
      `"${s.salesRepName}"`,
      s.amount,
      new Date(s.closedDate).toISOString().split('T')[0],
      s.paymentMethod
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sales_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              placeholder="Filter by invoice, company or rep..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#ff6b4a]"
            />
          </div>

          {/* Rep Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={repFilter}
              onChange={(e) => setRepFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
            >
              <option value="all">All Representatives</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.fullName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-300">Total Filtered Revenue</div>
            <div className="text-sm font-bold text-emerald-400">
              {formatCurrency(totalAmount)}
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-[#121824] border border-slate-800/90 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-300 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Client & Account</th>
                <th className="py-3.5 px-4">Representative</th>
                <th className="py-3.5 px-4">Closed Date</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSales.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#ff6b4a]">
                    {s.invoiceNumber || `INV-2026-${s.id.toString().padStart(4, '0')}`}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{s.companyName}</div>
                    <div className="text-[11px] text-slate-300">{s.clientName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {s.salesRepName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(s.closedDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 text-slate-300">
                      {s.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-white text-sm">
                    {formatCurrency(s.amount)}
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No sales records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
