import React, { useState } from 'react';
import { Client, User, DealStage, DealPriority } from '../types';
import { api } from '../api/client';

interface CreateDealModalProps {
  clients: Client[];
  users: User[];
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateDealModal: React.FC<CreateDealModalProps> = ({
  clients,
  users,
  onClose,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState<number>(clients[0]?.id || 1);
  const [assignedUserId, setAssignedUserId] = useState<number>(users[0]?.id || 1);
  const [amount, setAmount] = useState<number>(50000);
  const [stage, setStage] = useState<DealStage>('Lead');
  const [priority, setPriority] = useState<DealPriority>('Medium');
  const [probability, setProbability] = useState<number>(30);
  const [expectedCloseDate, setExpectedCloseDate] = useState<string>('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || clientId <= 0 || assignedUserId <= 0) return;

    try {
      setSubmitting(true);
      await api.deals.create({
        title: title.trim(),
        clientId,
        assignedUserId,
        amount,
        stage,
        probability,
        priority,
        expectedCloseDate: expectedCloseDate ? expectedCloseDate : undefined,
        description: description.trim()
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create deal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Create New Opportunity</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Opportunity Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise Cloud Lakehouse Tier 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Target Client Account *</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(Number(e.target.value))}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Assigned Representative *</label>
              <select
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(Number(e.target.value))}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Deal Value ($) *</label>
              <input
                type="number"
                required
                min={0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Initial Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              >
                <option value="Lead">Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="ProposalSent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as DealPriority)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Win Probability (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Expected Close Date</label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Opportunity Notes & Scope</label>
            <textarea
              rows={3}
              placeholder="Key requirements, client stakeholders, expected SLA..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#ff6b4a] hover:bg-[#ea580c] disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition"
            >
              {submitting ? 'Creating...' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
