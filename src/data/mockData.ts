import { CabinetMember, Announcement, LeadershipMessage, WorkingGoal, MemberProfile } from '../types';

export const INITIAL_LEADERSHIP_MESSAGES: LeadershipMessage[] = [
  {
    id: 'msg-president',
    title: "PRESIDENTIAL MESSAGE",
    leaderName: "ABDUL REHMAN HALEPOTO",
    leaderTitle: "President, National Youth Parliament Sindh",
    subtitle: "Youth Leading Future",
    messageText: `It is a privilege to lead the National Youth Parliament Sindh with a firm belief that the future of our province depends on the ideas, courage and participation of its young people.\n\nOur youth must be more than observers of change, they must become its architects. NYP Sindh is committed to providing young people with a platform where they can discuss, debate, lead, and transform ideas into meaningful action. We aim to promote responsible leadership, democratic values, education, social inclusion, innovation and community service across Sindh.\n\nI believe leadership is not defined by a position, it is defined by the positive difference we create for others. Every young person has the potential to contribute and when that potential is given direction and opportunity, it can shape a stronger society.\n\nOur message is simple: believe in your voice, take responsibility, serve your community, and have the courage to lead. Together we can build a progressive, inclusive and empowered Sindh led by its youth.`,
    photoUrl: "/nyp-president.png"
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

export const INITIAL_CABINET_MEMBERS: CabinetMember[] = [];

export const INITIAL_MEMBER_PROFILES: MemberProfile[] = [];

export const INITIAL_WORKING_GOALS: WorkingGoal[] = [
  {
    id: 'goal-1',
    title: 'Constitutional & Legislative Literacy',
    description: 'Educating youth on parliamentary rules, assembly procedures, resolution drafting, and democratic accountability.',
    category: 'Parliamentary Education'
  },
  {
    id: 'goal-2',
    title: '3-Tier Grassroots Representation',
    description: 'Structuring active youth committees across Provincial, Divisional, District, and Taluka levels throughout Sindh.',
    category: 'Civic Governance'
  },
  {
    id: 'goal-3',
    title: 'Market-Relevant Skill Building',
    description: 'Promoting IT innovation, public speaking, research analysis, SDGs advocacy, and women empowerment.',
    category: 'Youth Empowerment'
  }
];
