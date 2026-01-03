
import { 
  Member, 
  FinancialRecord, 
  Song, 
  DisciplinaryCase, 
  AttendanceRecord, 
  MemberContribution, 
  TeamEvent, 
  Announcement,
  SubscriptionRecord,
  HarvestRecord,
  ConcertFinance,
  TeamProject,
  ProjectTransaction,
  MeetingMinutes,
  GroupRule,
  CommitteeMember
} from './types.ts';

export const CELL_GROUPS = [
  'Kasaka', 'Kawimbe', 'Lubwa', 'Kashinda', 'Kambole', 
  'Senga', 'Mbereshi', 'Mwandi', 'Niamukolo', 'Mwenzo', 'Chipembi'
];

export const MOCK_COMMITTEE: CommitteeMember[] = [];
export const MOCK_RULES: GroupRule[] = [];
export const MOCK_MINUTES: MeetingMinutes[] = [];
export const MOCK_PROJECTS: TeamProject[] = [];
export const MOCK_PROJECT_TRANSACTIONS: ProjectTransaction[] = [];
export const MOCK_MEMBERS: Member[] = [];
export const MOCK_FINANCE: FinancialRecord[] = [];
export const MOCK_SUBSCRIPTIONS: SubscriptionRecord[] = [];
export const MOCK_HARVESTS: HarvestRecord[] = [];
export const MOCK_MEMBER_CONTRIBUTIONS: MemberContribution[] = [];
export const MOCK_ATTENDANCE: AttendanceRecord[] = [];
export const MOCK_SONGS: Song[] = [];
export const MOCK_EVENTS: TeamEvent[] = [];
export const MOCK_ANNOUNCEMENTS: Announcement[] = [];
export const MOCK_DISCIPLINARY: DisciplinaryCase[] = [];
export const MOCK_CONCERTS: ConcertFinance[] = [];
