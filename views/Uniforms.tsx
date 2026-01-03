
import React, { useState } from 'react';
import { UniformAssignment, TeamAsset, Member, UserRole } from '../types.ts';
import { 
  Shirt, 
  Plus, 
  Search, 
  X, 
  Save, 
  Trash2, 
  Mic2, 
  History, 
  Box, 
  CheckCircle, 
  AlertCircle,
  Clock,
  UserCircle
} from 'lucide-react';

interface UniformsProps {
  currentRole: UserRole;
  members: Member[];
  uniforms: UniformAssignment[];
  setUniforms: React.Dispatch<React.SetStateAction<UniformAssignment[]>>;
  assets: TeamAsset[];
  setAssets: React.Dispatch<React.SetStateAction<TeamAsset[]>>;
  onDeleteUniform: (id: string) => void;
  onDeleteAsset: (id: string) => void;
}

const Uniforms: React.FC<UniformsProps> = ({ 
  currentRole, members, uniforms, setUniforms, assets, setAssets, onDeleteUniform, onDeleteAsset 
}) => {
  const [activeTab, setActiveTab] = useState<'uniforms' | 'equipment'>('uniforms');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUniformModalOpen, setIsUniformModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  const isAdmin = [UserRole.ADMIN, UserRole.SECRETARIAT].includes(currentRole);

  const [newUniform, setNewUniform] = useState({
    memberId: '',
    itemName: 'White Praise Suit',
    size: 'M',
    issuedDate: new Date().toISOString().split('T')[0]
  });

  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'Microphone' as TeamAsset['category'],
    condition: 'Good' as TeamAsset['condition'],
    lastServiceDate: new Date().toISOString().split('T')[0]
  });

  const handleAddUniform = () => {
    if (!newUniform.memberId || !newUniform.itemName) return;
    const member = members.find(m => m.id === newUniform.memberId);
    const assignment: UniformAssignment = {
      id: Math.random().toString(36).substr(2, 9),
      memberId: newUniform.memberId,
      memberName: member?.name || 'Unknown',
      itemName: newUniform.itemName,
      size: newUniform.size,
      issuedDate: newUniform.issuedDate,
      status: 'Issued'
    };
    setUniforms(prev => [assignment, ...prev]);
    setIsUniformModalOpen(false);
  };

  const handleAddAsset = () => {
    if (!newAsset.name) return;
    const asset: TeamAsset = {
      id: Math.random().toString(36).substr(2, 9),
      name: newAsset.name,
      category: newAsset.category,
      condition: newAsset.condition,
      lastServiceDate: newAsset.lastServiceDate
    };
    setAssets(prev => [asset, ...prev]);
    setIsAssetModalOpen(false);
  };

  const filteredUniforms = uniforms.filter(u => 
    u.memberName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assets & Wardrobe</h2>
          <p className="text-slate-500 text-sm font-medium">Tracking team uniforms and musical equipment.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => activeTab === 'uniforms' ? setIsUniformModalOpen(true) : setIsAssetModalOpen(true)} 
            className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-black shadow-xl active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>{activeTab === 'uniforms' ? 'Issue Uniform' : 'Register Asset'}</span>
          </button>
        )}
      </div>

      <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-[1.5rem] w-fit">
         <button onClick={() => setActiveTab('uniforms')} className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'uniforms' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Shirt size={14} /><span>Choir Uniforms</span></button>
         <button onClick={() => setActiveTab('equipment')} className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'equipment' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Mic2 size={14} /><span>Equipment</span></button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Search archives..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/10" /></div>
        </div>

        {activeTab === 'uniforms' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item / Size</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Issued On</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUniforms.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center font-black text-blue-600 text-[10px]">{u.memberName.charAt(0)}</div>
                        <p className="font-bold text-slate-900">{u.memberName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-700 text-xs">{u.itemName}</p>
                      <span className="text-[9px] font-black text-slate-400 uppercase">SIZE: {u.size}</span>
                    </td>
                    <td className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-tighter">{u.issuedDate}</td>
                    <td className="px-8 py-5 text-center"><span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.status === 'Issued' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{u.status}</span></td>
                    <td className="px-8 py-5 text-center"><button onClick={() => onDeleteUniform(u.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button></td>
                  </tr>
                ))}
                {filteredUniforms.length === 0 && (
                  <tr><td colSpan={5} className="py-20 text-center text-slate-300 font-bold italic">No uniform assignments recorded.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Identification</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Maintenance</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Condition</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5"><div className="flex items-center space-x-3"><div className="w-8 h-8 rounded-lg bg-slate-900 text-blue-400 flex items-center justify-center"><Box size={14}/></div><p className="font-bold text-slate-900">{a.name}</p></div></td>
                    <td className="px-8 py-5 text-xs font-black text-slate-400 uppercase">{a.category}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-600 italic">Last Service: {a.lastServiceDate}</td>
                    <td className="px-8 py-5 text-center"><span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${a.condition === 'New' || a.condition === 'Good' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.condition}</span></td>
                    <td className="px-8 py-5 text-center"><button onClick={() => onDeleteAsset(a.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button></td>
                  </tr>
                ))}
                {filteredAssets.length === 0 && (
                  <tr><td colSpan={5} className="py-20 text-center text-slate-300 font-bold italic">No equipment assets registered.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Uniform Modal */}
      {isUniformModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3"><div className="p-3 bg-blue-600 rounded-2xl"><Shirt size={20} /></div><h3 className="text-xl font-black tracking-tight">Issue Wardrobe</h3></div>
              <button onClick={() => setIsUniformModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Team Member</label>
                <select value={newUniform.memberId} onChange={(e) => setNewUniform({...newUniform, memberId: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                  <option value="">Select Personnel...</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Uniform Item</label>
                  <select value={newUniform.itemName} onChange={(e) => setNewUniform({...newUniform, itemName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                    <option value="White Praise Suit">White Praise Suit</option>
                    <option value="Blue Ebenezer Gown">Blue Ebenezer Gown</option>
                    <option value="Anniversary T-Shirt">Anniversary T-Shirt</option>
                    <option value="Standard UCZ Uniform">Standard UCZ Uniform</option>
                    <option value="Ebenezer Cap">Ebenezer Cap</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Size</label>
                  <select value={newUniform.size} onChange={(e) => setNewUniform({...newUniform, size: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleAddUniform} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all">Synchronize Assignment</button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Modal */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3"><div className="p-3 bg-indigo-600 rounded-2xl"><Mic2 size={20} /></div><h3 className="text-xl font-black tracking-tight">Register Team Asset</h3></div>
              <button onClick={() => setIsAssetModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Asset Name</label>
                <input type="text" value={newAsset.name} onChange={(e) => setNewAsset({...newAsset, name: e.target.value})} placeholder="e.g. Yamaha MX-80 Keyboard" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Category</label>
                  <select value={newAsset.category} onChange={(e) => setNewAsset({...newAsset, category: e.target.value as any})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                    <option value="Microphone">Microphone</option>
                    <option value="Instrument">Instrument</option>
                    <option value="Sound System">Sound System</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Current Condition</label>
                  <select value={newAsset.condition} onChange={(e) => setNewAsset({...newAsset, condition: e.target.value as any})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
              </div>
              <button onClick={handleAddAsset} className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all">Register to Archive</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Uniforms;
