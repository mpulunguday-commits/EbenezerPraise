
import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, Terminal, ShieldAlert, Zap } from 'lucide-react';

const SupabaseSetup: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- EBENEZER PRAISE TEAM MANAGEMENT SYSTEM - DATABASE INITIALIZATION
-- Run this in your Supabase SQL Editor: https://pmlrhmkybhbgknuuuwee.supabase.co

-- 1. Personnel & Auth
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  "voicePart" TEXT,
  "cellGroup" TEXT,
  "phoneNumber" TEXT,
  "dateOfBirth" TEXT,
  status TEXT DEFAULT 'Active',
  "joinedDate" TEXT,
  photo TEXT,
  username TEXT UNIQUE,
  password TEXT
);

-- 2. Financial Ledger
CREATE TABLE IF NOT EXISTS finance_records (
  id TEXT PRIMARY KEY,
  date TEXT,
  type TEXT CHECK (type IN ('Income', 'Expense')),
  category TEXT,
  amount NUMERIC DEFAULT 0,
  description TEXT
);

-- 3. Monthly Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  "memberId" TEXT REFERENCES members(id) ON DELETE CASCADE,
  "memberName" TEXT,
  month TEXT,
  "amountPaid" NUMERIC DEFAULT 0,
  status TEXT CHECK (status IN ('Paid', 'Partial', 'Unpaid'))
);

-- 4. Harvest Assessments
CREATE TABLE IF NOT EXISTS harvest_records (
  id TEXT PRIMARY KEY,
  "memberId" TEXT REFERENCES members(id) ON DELETE CASCADE,
  "memberName" TEXT,
  "assessmentAmount" NUMERIC DEFAULT 0,
  "amountPaid" NUMERIC DEFAULT 0,
  status TEXT CHECK (status IN ('Met', 'Pending'))
);

-- 5. Individual Contributions
CREATE TABLE IF NOT EXISTS member_contributions (
  id TEXT PRIMARY KEY,
  "memberId" TEXT REFERENCES members(id) ON DELETE CASCADE,
  "memberName" TEXT,
  amount NUMERIC DEFAULT 0,
  date TEXT,
  type TEXT
);

-- 6. Disciplinary Oversight
CREATE TABLE IF NOT EXISTS disciplinary_cases (
  id TEXT PRIMARY KEY,
  "memberId" TEXT REFERENCES members(id) ON DELETE CASCADE,
  "memberName" TEXT,
  date TEXT,
  issue TEXT,
  resolution TEXT,
  status TEXT DEFAULT 'Open',
  "fineAmount" NUMERIC DEFAULT 0,
  "finePaid" NUMERIC DEFAULT 0
);

-- 7. Governance Rules
CREATE TABLE IF NOT EXISTS group_rules (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  category TEXT,
  "effectiveDate" TEXT,
  "fileName" TEXT
);

-- 8. Secretariat Minutes
CREATE TABLE IF NOT EXISTS meeting_minutes (
  id TEXT PRIMARY KEY,
  date TEXT,
  title TEXT,
  category TEXT,
  attendees TEXT[],
  content TEXT,
  "fileName" TEXT,
  "fileData" TEXT
);

-- 9. Attendance Register
CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  "memberId" TEXT REFERENCES members(id) ON DELETE CASCADE,
  "memberName" TEXT,
  date TEXT,
  status TEXT CHECK (status IN ('Present', 'Absent', 'Late', 'Excused'))
);

-- 10. Music Library
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  title TEXT,
  key TEXT,
  composer TEXT,
  tags TEXT[]
);

-- 11. Calendar Events
CREATE TABLE IF NOT EXISTS team_events (
  id TEXT PRIMARY KEY,
  title TEXT,
  date TEXT,
  time TEXT,
  location TEXT,
  author TEXT,
  type TEXT
);

-- 12. Broadcast Board
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  date TEXT,
  author TEXT,
  priority TEXT DEFAULT 'Normal'
);

-- 13. Executive Committee
CREATE TABLE IF NOT EXISTS committee_members (
  id TEXT PRIMARY KEY,
  "memberId" TEXT REFERENCES members(id) ON DELETE CASCADE,
  name TEXT,
  "committeeRole" TEXT,
  "appointedDate" TEXT
);

-- 14. Income Generating Projects
CREATE TABLE IF NOT EXISTS team_projects (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  description TEXT,
  status TEXT DEFAULT 'Active',
  "totalRevenue" NUMERIC DEFAULT 0,
  "totalExpenses" NUMERIC DEFAULT 0,
  "lastUpdate" TEXT
);

-- 15. Project Transactions
CREATE TABLE IF NOT EXISTS project_transactions (
  id TEXT PRIMARY KEY,
  "projectId" TEXT REFERENCES team_projects(id) ON DELETE CASCADE,
  date TEXT,
  type TEXT,
  amount NUMERIC DEFAULT 0,
  description TEXT
);

-- 16. Concert P&L
CREATE TABLE IF NOT EXISTS concert_finances (
  id TEXT PRIMARY KEY,
  "concertName" TEXT,
  type TEXT,
  date TEXT,
  budget NUMERIC DEFAULT 0,
  "actualIncome" NUMERIC DEFAULT 0,
  "actualExpense" NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Planning'
);

-- 17. Uniforms & Wardrobe
CREATE TABLE IF NOT EXISTS uniforms (
  id TEXT PRIMARY KEY,
  "memberId" TEXT REFERENCES members(id) ON DELETE CASCADE,
  "memberName" TEXT,
  "itemName" TEXT,
  size TEXT,
  "issuedDate" TEXT,
  status TEXT DEFAULT 'Issued'
);

-- 18. Team Equipment Assets
CREATE TABLE IF NOT EXISTS equipment (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  condition TEXT,
  "lastServiceDate" TEXT
);

-- SEED DATA
INSERT INTO members (id, name, role, "voicePart", "cellGroup", "phoneNumber", "dateOfBirth", status, "joinedDate", username, password)
VALUES ('m1', 'Super Admin', 'Team Leader', 'Tenor', 'Central', '+260970000001', '1990-01-01', 'Active', '2020-01-01', 'admin', 'admin123')
ON CONFLICT (id) DO NOTHING;

INSERT INTO songs (id, title, key, composer, tags)
VALUES 
('s1', 'Mwalilengwa Busuma', 'G', 'Traditional Bemba', ARRAY['Worship', 'Bemba']),
('s2', 'Ebenezer (Hitherto)', 'C', 'Praise Team Original', ARRAY['Praise', 'Theme']),
('s3', 'Nshila sha kwa Lesa', 'D', 'Traditional', ARRAY['Worship']),
('s4', 'Ubushiku bwa kwa Lesa', 'F', 'Modern', ARRAY['Praise', 'Joyful'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO group_rules (id, title, description, category, "effectiveDate")
VALUES ('r1', 'Punctuality Standard', 'All members must arrive 15 minutes before rehearsal starts. Late arrival attracts a K5 fine.', 'Punctuality', '2024-01-01')
ON CONFLICT (id) DO NOTHING;
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-4xl w-full space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-500/20 mb-4 animate-bounce">
            <Database size={48} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-tight">Database Fix Required</h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
            Your Supabase project is active, but the tables haven't been created yet. Run the script below in your Supabase SQL Editor to initialize the system.
          </p>
        </div>

        <div className="bg-slate-800 rounded-[2.5rem] border border-slate-700 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700 rounded-lg"><Terminal size={18} className="text-blue-400" /></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-100">Fix Script (SQL)</h3>
            </div>
            <button 
              onClick={handleCopy}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                copied ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy Fix Script'}</span>
            </button>
          </div>
          <div className="p-8">
            <div className="bg-slate-950 rounded-2xl p-6 font-mono text-xs overflow-auto max-h-[350px] border border-slate-900 custom-scrollbar whitespace-pre text-blue-300">
              {sqlSchema}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-[2rem] flex flex-col items-center text-center space-y-3">
             <div className="p-3 bg-slate-700 rounded-xl text-blue-400"><Copy size={20} /></div>
             <p className="text-[10px] font-black uppercase tracking-widest">1. Copy Script</p>
             <p className="text-[11px] text-slate-400 font-medium">Click the button above to copy the full SQL script.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-[2rem] flex flex-col items-center text-center space-y-3">
             <div className="p-3 bg-slate-700 rounded-xl text-amber-400"><ExternalLink size={20} /></div>
             <p className="text-[10px] font-black uppercase tracking-widest">2. Open Supabase</p>
             <p className="text-[11px] text-slate-400 font-medium">Open the SQL Editor in your dashboard (link below).</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-[2rem] flex flex-col items-center text-center space-y-3">
             <div className="p-3 bg-slate-700 rounded-xl text-green-400"><Zap size={20} /></div>
             <p className="text-[10px] font-black uppercase tracking-widest">3. Run & Refresh</p>
             <p className="text-[11px] text-slate-400 font-medium">Paste the script, click RUN, and then refresh this app.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://supabase.com/dashboard/project/pmlrhmkybhbgknuuuwee/sql/new" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-[1.5rem] flex items-center justify-center space-x-4 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-900/40 w-full sm:w-auto"
          >
            <div className="text-right">
              <h4 className="text-lg font-black uppercase leading-tight">Go to SQL Editor</h4>
              <p className="text-[10px] font-bold text-blue-100 opacity-70">Project: pmlrhmkybhbgknuuuwee</p>
            </div>
            <ExternalLink size={24} />
          </a>
          
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] border border-white/10 font-black text-xs uppercase tracking-[0.2em] transition-all w-full sm:w-auto"
          >
            I have run the script
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup;
