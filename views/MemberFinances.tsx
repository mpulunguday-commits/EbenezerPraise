
import React, { useState, useEffect } from 'react';
import { Member, MemberContribution, UserRole, SubscriptionRecord, HarvestRecord } from '../types.ts';
import { 
  Search, HandCoins, X, History, Plus, Save, Trash2, DollarSign, Calendar
} from 'lucide-react';

interface MemberFinancesProps {
  currentRole: UserRole;
  members: Member[];
  contributions: MemberContribution[];
  setContributions: React.Dispatch<React.SetStateAction<MemberContribution[]>>;
  subscriptions: SubscriptionRecord[];
  harvests: HarvestRecord[];
  initialMemberId?: string;
  onCloseDetail?: () => void;
  onDeleteContribution: (id: string) => void;
}

const MemberFinances: React.FC<MemberFinancesProps> = ({ 
  currentRole, members, contributions, setContributions, subscriptions, harvests, initialMemberId, onCloseDetail, onDeleteContribution
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ memberId: '', amount: '', type: 'Tithe' as MemberContribution['type'], date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    if (initialMemberId) {
      const member = members.find(m => m.id === initialMemberId);
      if (member) setSelectedMember(member);
    }
  }, [initialMemberId, members]);

  const memberStats = members.map(m => {
    const totalCont = contributions.filter(c => c.memberId === m.id).reduce((acc, curr) => acc + curr.amount, 0);
    const subTotal = subscriptions.filter(s => s.memberId === m.id).reduce((acc, curr) => acc + curr.amountPaid, 0);
    const harvestTotal = harvests.filter(h => h.memberId === m.id).reduce((acc, curr) => acc + curr.amountPaid, 0);
    return { ...m, totalContribution: totalCont + subTotal + harvestTotal };
  });

  const filteredMembers = memberStats.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSavePayment = () => {
    if (!paymentForm.memberId || !paymentForm.amount) return;
    const member = members.find(m => m.id === paymentForm.memberId);
    setContributions(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      memberId: paymentForm.memberId,
      memberName: member?.name || 'Unknown',
      amount: parseFloat(paymentForm.amount),
      type: paymentForm.type,
      date: paymentForm.date
    }, ...prev]);
    setIsPaymentModalOpen(false);
    setPaymentForm({ memberId: '', amount: '', type: 'Tithe', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Contribution Audit</h2><p className="text-slate-500 text-sm font-medium">Tracking Tithes, Offerings, and Harvest payments.</p></div>
        <button onClick={() => setIsPaymentModalOpen(true)} className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center space-x-2"><Plus size={20} /><span>Post Offering</span></button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none" /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Member</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aggregate (YTD)</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-900">{member.name}</td>
                  <td className="px-8 py-5 text-right font-black text-blue-600">K{member.totalContribution.toLocaleString()}</td>
                  <td className="px-8 py-5 text-center"><button onClick={() => setSelectedMember(member)} className="p-3 text-slate-400 hover:text-blue-600 bg-slate-100 rounded-2xl transition-all"><History size={18} /></button></td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr><td colSpan={3} className="py-20 text-center text-slate-400 italic font-bold">No member records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-2xl"><HandCoins size={20} /></div>
                <h3 className="text-xl font-black tracking-tight uppercase">Post Contribution</h3>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Team Member</label>
                <select 
                  value={paymentForm.memberId}
                  onChange={(e) => setPaymentForm({...paymentForm, memberId: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                >
                  <option value="">Select Personnel...</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Entry Type</label>
                  <select 
                    value={paymentForm.type}
                    onChange={(e) => setPaymentForm({...paymentForm, type: e.target.value as any})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  >
                    <option value="Tithe">Tithe</option>
                    <option value="Offering">Offering</option>
                    <option value="Harvest">Harvest</option>
                    <option value="Subscription">Monthly Subs</option>
                    <option value="UCZ Mission Fund">Mission Fund</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Amount (ZMW)</label>
                  <input 
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Entry Date</label>
                <input 
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                />
              </div>

              <button 
                onClick={handleSavePayment}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>Confirm Contribution</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMember && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white"><h3 className="text-xl font-black">{selectedMember.name} Account</h3><button onClick={() => setSelectedMember(null)}><X size={24} /></button></div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4 bg-slate-50">
               {contributions.filter(c => c.memberId === selectedMember.id).map(c => (
                 <div key={c.id} className="p-5 bg-white rounded-2xl border border-slate-100 flex justify-between items-center group shadow-sm">
                    <div className="flex items-center space-x-4"><div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><HandCoins size={16}/></div><div><p className="font-bold text-slate-900">{c.type}</p><p className="text-[10px] font-black text-slate-400 uppercase">{c.date}</p></div></div>
                    <div className="flex items-center space-x-4"><p className="font-black text-lg text-slate-900">K{c.amount.toLocaleString()}</p><button onClick={() => onDeleteContribution(c.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button></div>
                 </div>
               ))}
               {contributions.filter(c => c.memberId === selectedMember.id).length === 0 && (
                 <div className="py-12 text-center text-slate-400 italic">No contributions archived for this member.</div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberFinances;
