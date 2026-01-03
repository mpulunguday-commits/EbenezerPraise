
import React, { useState } from 'react';
import { FinancialRecord, UserRole } from '../types.ts';
import { 
  Plus, ArrowUpRight, ArrowDownLeft, X, Save, DollarSign, PieChart, FileSpreadsheet, Trash2, Calendar
} from 'lucide-react';

interface FinanceProps {
  records: FinancialRecord[];
  setRecords: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  currentRole: UserRole;
  onDeleteRecord: (id: string) => void;
}

const Finance: React.FC<FinanceProps> = ({ records, setRecords, currentRole, onDeleteRecord }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Instrument Maintenance',
    amount: '',
    type: 'Income' as 'Income' | 'Expense'
  });

  const totalIncome = records.filter(f => f.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = records.filter(f => f.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);

  const handleSaveTransaction = () => {
    if (!form.description || !form.amount) return;
    const newEntry: FinancialRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: form.date,
      description: form.description,
      category: form.category,
      type: form.type,
      amount: parseFloat(form.amount) || 0
    };
    setRecords(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setForm({ date: new Date().toISOString().split('T')[0], description: '', category: 'Instrument Maintenance', amount: '', type: 'Income' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Treasury Registry</h2><p className="text-slate-500 text-sm">Operational cashbook for Ebenezer Praise Team.</p></div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-black shadow-xl active:scale-95 transition-all"><Plus size={20} /><span>Post Entry</span></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Balance</p><p className={`text-4xl font-black ${totalIncome - totalExpense >= 0 ? 'text-slate-900' : 'text-red-600'}`}>K{(totalIncome - totalExpense).toLocaleString()}</p></div>
        <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100 shadow-sm"><p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Income Flow</p><p className="text-3xl font-black text-emerald-900">K{totalIncome.toLocaleString()}</p></div>
        <div className="bg-rose-50/50 p-8 rounded-[2rem] border border-rose-100 shadow-sm"><p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Expense Flow</p><p className="text-3xl font-black text-rose-900">K{totalExpense.toLocaleString()}</p></div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center space-x-2"><FileSpreadsheet size={18} className="text-slate-400" /><h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em]">Transaction Ledger</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source/Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Value (ZMW)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 text-xs font-black text-slate-400">{record.date}</td>
                  <td className="px-8 py-6"><span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-[9px] font-black uppercase">{record.category}</span></td>
                  <td className="px-8 py-6 font-bold text-slate-900">{record.description}</td>
                  <td className={`px-8 py-6 text-right font-black ${record.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>{record.type === 'Income' ? '+' : '-'} K{record.amount.toLocaleString()}</td>
                  <td className="px-8 py-6 text-center"><button onClick={() => onDeleteRecord(record.id)} className="p-2 text-slate-300 hover:text-red-600 transition-all"><Trash2 size={18} /></button></td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 italic">No financial entries recorded.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-600 rounded-2xl"><DollarSign size={20} /></div>
                <h3 className="text-xl font-black tracking-tight">Post Ledger Entry</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex space-x-4">
                <button 
                  onClick={() => setForm({...form, type: 'Income'})}
                  className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border ${form.type === 'Income' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                >Income</button>
                <button 
                  onClick={() => setForm({...form, type: 'Expense'})}
                  className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border ${form.type === 'Expense' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                >Expense</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Date</label>
                  <input 
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Amount (ZMW)</label>
                  <input 
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Category</label>
                <select 
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                >
                  <option value="Instrument Maintenance">Instrument Maintenance</option>
                  <option value="Transport Subsidy">Transport Subsidy</option>
                  <option value="Offering / Tithes">Offering / Tithes</option>
                  <option value="Uniforms">Uniforms</option>
                  <option value="Kitchen / Refreshments">Kitchen / Refreshments</option>
                  <option value="Communication">Communication</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Description</label>
                <textarea 
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  rows={2}
                  placeholder="Details of transaction..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none resize-none"
                ></textarea>
              </div>

              <button 
                onClick={handleSaveTransaction}
                className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>Synchronize Ledger</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
