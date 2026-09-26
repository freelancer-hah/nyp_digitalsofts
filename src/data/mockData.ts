import { CabinetMember, Announcement, LeadershipMessage, WorkingGoal, MemberProfile, MediaItem } from '../types';

export const INITIAL_LEADERSHIP_MESSAGES: LeadershipMessage[] = [
  {
    id: 'msg-president',
    title: "PRESIDENTIAL MESSAGE",
    leaderName: "ABDUL REHMAN HALEPOTO",
    leaderTitle: "President, National Youth Parliament Sindh",
    subtitle: "Youth Leading Future",
    messageText: `It is a privilege to lead the National Youth Parliament Sindh with a firm belief that the future of our province depends on the ideas, courage and participation of its young people.\n\nOur youth must be more than observers of change, they must become its architects. NYP Sindh is committed to providing young people with a platform where they can discuss, debate, lead, and transform ideas into meaningful action. We aim to promote responsible leadership, democratic values, education, social inclusion, innovation and community service across Sindh.\n\nI believe leadership is not defined by a position, it is defined by the positive difference we create for others. Every young person has the potential to contribute and when that potential is given direction and opportunity, it can shape a stronger society.\n\nOur message is simple: believe in your voice, take responsibility, serve your community, and have the courage to lead. Together we can build a progressive, inclusive and empowered Sindh led by its youth.`,
    photoUrl: "/nyp-president.png"
  },
  {
    id: 'msg-chairman',
    title: "CHAIRMAN'S MESSAGE",
    leaderName: "ABDUL MUIZ LAKHO",
    leaderTitle: "Chairman, NYP Sindh",
    subtitle: "Voice of Youth, Force for Change",
    messageText: `National Youth Parliament Sindh stands as a voice of youth, a platform of leadership, and a force for change. We believe leadership is earned through responsibility, discipline, service, and action.\n\nOur commitment is clear: to unite the youth, strengthen leadership, serve society, and build a stronger Sindh and a stronger Pakistan. We do not follow the future; we prepare the leaders who will shape it.`,
    photoUrl: "/nyp-chairman.png"
  },
  {
    id: 'msg-general-secretary',
    title: "GENERAL SECRETARY'S MESSAGE",
    leaderName: "RAO HUMAYUN FARRUKH",
    leaderTitle: "General Secretary, NYP Sindh",
    subtitle: "Empowering Youth, Shaping Future",
    messageText: `Empowering youth, strengthening democracy, Stronger leadership. A better tomorrow. Together, we are building a generation that is ready to lead, serve, and shape the future of Sindh and Pakistan.\n\nAt National Youth Parliament Sindh, our mission is to translate youth energy and intellect into practical policy, civic advocacy, and transformative action. We strive to provide equal opportunities for youth across every division and district of Sindh to develop legislative knowledge, ethical leadership, and democratic stewardship.`,
    photoUrl: "/nyp-general-secretary.png"
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

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [];


