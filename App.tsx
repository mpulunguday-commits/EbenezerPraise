
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './views/Dashboard.tsx';
import Membership from './views/Membership.tsx';
import Finance from './views/Finance.tsx';
import MusicDept from './views/MusicDept.tsx';
import Attendance from './views/Attendance.tsx';
import EventsNews from './views/EventsNews.tsx';
import MemberFinances from './views/MemberFinances.tsx';
import Subscriptions from './views/Subscriptions.tsx';
import HarvestAssessments from './views/HarvestAssessments.tsx';
import ConcertFinances from './views/ConcertFinances.tsx';
import Disciplinary from './views/Disciplinary.tsx';
import Projects from './views/Projects.tsx';
import Minutes from './views/Minutes.tsx';
import PortalSelector from './views/PortalSelector.tsx';
import Landing from './views/Landing.tsx';
import Profile from './views/Profile.tsx';
import SupabaseSetup from './views/SupabaseSetup.tsx';
import { UserRole, Member, FinancialRecord, SubscriptionRecord, HarvestRecord, MemberContribution, DisciplinaryCase, GroupRule, MeetingMinutes, AttendanceRecord, Song, TeamEvent, Announcement, CommitteeMember, TeamProject, ProjectTransaction, ConcertFinance } from './types.ts';
import { 
  MOCK_MEMBERS, 
  MOCK_FINANCE, 
  MOCK_SUBSCRIPTIONS, 
  MOCK_HARVESTS, 
  MOCK_MEMBER_CONTRIBUTIONS, 
  MOCK_DISCIPLINARY, 
  MOCK_RULES, 
  MOCK_MINUTES,
  MOCK_ATTENDANCE,
  MOCK_SONGS,
  MOCK_EVENTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_COMMITTEE,
  MOCK_PROJECTS,
  MOCK_PROJECT_TRANSACTIONS,
  MOCK_CONCERTS
} from './constants.tsx';
import { Bell, Settings, LogOut, ShieldCheck, X, Menu, Save, Check } from 'lucide-react';
import { db } from './dbService.ts';

interface AppProps {
  onBooted?: () => void;
}

const App: React.FC<AppProps> = ({ onBooted }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [targetMemberIdForFinance, setTargetMemberIdForFinance] = useState<string | null>(null);
  
  // App Boot State
  const [needsSetup, setNeedsSetup] = useState(false);

  // Central States
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [generalFinance, setGeneralFinance] = useState<FinancialRecord[]>(MOCK_FINANCE);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(MOCK_SUBSCRIPTIONS);
  const [harvests, setHarvests] = useState<HarvestRecord[]>(MOCK_HARVESTS);
  const [contributions, setContributions] = useState<MemberContribution[]>(MOCK_MEMBER_CONTRIBUTIONS);
  const [disciplinaryCases, setDisciplinaryCases] = useState<DisciplinaryCase[]>(MOCK_DISCIPLINARY);
  const [rules, setRules] = useState<GroupRule[]>(MOCK_RULES);
  const [minutes, setMinutes] = useState<MeetingMinutes[]>(MOCK_MINUTES);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
  const [events, setEvents] = useState<TeamEvent[]>(MOCK_EVENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>(MOCK_COMMITTEE);
  const [projects, setProjects] = useState<TeamProject[]>(MOCK_PROJECTS);
  const [projectTransactions, setProjectTransactions] = useState<ProjectTransaction[]>(MOCK_PROJECT_TRANSACTIONS);
  const [concerts, setConcerts] = useState<ConcertFinance[]>(MOCK_CONCERTS);

  const currentMember = currentUser?.member_id 
    ? members.find(m => m.id === currentUser.member_id) 
    : null;

  useLayoutEffect(() => {
    if (onBooted) onBooted();
  }, [onBooted]);

  // Initial Supabase Data Load
  useEffect(() => {
    const initData = async () => {
      try {
        const fetchTable = async (table: string, setter: Function) => {
          const data = await db.fetchAll(table);
          if (data && data.length > 0) setter(data);
        };

        // If fetchAll for 'members' fails with schema missing, we trigger setup
        await Promise.all([
          fetchTable('members', setMembers),
          fetchTable('finance_records', setGeneralFinance),
          fetchTable('subscriptions', setSubscriptions),
          fetchTable('harvest_records', setHarvests),
          fetchTable('member_contributions', setContributions),
          fetchTable('disciplinary_cases', setDisciplinaryCases),
          fetchTable('group_rules', setRules),
          fetchTable('meeting_minutes', setMinutes),
          fetchTable('attendance_records', setAttendanceRecords),
          fetchTable('songs', setSongs),
          fetchTable('team_events', setEvents),
          fetchTable('announcements', setAnnouncements),
          fetchTable('committee_members', setCommitteeMembers),
          fetchTable('team_projects', setProjects),
          fetchTable('project_transactions', setProjectTransactions),
          fetchTable('concert_finances', setConcerts)
        ]);
      } catch (err: any) {
        if (err.message?.includes('SCHEMA_MISSING')) {
          setNeedsSetup(true);
        }
      }
    };
    initData();
  }, []);

  // Universal Supabase Sync Hook (Auto-save)
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current || needsSetup) {
      isFirstRun.current = false;
      return;
    }
    const syncToRemote = async () => {
      const tables = [
        { name: 'members', data: members },
        { name: 'finance_records', data: generalFinance },
        { name: 'team_events', data: events },
        { name: 'announcements', data: announcements },
        { name: 'member_contributions', data: contributions },
        { name: 'attendance_records', data: attendanceRecords },
        { name: 'disciplinary_cases', data: disciplinaryCases },
        { name: 'songs', data: songs },
        { name: 'meeting_minutes', data: minutes },
        { name: 'harvest_records', data: harvests },
        { name: 'subscriptions', data: subscriptions },
        { name: 'group_rules', data: rules },
        { name: 'committee_members', data: committeeMembers },
        { name: 'team_projects', data: projects },
        { name: 'project_transactions', data: projectTransactions },
        { name: 'concert_finances', data: concerts }
      ];

      for (const t of tables) {
        db.upsert(t.name, t.data);
      }
    };
    
    const debounceTimer = setTimeout(syncToRemote, 1000);
    return () => clearTimeout(debounceTimer);
  }, [members, generalFinance, events, announcements, contributions, attendanceRecords, disciplinaryCases, songs, minutes, harvests, subscriptions, rules, committeeMembers, projects, projectTransactions, concerts, needsSetup]);

  // Deletion Helper
  const createDeleteHandler = (table: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    return async (id: string) => {
      setter(prev => prev.filter(item => item.id !== id));
      if (!needsSetup) db.delete(table, id);
    };
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
    setTargetMemberIdForFinance(null);
    setIsSidebarOpen(false);
  };

  const handleLoginSuccess = (role: UserRole, user: any) => {
    setCurrentRole(role);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    if (role === UserRole.MEMBER && user.member_id) {
        setTargetMemberIdForFinance(user.member_id);
    }
  };

  if (needsSetup) {
    return <SupabaseSetup />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard members={members} finance={generalFinance} cases={disciplinaryCases} events={events} minutes={minutes} attendance={attendanceRecords} onNavigate={setCurrentView} currentRole={currentRole} />;
      case 'profile': return <Profile currentUser={currentUser} members={members} setMembers={setMembers} currentRole={currentRole} />;
      case 'membership': return <Membership members={members} setMembers={setMembers} currentRole={currentRole} currentUser={currentUser} onViewFinancials={(id) => { setTargetMemberIdForFinance(id); setCurrentView('member-finances'); }} onDeleteMember={createDeleteHandler('members', setMembers)} attendanceRecords={attendanceRecords} contributions={contributions} subscriptions={subscriptions} harvests={harvests} disciplinaryCases={disciplinaryCases} />;
      case 'attendance': return <Attendance members={members} currentRole={currentRole} attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} />;
      case 'events': return <EventsNews currentRole={currentRole} events={events} setEvents={setEvents} announcements={announcements} setAnnouncements={setAnnouncements} onDeleteEvent={createDeleteHandler('team_events', setEvents)} onDeleteAnnouncement={createDeleteHandler('announcements', setAnnouncements)} />;
      case 'member-finances': return <MemberFinances currentRole={currentRole} members={members} contributions={contributions} setContributions={setContributions} subscriptions={subscriptions} harvests={harvests} initialMemberId={targetMemberIdForFinance || undefined} onCloseDetail={() => setTargetMemberIdForFinance(null)} onDeleteContribution={createDeleteHandler('member_contributions', setContributions)} />;
      case 'subscriptions': return <Subscriptions members={members} subscriptions={subscriptions} setSubscriptions={setSubscriptions} currentRole={currentRole} onDeleteSubscription={createDeleteHandler('subscriptions', setSubscriptions)} />;
      case 'harvest': return <HarvestAssessments members={members} harvests={harvests} setHarvests={setHarvests} currentRole={currentRole} onDeleteHarvest={createDeleteHandler('harvest_records', setHarvests)} />;
      case 'projects': return <Projects currentRole={currentRole} projects={projects} setProjects={setProjects} transactions={projectTransactions} setTransactions={setProjectTransactions} onDeleteProject={createDeleteHandler('team_projects', setProjects)} onDeleteTransaction={createDeleteHandler('project_transactions', setProjectTransactions)} />;
      case 'concerts': return <ConcertFinances currentRole={currentRole} concerts={concerts} setConcerts={setConcerts} onDeleteConcert={createDeleteHandler('concert_finances', setConcerts)} />;
      case 'finance': return <Finance records={generalFinance} setRecords={setGeneralFinance} currentRole={currentRole} onDeleteRecord={createDeleteHandler('finance_records', setGeneralFinance)} />;
      case 'music': return <MusicDept currentRole={currentRole} songs={songs} setSongs={setSongs} onDeleteSong={createDeleteHandler('songs', setSongs)} />;
      case 'disciplinary': 
        const relevantCases = currentRole === UserRole.MEMBER && currentUser?.member_id ? disciplinaryCases.filter(c => c.memberId === currentUser.member_id) : disciplinaryCases;
        return <Disciplinary members={members} cases={relevantCases} setCases={setDisciplinaryCases} rules={rules} setRules={setRules} committeeMembers={committeeMembers} setCommitteeMembers={setCommitteeMembers} onDeleteCase={createDeleteHandler('disciplinary_cases', setDisciplinaryCases)} onDeleteRule={createDeleteHandler('group_rules', setRules)} onDeleteCommitteeMember={createDeleteHandler('committee_members', setCommitteeMembers)} currentRole={currentRole} />;
      case 'minutes': return <Minutes members={members} minutesList={minutes} setMinutesList={setMinutes} onDeleteMinutes={createDeleteHandler('meeting_minutes', setMinutes)} currentRole={currentRole} />;
      default: return <Dashboard members={members} finance={generalFinance} cases={disciplinaryCases} events={events} minutes={minutes} attendance={attendanceRecords} onNavigate={setCurrentView} currentRole={currentRole} />;
    }
  };

  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <div className="relative min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
          <button onClick={() => setShowLogin(false)} className="fixed top-6 left-6 z-[70] bg-white p-3 rounded-full shadow-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all active:scale-95 group"><X size={24} className="group-hover:rotate-90 transition-transform" /></button>
          <PortalSelector onLoginSuccess={handleLoginSuccess} members={members} setMembers={setMembers} />
        </div>
      );
    }
    return <Landing onEnterPortal={() => setShowLogin(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex animate-in fade-in duration-500">
      <Sidebar currentRole={currentRole} currentView={currentView} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onViewChange={(view) => { setTargetMemberIdForFinance(null); setCurrentView(view); setIsSidebarOpen(false); }} onLogout={handleLogout} />
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full overflow-x-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><Menu size={20} /></button>
            <button onClick={handleLogout} className="flex items-center space-x-2 bg-slate-100 hover:bg-red-600 hover:text-white px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 transition-all active:scale-95 group shrink-0"><LogOut size={14} /><span className="hidden md:inline">Sign Out</span></button>
            <div className="h-4 w-px bg-gray-200 shrink-0 hidden xs:block"></div>
            <div className="flex items-center space-x-2 px-2 py-1 rounded text-[10px] font-black uppercase shrink-0 transition-all duration-500 text-blue-500 bg-blue-50">
               <ShieldCheck size={12} />
               <span className="hidden sm:inline">Supabase Live</span>
            </div>
            <div className="h-4 w-px bg-gray-200 ml-2 shrink-0 hidden md:block"></div>
            <div className="hidden sm:block bg-gray-100 rounded-lg px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-black text-blue-600 border border-blue-100 shrink-0">{currentRole}</div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative"><Bell size={20} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span></button>
            <button onClick={() => setCurrentView('profile')} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Settings size={20} /></button>
            <div className="h-8 w-px bg-gray-200 mx-1 sm:mx-2 shrink-0"></div>
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors" onClick={() => setCurrentView('profile')}>
              <div className="text-right hidden xl:block"><p className="text-sm font-bold text-gray-900 leading-none">{currentUser?.display_name || 'Portal User'}</p><p className="text-xs text-gray-500 mt-1">Mpulungu UCZ</p></div>
              <img src={currentMember?.photo || `https://ui-avatars.com/api/?name=${currentUser?.display_name || 'User'}&background=random`} alt="Profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-blue-100 shadow-sm shrink-0 object-cover" />
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
