
import React, { useState } from 'react';
import { TeamEvent, Announcement, UserRole } from '../types.ts';
import { 
  Plus, Calendar, Megaphone, Trash2, BellRing, X, Save, Edit3, Clock, MapPin, Tag, AlertCircle, Info
} from 'lucide-react';

interface EventsNewsProps {
  currentRole: UserRole;
  events: TeamEvent[];
  setEvents: React.Dispatch<React.SetStateAction<TeamEvent[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  onDeleteEvent: (id: string) => void;
  onDeleteAnnouncement: (id: string) => void;
}

const EventsNews: React.FC<EventsNewsProps> = ({ currentRole, events, setEvents, announcements, setAnnouncements, onDeleteEvent, onDeleteAnnouncement }) => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    date: new Date().toISOString().split('T')[0], 
    time: '17:30', 
    location: 'UCZ Church Hall', 
    type: 'Rehearsal' as TeamEvent['type'] 
  });
  
  const [newAnn, setNewAnn] = useState({ 
    title: '', 
    content: '', 
    priority: 'Normal' as Announcement['priority'] 
  });

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    if (editingEventId) {
      setEvents(prev => prev.map(e => e.id === editingEventId ? { ...e, ...newEvent } : e));
    } else {
      setEvents(prev => [{ id: Math.random().toString(36).substr(2, 9), ...newEvent, author: currentRole }, ...prev]);
    }
    setIsEventModalOpen(false);
    setEditingEventId(null);
    setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], time: '17:30', location: 'UCZ Church Hall', type: 'Rehearsal' });
  };

  const handleSaveAnnouncement = () => {
    if (!newAnn.title || !newAnn.content) return;
    if (editingAnnId) {
      setAnnouncements(prev => prev.map(a => a.id === editingAnnId ? { ...a, ...newAnn } : a));
    } else {
      setAnnouncements(prev => [{ id: Math.random().toString(36).substr(2, 9), ...newAnn, date: new Date().toLocaleDateString(), author: currentRole }, ...prev]);
    }
    setIsAnnModalOpen(false);
    setEditingAnnId(null);
    setNewAnn({ title: '', content: '', priority: 'Normal' });
  };

  const openEditEvent = (event: TeamEvent) => {
    setEditingEventId(event.id);
    setNewEvent({ title: event.title, date: event.date, time: event.time, location: event.location, type: event.type });
    setIsEventModalOpen(true);
  };

  const openEditAnn = (ann: Announcement) => {
    setEditingAnnId(ann.id);
    setNewAnn({ title: ann.title, content: ann.content, priority: ann.priority });
    setIsAnnModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Timeline & Notices</h2>
          <p className="text-slate-500 text-sm font-medium">Broadcast news and schedule team activities.</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsAnnModalOpen(true)} 
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl active:scale-95 transition-all"
          >
            <Megaphone size={18} />
            <span>Post News</span>
          </button>
          <button 
            onClick={() => setIsEventModalOpen(true)} 
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Schedule Side */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar size={16} />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Team Schedule</h3>
          </div>
          
          <div className="space-y-4">
            {events.length > 0 ? events.map(event => (
              <div key={event.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-6 right-6 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditEvent(event)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                  <button onClick={() => onDeleteEvent(event.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${
                    event.type === 'Concert' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                    event.type === 'Rehearsal' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {event.type}
                  </span>
                  <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <Clock size={10} className="mr-1" />
                    {event.time}
                  </div>
                </div>
                <h4 className="text-xl font-black text-slate-900 leading-tight">{event.title}</h4>
                <div className="flex items-center mt-3 text-xs font-bold text-slate-500">
                  <MapPin size={12} className="mr-1.5 text-slate-400" />
                  {event.location}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  <span>{new Date(event.date).toLocaleDateString('en-ZM', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                  <span className="group-hover:text-blue-400 transition-colors">Confirmed</span>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold italic text-sm">No scheduled activities found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Announcements Side */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Megaphone size={16} />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Broadcast Board</h3>
          </div>

          <div className="space-y-4">
            {announcements.length > 0 ? announcements.map(ann => (
              <div key={ann.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                <div className="absolute top-8 right-8 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditAnn(ann)} className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 size={16} /></button>
                  <button onClick={() => onDeleteAnnouncement(ann.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  {ann.priority === 'Urgent' && <span className="flex items-center space-x-1 bg-red-50 text-red-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase border border-red-100"><AlertCircle size={10} /><span>Urgent</span></span>}
                  <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{ann.date}</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 leading-tight mb-3">{ann.title}</h4>
                <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic">
                  "{ann.content}"
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-[8px]">
                      {ann.author.charAt(0)}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Office of the {ann.author}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <BellRing size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold italic text-sm">The broadcast board is empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><Calendar size={20} /></div>
                <h3 className="text-xl font-black tracking-tight uppercase">{editingEventId ? 'Edit Schedule' : 'Schedule Activity'}</h3>
              </div>
              <button onClick={() => { setIsEventModalOpen(false); setEditingEventId(null); }} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Activity Label</label>
                <input 
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g. Choir Rehearsal"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Event Date</label>
                  <input 
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Time</label>
                  <input 
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Location</label>
                  <input 
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Venue..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Type</label>
                  <select 
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  >
                    <option value="Rehearsal">Rehearsal</option>
                    <option value="Service">Church Service</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Outreach">Outreach</option>
                    <option value="Concert">Concert</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleSaveEvent}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>{editingEventId ? 'Commit Changes' : 'Synchronize Schedule'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg"><Megaphone size={20} /></div>
                <h3 className="text-xl font-black tracking-tight uppercase">{editingAnnId ? 'Edit Broadcast' : 'Dispatch News'}</h3>
              </div>
              <button onClick={() => { setIsAnnModalOpen(false); setEditingAnnId(null); }} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Broadcast Title</label>
                <input 
                  type="text"
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({...newAnn, title: e.target.value})}
                  placeholder="Subject of notice..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Priority Level</label>
                <div className="flex space-x-2">
                  {['Normal', 'Urgent'].map(p => (
                    <button 
                      key={p}
                      onClick={() => setNewAnn({...newAnn, priority: p as any})}
                      className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                        newAnn.priority === p ? (p === 'Urgent' ? 'bg-red-50 border-red-200 text-red-600 shadow-inner' : 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-inner') : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Content / Message</label>
                <textarea 
                  value={newAnn.content}
                  onChange={(e) => setNewAnn({...newAnn, content: e.target.value})}
                  rows={4}
                  placeholder="Compose your message here..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none italic"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl flex items-start space-x-3 border border-blue-100">
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-tight">
                  Dispatched notices are visible to all personnel portals. Ensure content matches team standards.
                </p>
              </div>

              <button 
                onClick={handleSaveAnnouncement}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>{editingAnnId ? 'Commit Changes' : 'Broadcast Message'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsNews;
