
import React, { useState } from 'react';
import { ConcertFinance, UserRole } from '../types.ts';
import { Ticket, Plus, DollarSign, X, Trash2, Calendar as CalendarIcon, Tag, Save, Edit3, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface ConcertFinancesProps {
  currentRole: UserRole;
  concerts: ConcertFinance[];
  setConcerts: React.Dispatch<React.SetStateAction<ConcertFinance[]>>;
  onDeleteConcert: (id: string) => void;
}

const ConcertFinances: React.FC<ConcertFinancesProps> = ({ currentRole, concerts, setConcerts, onDeleteConcert }) => {
  const [activeModal, setActiveModal] = useState<'income' | 'new' | 'edit' | null>(null);
  const [selectedConcert, setSelectedConcert] = useState<ConcertFinance | null>(null);
  const [logValue, setLogValue] = useState({ amount: '', type: 'income' as 'income' | 'expense', desc: '' });
  
  const [concertForm, setConcertForm] = useState({
    name: '',
    type: 'Main Ebe' as ConcertFinance['type'],
    date: new Date().toISOString().split('T')[0],
    budget: '',
    status: 'Planning' as ConcertFinance['status']
  });

  const handleSaveLog = () => {
    if (!selectedConcert) return;
    const val = parseFloat(logValue.amount) || 0;
    setConcerts(prev => prev.map(c => c.id === selectedConcert.id ? { 
      ...c, 
      actualIncome: logValue.type === 'income' ? c.actualIncome + val : c.actualIncome, 
      actualExpense: logValue.type === 'expense' ? c.actualExpense + val : c.actualExpense 
    } : c));
    setActiveModal(null);
    setLogValue({ amount: '', type: 'income', desc: '' });
  };

  const handleOpenAdd = () => {
    setConcertForm({ name: '', type: 'Main Ebe', date: new Date().toISOString().split('T')[0], budget: '', status: 'Planning' });
    setActiveModal('new');
  };

  const handleOpenEdit = (concert: ConcertFinance) => {
    setSelectedConcert(concert);
    setConcertForm({
      name: concert.concertName,
      type: concert.type,
      date: concert.date,
      budget: concert.budget.toString(),
      status: concert.status
    });
    setActiveModal('edit');
  };

  const handleSaveConcert = () => {
    if (!concertForm.name || !concertForm.budget) return;

    if (activeModal === 'new') {
      const newConcert: ConcertFinance = {
        id: Math.random().toString(36).substr(2, 9),
        concertName: concertForm.name,
        type: concertForm.type,
        date: concertForm.date,
        budget: parseFloat(concertForm.budget) || 0,
        actualIncome: 0,
        actualExpense: 0,
        status: concertForm.status
      };
      setConcerts(prev => [newConcert, ...prev]);
    } else if (selectedConcert) {
      setConcerts(prev => prev.map(c => c.id === selectedConcert.id ? {
        ...c,
        concertName: concertForm.name,
        type: concertForm.type,
        date: concertForm.date,
        budget: parseFloat(concertForm.budget) || 0,
        status: concertForm.status
      } : c));
    }
    setActiveModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Project P&L Oversight</h2><p className="text-slate-500 text-sm">Budget management for Ebenezer public events.</p></div>
        <button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center space-x-2"><Plus size={20} /><span>Launch Event</span></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {concerts.map(concert => (
          <div key={concert.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all">
            <div className="p-8 bg-slate-900 text-white">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-1 rounded">{concert.type}</span>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenEdit(concert)} className="text-white/40 hover:text-blue-400 transition-colors p-1"><Edit3 size={18}/></button>
                  <button onClick={() => onDeleteConcert(concert.id)} className="text-white/40 hover:text-red-400 transition-colors p-1"><Trash2 size={20}/></button>
                </div>
              </div>
              <h3 className="text-2xl font-black">{concert.concertName}</h3>
              <div className="flex items-center text-sm text-white/80 space-x-4 mt-2"><div className="flex items-center space-x-1"><CalendarIcon size={14}/><span>{concert.date}</span></div><div className="flex items-center space-x-1"><Tag size={14}/><span>{concert.status}</span></div></div>
            </div>
            <div className="p-8 grid grid-cols-2 gap-8">
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Budget Allocation</p><p className="text-2xl font-black">K{concert.budget}</p></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Financial State</p><p className={`text-2xl font-black ${concert.actualIncome - concert.actualExpense >= 0 ? 'text-green-600' : 'text-red-500'}`}>K{concert.actualIncome - concert.actualExpense}</p></div>
            </div>
            <div className="px-8 pb-8 mt-auto flex space-x-4">
              <button 
                onClick={() => { setSelectedConcert(concert); setActiveModal('income'); }} 
                className="flex-1 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
              >
                <DollarSign size={18}/>
                <span>Adjust Accounts</span>
              </button>
            </div>
          </div>
        ))}
        {concerts.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 italic font-bold">No events launched. Click "Launch Event" to begin.</div>
        )}
      </div>

      {activeModal === 'income' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3"><DollarSign size={20}/><h3 className="text-lg font-black tracking-tight">Post Event Data</h3></div>
              <button onClick={() => setActiveModal(null)}><X size={24}/></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex space-x-2">
                 <button onClick={() => setLogValue({...logValue, type: 'income'})} className={`flex-1 flex flex-col items-center p-4 rounded-2xl border transition-all ${logValue.type === 'income' ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-inner' : 'bg-slate-50 border-slate-100 text-slate-400'}`}><ArrowUpCircle size={20} className="mb-1"/><span className="text-[10px] font-black uppercase">Revenue</span></button>
                 <button onClick={() => setLogValue({...logValue, type: 'expense'})} className={`flex-1 flex flex-col items-center p-4 rounded-2xl border transition-all ${logValue.type === 'expense' ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-inner' : 'bg-slate-50 border-slate-100 text-slate-400'}`}><ArrowDownCircle size={20} className="mb-1"/><span className="text-[10px] font-black uppercase">Expense</span></button>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Value (ZMW)</label>
                <input type="number" value={logValue.amount} onChange={(e) => setLogValue({...logValue, amount: e.target.value})} placeholder="0.00" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-center text-3xl outline-none" />
              </div>
              <button onClick={handleSaveLog} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all">Synchronize Entry</button>
            </div>
          </div>
        </div>
      )}

      {(activeModal === 'new' || activeModal === 'edit') && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-2xl"><Ticket size={20} /></div>
                <h3 className="text-xl font-black tracking-tight">{activeModal === 'new' ? 'Launch New Activity' : 'Update Activity Details'}</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Event Label</label>
                <input 
                  type="text"
                  value={concertForm.name}
                  onChange={(e) => setConcertForm({ ...concertForm, name: e.target.value })}
                  placeholder="e.g. Annual Ebe Festival 2024"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Event Date</label>
                  <input 
                    type="date"
                    value={concertForm.date}
                    onChange={(e) => setConcertForm({ ...concertForm, date: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Type</label>
                  <select 
                    value={concertForm.type}
                    onChange={(e) => setConcertForm({ ...concertForm, type: e.target.value as any })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="Main Ebe">Main Ebe</option>
                    <option value="Group">Group</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Budget (ZMW)</label>
                  <input 
                    type="number"
                    value={concertForm.budget}
                    onChange={(e) => setConcertForm({ ...concertForm, budget: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Status</label>
                  <select 
                    value={concertForm.status}
                    onChange={(e) => setConcertForm({ ...concertForm, status: e.target.value as any })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleSaveConcert}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>{activeModal === 'new' ? 'Commence Planning' : 'Update Strategic Plan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConcertFinances;
