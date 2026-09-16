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

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-101',
    title: 'Registration Open: Sindh Youth Assembly Summit 2026 at Karachi',
    content: 'The National Youth Parliament Sindh announces the grand opening of delegate registrations for the annual Sindh Youth Assembly Summit 2026. Young leaders, students, and advocates across all 30 districts of Sindh are invited to submit their parliamentary policy papers and register for provincial caucuses.',
    publishedAt: '2026-09-15',
    bannerUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
    isActive: true
  },
  {
    id: 'ann-102',
    title: 'Hyderabad Divisional Executive Body Convened for Youth Development Drive',
    content: 'A high-level divisional cabinet meeting was successfully chaired in Hyderabad to review grassroots civic advocacy projects, district secretariat appointments, and youth leadership training sessions across Hyderabad, Jamshoro, Thatta, and Badin.',
    publishedAt: '2026-09-10',
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    isActive: true
  },
  {
    id: 'ann-103',
    title: 'NYP Sindh Launches Provincial Climate & SDG Action Program in Sukkur',
    content: 'Youth parliamentarians in Sukkur Division initiated a landmark environmental sustainability and climate adaptation initiative. The program brings together youth ambassadors from Sukkur, Ghotki, and Khairpur to address Indus basin climate challenges.',
    publishedAt: '2026-09-02',
    bannerUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=1200',
    isActive: true
  }
];

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
