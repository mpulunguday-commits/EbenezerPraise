
import React, { useState, useRef } from 'react';
import { MeetingMinutes, Member, UserRole } from '../types.ts';
import { 
  FileText, X, Eye, Trash2, Calendar, Search, Plus, Save, Users, Info, BookOpen, Paperclip, Download, FileUp
} from 'lucide-react';

interface MinutesProps {
  members: Member[];
  minutesList: MeetingMinutes[];
  setMinutesList: React.Dispatch<React.SetStateAction<MeetingMinutes[]>>;
  onDeleteMinutes: (id: string) => void;
  currentRole: UserRole;
}

const Minutes: React.FC<MinutesProps> = ({ members, minutesList, setMinutesList, onDeleteMinutes, currentRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingMinutes, setViewingMinutes] = useState<MeetingMinutes | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const canCreate = [UserRole.ADMIN, UserRole.SECRETARIAT].includes(currentRole);

  const [newMinute, setNewMinute] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: 'General' as MeetingMinutes['category'],
    content: '',
    attendees: '',
    fileData: '' as string,
    fileName: '' as string
  });

  const filteredMinutes = minutesList.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMinute(prev => ({
          ...prev,
          fileData: reader.result as string,
          fileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMinutes = () => {
    if (!newMinute.title || (!newMinute.content && !newMinute.fileData)) return;
    
    const minutes: MeetingMinutes = {
      id: Math.random().toString(36).substr(2, 9),
      title: newMinute.title,
      date: newMinute.date,
      category: newMinute.category,
      content: newMinute.content,
      attendees: newMinute.attendees.split(',').map(a => a.trim()).filter(a => a !== ''),
      fileName: newMinute.fileName || undefined,
      // We'll store the file data in a custom field for this session
      // In a real app, this would be a URL to a storage bucket
      ...(newMinute.fileData ? { fileData: newMinute.fileData } : {})
    } as any;

    setMinutesList(prev => [minutes, ...prev]);
    setIsAddModalOpen(false);
    setNewMinute({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: 'General',
      content: '',
      attendees: '',
      fileData: '',
      fileName: ''
    });
  };

  const handleDownload = (minutes: MeetingMinutes) => {
    const data = (minutes as any).fileData;
    if (!data) return;
    
    const link = document.createElement('a');
    link.href = data;
    link.download = minutes.fileName || 'minutes.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Secretariat Archives</h2>
          <p className="text-slate-500 text-sm font-medium">Official records of meeting proceedings and resolutions.</p>
        </div>
        {canCreate && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>New Minutes</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search archive..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/10" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Archival Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Attachment</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Meeting Identification</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMinutes.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-tighter">{m.date}</td>
                  <td className="px-8 py-6 text-center">
                    {m.fileName ? (
                      <div className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Paperclip size={14} />
                      </div>
                    ) : (
                      <span className="text-slate-200">—</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-300 uppercase mb-1 tracking-widest">{m.category}</span>
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{m.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center space-x-3">
                      <button onClick={() => setViewingMinutes(m)} className="p-3 text-slate-400 hover:text-blue-600 bg-slate-100 rounded-xl transition-all shadow-sm" title="View Full Text"><Eye size={18}/></button>
                      {canCreate && (
                        <button onClick={() => onDeleteMinutes(m.id)} className="p-3 text-slate-300 hover:text-red-500 bg-slate-100 rounded-xl transition-all shadow-sm" title="Delete Archive"><Trash2 size={18}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMinutes.length === 0 && (
                 <tr><td colSpan={4} className="py-32 text-center text-slate-300 font-bold italic">No records found in the Ebenezer Secretariat Archives.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Minutes Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200 my-8">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><FileText size={20} /></div>
                <h3 className="text-xl font-black tracking-tight uppercase">Archive Meeting Minutes</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Minute Header / Title</label>
                  <input 
                    type="text"
                    value={newMinute.title}
                    onChange={(e) => setNewMinute({...newMinute, title: e.target.value})}
                    placeholder="e.g. Second Quarter General Meeting"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Meeting Date</label>
                  <input 
                    type="date"
                    value={newMinute.date}
                    onChange={(e) => setNewMinute({...newMinute, date: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Classification Category</label>
                <select 
                  value={newMinute.category}
                  onChange={(e) => setNewMinute({...newMinute, category: e.target.value as any})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="General">General (Full Team)</option>
                  <option value="Music Dept">Music Department</option>
                  <option value="Committee">Executive Committee</option>
                  <option value="Disciplinary">Disciplinary Committee</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Upload Scanned Minutes (Optional)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                  />
                  <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <FileUp size={24} className="text-blue-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-600">
                    {newMinute.fileName ? newMinute.fileName : "Select PDF or Document file"}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {newMinute.fileName ? "Click to change" : "Max size 10MB"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Summary / Deliberations</label>
                <textarea 
                  value={newMinute.content}
                  onChange={(e) => setNewMinute({...newMinute, content: e.target.value})}
                  rows={6}
                  placeholder="Record summary of resolutions here..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none italic"
                />
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl flex items-start space-x-3 border border-amber-100">
                <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                  Dispatched archives are accessible to the whole team. Ensure all resolutions are captured accurately.
                </p>
              </div>

              <button 
                onClick={handleSaveMinutes}
                className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>Archive Official Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Minutes Modal */}
      {viewingMinutes && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-white/20 transform transition-all animate-in fade-in zoom-in duration-300 my-8">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-2xl"><BookOpen size={24} className="text-blue-400" /></div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter leading-tight">{viewingMinutes.title}</h3>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">{viewingMinutes.category} Archive — {viewingMinutes.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {viewingMinutes.fileName && (
                  <button 
                    onClick={() => handleDownload(viewingMinutes)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg flex items-center space-x-2 text-xs font-black uppercase"
                  >
                    <Download size={18} />
                    <span className="hidden sm:inline">Attachment</span>
                  </button>
                )}
                <button onClick={() => setViewingMinutes(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
              </div>
            </div>
            <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
              {viewingMinutes.attendees && viewingMinutes.attendees.length > 0 && (
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                    <Users size={14} className="mr-2" /> Present Officials
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingMinutes.attendees.map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="prose prose-slate max-w-none">
                {viewingMinutes.content ? (
                  <p className="whitespace-pre-wrap text-slate-700 font-medium leading-relaxed italic bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner relative">
                    <span className="absolute top-4 left-4 text-slate-200 text-6xl leading-none font-serif select-none opacity-50">"</span>
                    {viewingMinutes.content}
                  </p>
                ) : (
                  <div className="p-10 text-center bg-slate-50 rounded-[2.5rem] border border-slate-100 border-dashed">
                    <Paperclip size={32} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold italic">No text summary provided. Please refer to the attached document for full details.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setViewingMinutes(null)}
                className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Minutes;
