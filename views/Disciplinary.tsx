
import React, { useState } from 'react';
import { DisciplinaryCase, GroupRule, Member, UserRole, CommitteeMember } from '../types.ts';
import { 
  Search, X, Gavel, DollarSign, Trash2, AlertTriangle, Book, Users, Save, Plus, FileText, Shield, UserPlus
} from 'lucide-react';

interface DisciplinaryProps {
  members: Member[];
  cases: DisciplinaryCase[];
  setCases: React.Dispatch<React.SetStateAction<DisciplinaryCase[]>>;
  rules: GroupRule[];
  setRules: React.Dispatch<React.SetStateAction<GroupRule[]>>;
  committeeMembers: CommitteeMember[];
  setCommitteeMembers: React.Dispatch<React.SetStateAction<CommitteeMember[]>>;
  onDeleteCase: (id: string) => void;
  onDeleteRule: (id: string) => void;
  onDeleteCommitteeMember: (id: string) => void;
  currentRole: UserRole;
}

const Disciplinary: React.FC<DisciplinaryProps> = ({ 
  members, cases, setCases, rules, setRules, committeeMembers, setCommitteeMembers, onDeleteCase, onDeleteRule, onDeleteCommitteeMember, currentRole 
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'rules' | 'committee'>('cases');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState<'case' | 'rule' | 'panel' | 'fine' | null>(null);
  const [selectedCase, setSelectedCase] = useState<DisciplinaryCase | null>(null);

  // Form States
  const [caseForm, setCaseForm] = useState({ memberId: '', issue: '', fine: '0' });
  const [ruleForm, setRuleForm] = useState({ title: '', desc: '', cat: 'General' as GroupRule['category'] });
  const [panelForm, setPanelForm] = useState({ memberId: '', role: 'Member' as CommitteeMember['committeeRole'] });
  const [fineUpdate, setFineUpdate] = useState('');

  const filteredCases = cases.filter(c => c.memberName.toLowerCase().includes(searchTerm.toLowerCase()) || c.issue.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSaveCase = () => {
    if (!caseForm.memberId || !caseForm.issue) return;
    const member = members.find(m => m.id === caseForm.memberId);
    const newCase: DisciplinaryCase = {
      id: Math.random().toString(36).substr(2, 9),
      memberId: caseForm.memberId,
      memberName: member?.name || 'Unknown',
      date: new Date().toLocaleDateString(),
      issue: caseForm.issue,
      resolution: 'Open Case',
      status: 'Open',
      fineAmount: parseFloat(caseForm.fine) || 0,
      finePaid: 0
    };
    setCases(prev => [newCase, ...prev]);
    setActiveModal(null);
  };

  const handleSaveRule = () => {
    if (!ruleForm.title || !ruleForm.desc) return;
    const newRule: GroupRule = {
      id: Math.random().toString(36).substr(2, 9),
      title: ruleForm.title,
      description: ruleForm.desc,
      category: ruleForm.cat,
      effectiveDate: new Date().toLocaleDateString()
    };
    setRules(prev => [newRule, ...prev]);
    setActiveModal(null);
  };

  const handleSavePanel = () => {
    if (!panelForm.memberId) return;
    const member = members.find(m => m.id === panelForm.memberId);
    const newPanel: CommitteeMember = {
      id: Math.random().toString(36).substr(2, 9),
      memberId: panelForm.memberId,
      name: member?.name || 'Unknown',
      committeeRole: panelForm.role,
      appointedDate: new Date().toLocaleDateString()
    };
    setCommitteeMembers(prev => [newPanel, ...prev]);
    setActiveModal(null);
  };

  const handleUpdateFine = () => {
    if (!selectedCase) return;
    const paid = parseFloat(fineUpdate) || 0;
    setCases(prev => prev.map(c => c.id === selectedCase.id ? { 
      ...c, 
      finePaid: c.finePaid + paid, 
      status: (c.finePaid + paid) >= c.fineAmount ? 'Closed' : 'Open' 
    } : c));
    setActiveModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Stewardship Integrity Panel</h2><p className="text-slate-500 text-sm">Oversight for team conduct, rules, and panel leadership.</p></div>
        <button onClick={() => {
          if (activeTab === 'cases') setActiveModal('case');
          else if (activeTab === 'rules') setActiveModal('rule');
          else setActiveModal('panel');
        }} className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-black shadow-xl active:scale-95 transition-all">
          <Plus size={18} />
          <span>{activeTab === 'cases' ? 'Log Incident' : activeTab === 'rules' ? 'New Rule' : 'Add Panelist'}</span>
        </button>
      </div>

      <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-[1.5rem] w-fit">
         {[{ id: 'cases', label: 'Incidents', icon: AlertTriangle }, { id: 'rules', label: 'The Code', icon: Book }, { id: 'committee', label: 'The Panel', icon: Users }].map(tab => (
           <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><tab.icon size={14} /><span>{tab.label}</span></button>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden min-h-[500px]">
        {activeTab === 'cases' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Personnel</th><th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Breach</th><th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Penalty</th><th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Outcome</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900 leading-none">{c.memberName}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase mt-2">{c.date}</p>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-600 font-medium">{c.issue}</td>
                    <td className="px-8 py-6 text-right font-black text-red-600">K{c.fineAmount}</td>
                    <td className="px-8 py-6 text-center"><div className="flex justify-center items-center space-x-2"><span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase mr-2 ${c.status === 'Open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{c.status}</span><button onClick={() => { setSelectedCase(c); setFineUpdate(''); setActiveModal('fine'); }} className="p-3 text-amber-600 bg-amber-50 rounded-2xl transition-all shadow-sm"><DollarSign size={18}/></button><button onClick={() => onDeleteCase(c.id)} className="p-3 text-slate-300 hover:text-red-600 bg-slate-50 rounded-2xl transition-all"><Trash2 size={18}/></button></div></td>
                  </tr>
                ))}
                {filteredCases.length === 0 && (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-400 italic font-bold">No conduct records in index.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'rules' && (
           <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {rules.map(rule => (
                <div key={rule.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group relative">
                   <button onClick={() => onDeleteRule(rule.id)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
                   <div className="mb-4"><span className="text-[9px] font-black bg-white text-red-600 px-2 py-1 rounded border border-red-100 uppercase tracking-widest">{rule.category}</span></div>
                   <h4 className="text-xl font-black text-slate-900 mb-2">{rule.title}</h4>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"{rule.description}"</p>
                </div>
              ))}
              {rules.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-300 font-bold italic">The team code is currently being drafted.</div>
              )}
           </div>
        )}
        {activeTab === 'committee' && (
           <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {committeeMembers.map(cm => (
                <div key={cm.id} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-center group relative">
                   <button onClick={() => onDeleteCommitteeMember(cm.id)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                   <div className="w-16 h-16 bg-slate-900 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"><Gavel size={32} /></div>
                   <h4 className="text-lg font-black text-slate-900 leading-tight">{cm.name}</h4>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-2">{cm.committeeRole}</p>
                </div>
              ))}
              {committeeMembers.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-300 font-bold italic">The Panel has not been constituted.</div>
              )}
           </div>
        )}
      </div>

      {/* Modals */}
      {activeModal === 'case' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-rose-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3"><AlertTriangle size={24} /><h3 className="text-xl font-black tracking-tight uppercase">Log Breach</h3></div>
              <button onClick={() => setActiveModal(null)}><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Member Involved</label>
                <select value={caseForm.memberId} onChange={(e) => setCaseForm({...caseForm, memberId: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                  <option value="">Select Personnel...</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Details of Incident</label>
                <textarea value={caseForm.issue} onChange={(e) => setCaseForm({...caseForm, issue: e.target.value})} rows={3} placeholder="Describe the violation..." className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold resize-none"></textarea>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Fines Imposed (ZMW)</label>
                <input type="number" value={caseForm.fine} onChange={(e) => setCaseForm({...caseForm, fine: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
              </div>
              <button onClick={handleSaveCase} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black active:scale-95 transition-all">Synchronize Incident</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'rule' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3"><Book size={24} /><h3 className="text-xl font-black tracking-tight uppercase">Index Team Code</h3></div>
              <button onClick={() => setActiveModal(null)}><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Rule Title</label>
                <input type="text" value={ruleForm.title} onChange={(e) => setRuleForm({...ruleForm, title: e.target.value})} placeholder="e.g. Uniform Standard" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Mandate</label>
                <textarea value={ruleForm.desc} onChange={(e) => setRuleForm({...ruleForm, desc: e.target.value})} rows={4} placeholder="Full description of the rule..." className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold resize-none"></textarea>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Category</label>
                <select value={ruleForm.cat} onChange={(e) => setRuleForm({...ruleForm, cat: e.target.value as any})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                  {['Punctuality', 'Uniform', 'Conduct', 'Financial', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={handleSaveRule} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black active:scale-95 transition-all">Enforce Code</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'panel' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3"><UserPlus size={24} /><h3 className="text-lg font-black tracking-tight uppercase">Add Panelist</h3></div>
              <button onClick={() => setActiveModal(null)}><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Personnel</label>
                <select value={panelForm.memberId} onChange={(e) => setPanelForm({...panelForm, memberId: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                   <option value="">Select Member...</option>
                   {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Committee Role</label>
                <select value={panelForm.role} onChange={(e) => setPanelForm({...panelForm, role: e.target.value as any})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                   <option value="Chairperson">Chairperson</option>
                   <option value="Secretary">Secretary</option>
                   <option value="Member">Member</option>
                </select>
              </div>
              <button onClick={handleSavePanel} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black active:scale-95 transition-all">Appoint to Panel</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'fine' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3"><DollarSign size={20} /><h3 className="text-lg font-black tracking-tight">Fine Collection</h3></div>
              <button onClick={() => setActiveModal(null)}><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collecting for</p>
                  <h4 className="text-lg font-black text-slate-900">{selectedCase?.memberName}</h4>
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Amount to Pay (ZMW)</label>
                  <input type="number" value={fineUpdate} onChange={(e) => setFineUpdate(e.target.value)} placeholder="0.00" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-center text-2xl" />
               </div>
               <button onClick={handleUpdateFine} className="w-full py-5 bg-amber-600 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all">Process Fine</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Disciplinary;
