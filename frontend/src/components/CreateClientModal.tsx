import React, { useState } from 'react';
import { User, ClientStatus } from '../types';
import { api } from '../api/client';

interface CreateClientModalProps {
  users: User[];
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({
  users,
  onClose,
  onSuccess
}) => {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('FinTech');
  const [region, setRegion] = useState('North America');
  const [status, setStatus] = useState<ClientStatus>('Lead');
  const [assignedUserId, setAssignedUserId] = useState<number | undefined>(users[0]?.id);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim()) return;

    try {
      setSubmitting(true);
      await api.clients.create({
        companyName: companyName.trim(),
        contactPerson: contactPerson.trim(),
        email: email.trim(),
        phone: phone.trim(),
        industry,
        region,
        status,
        assignedUserId: assignedUserId || null,
        notes: notes.trim()
      } as any);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create client');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Add Client Account</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Company Name *</label>
              <input
                type="text"
                required
                placeholder="Apex Technologies Inc"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Contact Person *</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Corporate Email</label>
              <input
                type="email"
                placeholder="contact@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Phone</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              >
                <option value="FinTech">FinTech</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                <option value="CleanTech">CleanTech</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Aerospace & Defense">Aerospace & Defense</option>
                <option value="Retail & E-Commerce">Retail & E-Commerce</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              >
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="APAC">APAC</option>
                <option value="Central Asia">Central Asia</option>
                <option value="Latin America">Latin America</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ClientStatus)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              >
                <option value="Lead">Lead</option>
                <option value="Prospect">Prospect</option>
                <option value="Active">Active</option>
                <option value="Churned">Churned</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Assigned Representative</label>
              <select
                value={assignedUserId || ''}
                onChange={(e) => setAssignedUserId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b4a]"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Account Notes</label>
            <textarea
              rows={2}
              placeholder="Strategic account context or integration requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              {submitting ? 'Adding...' : 'Save Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
