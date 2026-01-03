
import React, { useState, useRef } from 'react';
import { Member, UserRole, AttendanceRecord, MemberContribution, SubscriptionRecord, HarvestRecord, DisciplinaryCase } from '../types.ts';
import { CELL_GROUPS } from '../constants.tsx';
import { 
  Plus, Search, MoreVertical, X, Save, UserPlus, UserCircle, Trash2, Edit3, UserCheck, UserX, ExternalLink, MapPin, Phone, Gift, Camera, Activity, Lock, Key, ShieldCheck, CalendarDays, BadgeCheck, HandCoins, History, CheckCircle, AlertTriangle, Gavel, CreditCard, Wheat, Loader2
} from 'lucide-react';

interface MembershipProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  currentRole: UserRole;
  currentUser?: any;
  onViewFinancials?: (memberId: string) => void;
  onDeleteMember?: (memberId: string) => void;
  attendanceRecords?: AttendanceRecord[];
  contributions?: MemberContribution[];
  subscriptions?: SubscriptionRecord[];
  harvests?: HarvestRecord[];
  disciplinaryCases?: DisciplinaryCase[];
}

const Membership: React.FC<MembershipProps> = ({ 
  members, setMembers, currentRole, currentUser, onViewFinancials, onDeleteMember, attendanceRecords = [], contributions = [], subscriptions = [], harvests = [], disciplinaryCases = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedProfileMember, setSelectedProfileMember] = useState<Member | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'finance' | 'attendance' | 'conduct'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newMember, setNewMember] = useState({
    name: '', role: 'Singer', voicePart: 'Soprano' as Member['voicePart'],
    cellGroup: 'Kasaka', phoneNumber: '', dateOfBirth: '',
    joinedDate: new Date().toISOString().split('T')[0], photo: '',
    username: '', password: ''
  });

  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.cellGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phoneNumber.includes(searchTerm)
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'add') setNewMember({ ...newMember, photo: base64String });
        else if (editingMember) setEditingMember({ ...editingMember, photo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = () => {
    if (!newMember.name) return;
    const member: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMember.name, role: newMember.role,
      voicePart: newMember.voicePart, cellGroup: newMember.cellGroup,
      phoneNumber: newMember.phoneNumber, dateOfBirth: newMember.dateOfBirth,
      status: 'Active', joinedDate: newMember.joinedDate, photo: newMember.photo,
      username: newMember.username || undefined, password: newMember.password || undefined
    };
    setMembers(prev => [member, ...prev]);
    setIsAddModalOpen(false);
    setNewMember({
      name: '', role: 'Singer', voicePart: 'Soprano', cellGroup: 'Kasaka',
      phoneNumber: '', dateOfBirth: '', joinedDate: new Date().toISOString().split('T')[0],
      photo: '', username: '', password: ''
    });
  };

  const handleUpdateMember = () => {
    if (!editingMember) return;
    setMembers(prev => prev.map(m => m.id === editingMember.id ? editingMember : m));
    setIsEditModalOpen(false);
    setEditingMember(null);
  };

  const toggleStatus = (id: string, newStatus: Member['status']) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    setActiveMenuId(null);
  };

  const openProfile = (member: Member) => {
    setSelectedProfileMember(member);
    setIsProfileModalOpen(true);
    setProfileTab('overview');
    setActiveMenuId(null);
  };

  const ROLE_OPTIONS = [
    'Team Leader',
    'Secretary',
    'Treasurer',
    'Music Department',
    'Disciplinary',
    'Singer'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-gray-800 tracking-tight">Personnel Directory</h2><p className="text-gray-500 text-sm">Official roster of the Ebenezer Praise Team.</p></div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"><Plus size={18} /><span>Add Personnel</span></button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search roster..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm" /></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                        {member.photo ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover" /> : <UserCircle className="text-gray-300 w-full h-full" />}
                      </div>
                      <div><p className="font-bold text-gray-900 leading-none">{member.name}</p><p className="text-[10px] font-bold text-gray-400 uppercase mt-1.5">{member.cellGroup}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><p className="text-xs text-gray-600">{member.phoneNumber || 'N/A'}</p></td>
                  <td className="px-6 py-4"><p className="text-xs font-bold text-gray-700">{member.role}</p><span className="text-[10px] font-black text-slate-400 uppercase">{member.voicePart}</span></td>
                  <td className="px-6 py-4 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{member.status}</span></td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button onClick={() => openProfile(member)} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Activity size={18} /></button>
                      <button onClick={() => onDeleteMember?.(member.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                      <div className="relative">
                        <button onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)} className="p-2 text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
                        {activeMenuId === member.id && (
                          <div className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <button onClick={() => { setEditingMember(member); setIsEditModalOpen(true); setActiveMenuId(null); }} className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-gray-700 hover:bg-blue-50 rounded-xl transition-colors"><Edit3 size={16} /><span>Edit Member</span></button>
                            <button onClick={() => toggleStatus(member.id, 'Active')} className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-gray-700 hover:bg-green-50 rounded-xl transition-colors"><UserCheck size={16} /><span>Set Active</span></button>
                            <button onClick={() => toggleStatus(member.id, 'Suspended')} className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-gray-700 hover:bg-red-50 rounded-xl transition-colors"><UserX size={16} /><span>Set Suspended</span></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-2xl"><UserPlus size={20} /></div>
                <h3 className="text-xl font-black tracking-tight">{isAddModalOpen ? 'Register Personnel' : 'Edit Personnel'}</h3>
              </div>
              <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="flex justify-center mb-6">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                   <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                     {(isAddModalOpen ? newMember.photo : editingMember?.photo) ? (
                       <img src={isAddModalOpen ? newMember.photo : editingMember?.photo} className="w-full h-full object-cover" />
                     ) : <Camera size={24} className="text-slate-300" />}
                   </div>
                   <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, isAddModalOpen ? 'add' : 'edit')} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Identity</label>
                <input 
                  type="text"
                  value={isAddModalOpen ? newMember.name : editingMember?.name}
                  onChange={(e) => isAddModalOpen ? setNewMember({...newMember, name: e.target.value}) : setEditingMember({...editingMember!, name: e.target.value})}
                  placeholder="e.g. Martha Phiri"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Team Role</label>
                  <select 
                    value={isAddModalOpen ? newMember.role : editingMember?.role}
                    onChange={(e) => isAddModalOpen ? setNewMember({...newMember, role: e.target.value}) : setEditingMember({...editingMember!, role: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  >
                    {ROLE_OPTIONS.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Voice Part</label>
                  <select 
                    value={isAddModalOpen ? newMember.voicePart : editingMember?.voicePart}
                    onChange={(e) => isAddModalOpen ? setNewMember({...newMember, voicePart: e.target.value as any}) : setEditingMember({...editingMember!, voicePart: e.target.value as any})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="Soprano">Soprano</option>
                    <option value="Alto">Alto</option>
                    <option value="Tenor">Tenor</option>
                    <option value="Bass">Bass</option>
                    <option value="Instrumentalist">Instrumentalist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Cell Group</label>
                  <select 
                    value={isAddModalOpen ? newMember.cellGroup : editingMember?.cellGroup}
                    onChange={(e) => isAddModalOpen ? setNewMember({...newMember, cellGroup: e.target.value}) : setEditingMember({...editingMember!, cellGroup: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  >
                    {CELL_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Phone Number</label>
                  <input 
                    type="tel"
                    value={isAddModalOpen ? newMember.phoneNumber : editingMember?.phoneNumber}
                    onChange={(e) => isAddModalOpen ? setNewMember({...newMember, phoneNumber: e.target.value}) : setEditingMember({...editingMember!, phoneNumber: e.target.value})}
                    placeholder="+260..."
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text"
                    value={isAddModalOpen ? newMember.username : editingMember?.username}
                    onChange={(e) => isAddModalOpen ? setNewMember({...newMember, username: e.target.value}) : setEditingMember({...editingMember!, username: e.target.value})}
                    placeholder="Portal Username"
                    className="w-full px-5 py-3.5 bg-slate-100 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                  <input 
                    type="password"
                    value={isAddModalOpen ? newMember.password : editingMember?.password}
                    onChange={(e) => isAddModalOpen ? setNewMember({...newMember, password: e.target.value}) : setEditingMember({...editingMember!, password: e.target.value})}
                    placeholder="Portal Password"
                    className="w-full px-5 py-3.5 bg-slate-100 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={isAddModalOpen ? handleAddMember : handleUpdateMember}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center space-x-2 mt-4"
              >
                <Save size={18} />
                <span>{isAddModalOpen ? 'Confirm Registration' : 'Update Record'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership;
