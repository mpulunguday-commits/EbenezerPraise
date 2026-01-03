
import React, { useState } from 'react';
import { Song, UserRole } from '../types.ts';
import { Music, Search, Plus, X, Save, Trash2, Key, UserCircle, Tag } from 'lucide-react';

interface MusicDeptProps {
  currentRole: UserRole;
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  onDeleteSong: (id: string) => void;
}

const MusicDept: React.FC<MusicDeptProps> = ({ currentRole, songs, setSongs, onDeleteSong }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', key: 'C', composer: '', tags: '' });

  const filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.composer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSong = () => {
    if (!newSong.title) return;
    const song: Song = {
      id: Math.random().toString(36).substr(2, 9),
      title: newSong.title, key: newSong.key, composer: newSong.composer || 'Unknown',
      tags: newSong.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };
    setSongs(prev => [song, ...prev]);
    setIsAddModalOpen(false);
    setNewSong({ title: '', key: 'C', composer: '', tags: '' });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Worship Library</h2>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center space-x-2"><Plus size={18} /><span>Add New Song</span></button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Search songs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8 max-h-[700px] overflow-y-auto custom-scrollbar">
          {filteredSongs.map((song) => (
            <div key={song.id} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl transition-all group relative">
              <button onClick={() => onDeleteSong(song.id)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
              <div className="mb-4"><span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">KEY: {song.key}</span></div>
              <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{song.title}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{song.composer}</p>
              <div className="flex flex-wrap gap-1.5 mt-6">
                {song.tags.map(tag => <span key={tag} className="text-[9px] font-black bg-white text-slate-500 px-2 py-0.5 rounded border border-slate-200 uppercase">{tag}</span>)}
              </div>
            </div>
          ))}
          {filteredSongs.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 italic font-bold">No songs found in the archives.</div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-2xl"><Music size={20} /></div>
                <h3 className="text-xl font-black tracking-tight">Archive New Song</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Song Title</label>
                <input 
                  type="text"
                  value={newSong.title}
                  onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                  placeholder="e.g. Mwalilengwa Busuma"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Musical Key</label>
                  <select 
                    value={newSong.key}
                    onChange={(e) => setNewSong({...newSong, key: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  >
                    {['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'].map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Composer / Origin</label>
                  <input 
                    type="text"
                    value={newSong.composer}
                    onChange={(e) => setNewSong({...newSong, composer: e.target.value})}
                    placeholder="Ebenezer Original"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Genre Tags (comma separated)</label>
                <input 
                  type="text"
                  value={newSong.tags}
                  onChange={(e) => setNewSong({...newSong, tags: e.target.value})}
                  placeholder="Worship, Praise, Bemba"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                />
              </div>

              <button 
                onClick={handleAddSong}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>Archive Song</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicDept;
