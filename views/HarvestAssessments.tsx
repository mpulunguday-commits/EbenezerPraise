
import React, { useState } from 'react';
import { HarvestRecord, Member, UserRole } from '../types.ts';
import { Wheat, Plus, Search, X, Edit2, Trash2, Save, DollarSign, UserCircle } from 'lucide-react';

interface HarvestAssessmentsProps {
  members: Member[];
  harvests: HarvestRecord[];
  setHarvests: React.Dispatch<React.SetStateAction<HarvestRecord[]>>;
  currentRole: UserRole;
  onDeleteHarvest: (id: string) => void;
}

const HarvestAssessments: React.FC<HarvestAssessmentsProps> = ({ members, harvests, setHarvests, currentRole, onDeleteHarvest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingHarvest, setEditingHarvest] = useState<HarvestRecord | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editValues, setEditValues] = useState({ assessment: '', paid: '' });
  const [newForm, setNewForm] = useState({ memberId: '', assessmentAmount: '' });

  const filteredHarvests = harvests.filter(h => h.memberName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSaveEdit = () => {
    if (!editingHarvest) return;
    const assessment = parseFloat(editValues.assessment) || 0;
    const paid = parseFloat(editValues.paid) || 0;
    setHarvests(prev => prev.map(h => h.id === editingHarvest.id ? { ...h, assessmentAmount: assessment, amountPaid: paid, status: paid >= assessment ? 'Met' : 'Pending' } : h));
    setEditingHarvest(null);
  };

  const handleCreateNew = () => {
    if (!newForm.memberId || !newForm.assessmentAmount) return;
    const member = members.find(m => m.id === newForm.memberId);
    if (!member) return;
    setHarvests(prev => [{ id: Math.random().toString(36).substr(2, 9), memberId: newForm.memberId, memberName: member.name, assessmentAmount: parseFloat(newForm.assessmentAmount), amountPaid: 0, status: 'Pending' }, ...prev]);
    setIsNewModalOpen(false);
    setNewForm({ memberId: '', assessmentAmount: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Harvest Assessment Flow</h2><p className="text-slate-500 text-sm font-medium">Tracking annual assessments and kingdom pledges.</p></div>
        <button onClick={() => setIsNewModalOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center space-x-2"><Plus size={20} /><span>Post Entry</span></button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30"><div className="relative w-full md:w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Search assessments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none" /></div></div>
        <div className="divide-y divide-slate-100">
          {filteredHarvests.map((h) => (
            <div key={h.id} className="p-6 flex items-center justify-between hover:bg-amber-50/20 transition-colors group">
              <div className="flex items-center space-x-6"><div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600"><Wheat size={24} /></div><div><p className="font-black text-slate-900 text-lg">{h.memberName}</p><p className="text-[10px] font-black text-slate-400 uppercase">Assessment: K{h.assessmentAmount}</p></div></div>
              <div className="flex items-center space-x-4"><div className="text-right mr-4"><p className="text-2xl font-black text-amber-600 leading-none">K{h.amountPaid}</p><p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${h.status === 'Met' ? 'text-green-600' : 'text-amber-400'}`}>{h.status}</p></div><div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setEditingHarvest(h); setEditValues({ assessment: h.assessmentAmount.toString(), paid: h.amountPaid.toString() }); }} className="p-2 text-slate-300 hover:text-amber-600 transition-colors"><Edit2 size={16}/></button><button onClick={() => onDeleteHarvest(h.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button></div></div>
            </div>
          ))}
          {filteredHarvests.length === 0 && (
            <div className="py-20 text-center text-slate-400 italic font-bold">No harvest records indexed.</div>
          )}
        </div>
      </div>

      {isNewModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-amber-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-2xl"><Plus size={20} /></div>
                <h3 className="text-xl font-black tracking-tight">Index New Assessment</h3>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Team Member</label>
                <select 
                  value={newForm.memberId}
                  onChange={(e) => setNewForm({...newForm, memberId: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                >
                  <option value="">Select Personnel...</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Assessment Value (ZMW)</label>
                <input 
                  type="number"
                  value={newForm.assessmentAmount}
                  onChange={(e) => setNewForm({...newForm, assessmentAmount: e.target.value})}
                  placeholder="0.00"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
                />
              </div>
              <button 
                onClick={handleCreateNew}
                className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>Confirm Assessment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {editingHarvest && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-600 rounded-2xl"><Wheat size={20} /></div>
                <h3 className="text-xl font-black tracking-tight">Modify Harvest</h3>
              </div>
              <button onClick={() => setEditingHarvest(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Editing Personnel</p>
                <h4 className="text-xl font-black text-slate-900">{editingHarvest.memberName}</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Target Assessment</label>
                  <input 
                    type="number"
                    value={editValues.assessment}
                    onChange={(e) => setEditValues({...editValues, assessment: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Actual Paid-to-Date</label>
                  <input 
                    type="number"
                    value={editValues.paid}
                    onChange={(e) => setEditValues({...editValues, paid: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveEdit}
                className="w-full py-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>Synchronize Entry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarvestAssessments;
