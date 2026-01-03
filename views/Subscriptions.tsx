
import React, { useState } from 'react';
import { SubscriptionRecord, Member, UserRole } from '../types.ts';
import { Search, X, Save, Trash2, CreditCard, DollarSign } from 'lucide-react';

interface SubscriptionsProps {
  members: Member[];
  subscriptions: SubscriptionRecord[];
  setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionRecord[]>>;
  currentRole: UserRole;
  onDeleteSubscription: (id: string) => void;
}

const Subscriptions: React.FC<SubscriptionsProps> = ({ members, subscriptions, setSubscriptions, currentRole, onDeleteSubscription }) => {
  const [editingSub, setEditingSub] = useState<SubscriptionRecord | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const STANDARD_FEE = 10;
  const currentMonth = `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`;

  const allSubData = members.map(m => {
    const existing = subscriptions.find(s => s.memberId === m.id && s.month === currentMonth);
    return existing || { id: `new-sub-${m.id}`, memberId: m.id, memberName: m.name, month: currentMonth, amountPaid: 0, status: 'Unpaid' as 'Unpaid' };
  });

  const filteredSubs = allSubData.filter(sub => sub.memberName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSaveUpdate = () => {
    if (!editingSub) return;
    const amount = parseFloat(editAmount) || 0;
    let status: 'Paid' | 'Partial' | 'Unpaid' = amount >= STANDARD_FEE ? 'Paid' : amount > 0 ? 'Partial' : 'Unpaid';
    const updatedRecord: SubscriptionRecord = { ...editingSub, amountPaid: amount, status };
    setSubscriptions(prev => {
      const exists = prev.some(s => s.memberId === updatedRecord.memberId && s.month === updatedRecord.month);
      if (exists) return prev.map(s => (s.memberId === updatedRecord.memberId && s.month === updatedRecord.month) ? updatedRecord : s);
      return [updatedRecord, ...prev];
    });
    setEditingSub(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Monthly Subscription Tracking</h2><p className="text-slate-500 text-sm font-medium">Standard Fee: K{STANDARD_FEE} per month.</p></div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-xs uppercase border border-blue-100">{currentMonth} Cycle</div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30"><div className="relative w-full md:w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none" /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value Paid</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-900">{sub.memberName}</td>
                  <td className="px-8 py-5 font-black text-slate-900">K{sub.amountPaid}</td>
                  <td className="px-8 py-5 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${sub.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{sub.status}</span></td>
                  <td className="px-8 py-5 text-center"><div className="flex justify-center space-x-3"><button onClick={() => { setEditingSub(sub); setEditAmount(sub.amountPaid.toString()); }} className="bg-slate-100 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-blue-600 font-black uppercase text-[10px] transition-all">Edit Payment</button><button onClick={() => !sub.id.startsWith('new-sub') && onDeleteSubscription(sub.id)} className="text-slate-300 hover:text-red-500 transition-all p-1.5"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingSub && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-2xl"><CreditCard size={20} /></div>
                <h3 className="text-xl font-black tracking-tight">Log Payment</h3>
              </div>
              <button onClick={() => setEditingSub(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Paying for Member</p>
                <h4 className="text-xl font-black text-slate-900">{editingSub.memberName}</h4>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter mt-1">{editingSub.month} Cycle</p>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Payment Amount (ZMW)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tight text-center">Status will be marked "Paid" if &gt;= K{STANDARD_FEE}</p>
              </div>

              <button 
                onClick={handleSaveUpdate}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>Synchronize Subscription</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
