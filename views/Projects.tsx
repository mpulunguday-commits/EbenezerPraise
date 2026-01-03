
import React, { useState } from 'react';
import { TeamProject, ProjectTransaction, UserRole } from '../types.ts';
import { 
  Briefcase, Trash2, History, Layers, Plus, X, Save, Edit3, DollarSign, ArrowUpCircle, ArrowDownCircle, HandCoins
} from 'lucide-react';

interface ProjectsProps {
  currentRole: UserRole;
  projects: TeamProject[];
  setProjects: React.Dispatch<React.SetStateAction<TeamProject[]>>;
  transactions: ProjectTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<ProjectTransaction[]>>;
  onDeleteProject: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({ currentRole, projects, setProjects, transactions, setTransactions, onDeleteProject, onDeleteTransaction }) => {
  const [activeView, setActiveView] = useState<'cards' | 'history'>('cards');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editingProject, setEditingProject] = useState<TeamProject | null>(null);
  const [selectedProjectForTrans, setSelectedProjectForTrans] = useState<TeamProject | null>(null);

  const [projectForm, setProjectForm] = useState({
    name: '',
    category: 'Munkoyo' as TeamProject['category'],
    status: 'Active' as TeamProject['status'],
    description: ''
  });

  const [transForm, setTransForm] = useState({
    amount: '',
    type: 'Revenue' as ProjectTransaction['type'],
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleDeleteProject = (id: string) => {
    onDeleteProject(id);
  };

  const handleDeleteTransaction = (id: string) => {
    const t = transactions.find(item => item.id === id);
    if (t) {
       setProjects(prev => prev.map(p => p.id === t.projectId ? {
         ...p,
         totalRevenue: t.type === 'Revenue' ? p.totalRevenue - t.amount : p.totalRevenue,
         totalExpenses: t.type === 'Expense' ? p.totalExpenses - t.amount : p.totalExpenses
       } : p));
    }
    onDeleteTransaction(id);
  };

  const handleOpenAdd = () => {
    setModalType('add');
    setProjectForm({ name: '', category: 'Munkoyo', status: 'Active', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: TeamProject) => {
    setModalType('edit');
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      category: project.category,
      status: project.status,
      description: project.description
    });
    setIsModalOpen(true);
  };

  const handleOpenLogTrans = (project: TeamProject) => {
    setSelectedProjectForTrans(project);
    setTransForm({
      amount: '',
      type: 'Revenue',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsTransModalOpen(true);
  };

  const handleSaveProject = () => {
    if (!projectForm.name) return;

    if (modalType === 'add') {
      const newProject: TeamProject = {
        id: Math.random().toString(36).substr(2, 9),
        name: projectForm.name,
        category: projectForm.category,
        description: projectForm.description,
        status: projectForm.status,
        totalRevenue: 0,
        totalExpenses: 0,
        lastUpdate: new Date().toISOString().split('T')[0]
      };
      setProjects(prev => [newProject, ...prev]);
    } else if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? {
        ...p,
        name: projectForm.name,
        category: projectForm.category,
        status: projectForm.status,
        description: projectForm.description,
        lastUpdate: new Date().toISOString().split('T')[0]
      } : p));
    }
    setIsModalOpen(false);
  };

  const handleSaveTransaction = () => {
    if (!selectedProjectForTrans || !transForm.amount || !transForm.description) return;
    
    const amount = parseFloat(transForm.amount) || 0;
    const newTrans: ProjectTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: selectedProjectForTrans.id,
      date: transForm.date,
      type: transForm.type,
      amount: amount,
      description: transForm.description
    };

    setTransactions(prev => [newTrans, ...prev]);
    setProjects(prev => prev.map(p => p.id === selectedProjectForTrans.id ? {
      ...p,
      totalRevenue: transForm.type === 'Revenue' ? p.totalRevenue + amount : p.totalRevenue,
      totalExpenses: transForm.type === 'Expense' ? p.totalExpenses + amount : p.totalExpenses,
      lastUpdate: transForm.date
    } : p));

    setIsTransModalOpen(false);
    setSelectedProjectForTrans(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Venture Capital Oversight</h2>
          <p className="text-slate-500 text-sm font-medium">Income generating activities supporting Ebenezer missions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>Launch Venture</span>
          </button>
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-2xl">
             <button onClick={() => setActiveView('cards')} className={`p-3 rounded-xl transition-all ${activeView === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`} title="Grid View"><Layers size={20} /></button>
             <button onClick={() => setActiveView('history')} className={`p-3 rounded-xl transition-all ${activeView === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`} title="Transaction Logs"><History size={20} /></button>
          </div>
        </div>
      </div>

      {activeView === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 group relative overflow-hidden transition-all hover:shadow-xl flex flex-col">
              <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                <button onClick={() => handleOpenEdit(project)} className="p-2 text-slate-300 hover:text-blue-600 bg-white shadow-sm rounded-xl border border-slate-100" title="Edit Venture"><Edit3 size={18} /></button>
                <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-slate-300 hover:text-red-500 bg-white shadow-sm rounded-xl border border-slate-100" title="Delete Venture"><Trash2 size={18} /></button>
              </div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-slate-900 text-blue-400 rounded-2xl flex items-center justify-center shadow-lg"><Briefcase size={24} /></div>
                <div><h3 className="font-black text-slate-900 text-lg uppercase tracking-tighter leading-tight">{project.name}</h3><p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">{project.category}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100"><p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Inflow</p><p className="text-2xl font-black text-emerald-900">K{project.totalRevenue.toLocaleString()}</p></div>
                <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100"><p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Outflow</p><p className="text-2xl font-black text-rose-900">K{project.totalExpenses.toLocaleString()}</p></div>
              </div>
              
              <button 
                onClick={() => handleOpenLogTrans(project)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-black transition-all active:scale-95 mb-6"
              >
                <DollarSign size={16} />
                <span>Log Finances</span>
              </button>

              <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>State: {project.status}</span>
                <span className="italic">Synced: {project.lastUpdate}</span>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-32 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
               <Briefcase size={48} className="mx-auto text-slate-100 mb-4" />
               <p className="text-slate-400 font-bold italic">No kingdom ventures initialized.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Post Date</th><th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Venture</th><th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Description</th><th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Value</th><th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Action</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                   {transactions.map(t => (
                     <tr key={t.id} className="hover:bg-slate-50/50 group transition-colors"><td className="px-8 py-6 text-xs font-black text-slate-400 uppercase">{t.date}</td><td className="px-8 py-6 font-black text-slate-900">{projects.find(p => p.id === t.projectId)?.name || 'Archive'}</td><td className="px-8 py-6 text-sm text-slate-600 font-medium italic">"{t.description}"</td><td className={`px-8 py-6 text-right font-black ${t.type === 'Revenue' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.type === 'Revenue' ? '+' : '-'} K{t.amount.toLocaleString()}</td><td className="px-8 py-6 text-center"><button onClick={() => handleDeleteTransaction(t.id)} className="p-3 text-slate-300 hover:text-red-500 bg-slate-50 rounded-2xl transition-all shadow-sm"><Trash2 size={18} /></button></td></tr>
                   ))}
                   {transactions.length === 0 && (
                     <tr><td colSpan={5} className="py-32 text-center text-slate-300 font-bold italic">No financial history recorded for ventures.</td></tr>
                   )}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Project Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-2xl"><Briefcase size={20} /></div>
                <h3 className="text-xl font-black tracking-tight">{modalType === 'add' ? 'Launch New Venture' : 'Refine Project Details'}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Venture Title</label>
                <input 
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="e.g. Ebenezer Layer Poultry"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Category</label>
                  <select 
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="Munkoyo">Munkoyo</option>
                    <option value="Transport">Transport</option>
                    <option value="Farming">Farming</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Meat Selling">Meat Selling</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Current State</label>
                  <select 
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Strategic Description</label>
                <textarea 
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  rows={3}
                  placeholder="Briefly describe the venture goals..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                />
              </div>
              <button 
                onClick={handleSaveProject}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>{modalType === 'add' ? 'Initiate Project' : 'Commit Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal (Log Finance) */}
      {isTransModalOpen && selectedProjectForTrans && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg"><HandCoins size={20} /></div>
                <h3 className="text-xl font-black tracking-tight">Record Financials</h3>
              </div>
              <button onClick={() => setIsTransModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Venture Account</p>
                <h4 className="text-xl font-black text-slate-900 leading-tight">{selectedProjectForTrans.name}</h4>
              </div>

              <div className="flex space-x-2">
                 <button onClick={() => setTransForm({...transForm, type: 'Revenue'})} className={`flex-1 flex flex-col items-center p-4 rounded-2xl border transition-all ${transForm.type === 'Revenue' ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-inner' : 'bg-slate-50 border-slate-100 text-slate-400'}`}><ArrowUpCircle size={20} className="mb-1"/><span className="text-[10px] font-black uppercase">Revenue</span></button>
                 <button onClick={() => setTransForm({...transForm, type: 'Expense'})} className={`flex-1 flex flex-col items-center p-4 rounded-2xl border transition-all ${transForm.type === 'Expense' ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-inner' : 'bg-slate-50 border-slate-100 text-slate-400'}`}><ArrowDownCircle size={20} className="mb-1"/><span className="text-[10px] font-black uppercase">Expense</span></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Date</label>
                  <input 
                    type="date"
                    value={transForm.date}
                    onChange={(e) => setTransForm({...transForm, date: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Value (ZMW)</label>
                  <input 
                    type="number"
                    value={transForm.amount}
                    onChange={(e) => setTransForm({...transForm, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 text-center outline-none focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Transaction Note</label>
                <input 
                  type="text"
                  value={transForm.description}
                  onChange={(e) => setTransForm({...transForm, description: e.target.value})}
                  placeholder="e.g. Batch of 50 eggs sold"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                />
              </div>

              <button 
                onClick={handleSaveTransaction}
                className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>Synchronize Ledger</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
