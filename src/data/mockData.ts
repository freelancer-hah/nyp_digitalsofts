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
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

export const INITIAL_CABINET_MEMBERS: CabinetMember[] = [
  {
    id: 'cab-president-sindh',
    fullName: 'ABDUL REHMAN HALEPOTO',
    designation: 'President NYP Sindh',
    cabinetLevel: 'PROVINCIAL',
    photoUrl: '/nyp-president.png',
    bio: 'Executive Head leading provincial youth policy, parliamentary education, and democratic empowerment across Sindh Province.',
    displayOrder: 1,
    isActive: true,
    category: 'CABINET'
  },
  {
    id: 'parl-cm',
    fullName: 'SYED MUNIR CHANDIO',
    designation: 'Youth Chief Minister (CM)',
    cabinetLevel: 'PROVINCIAL',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bio: 'Leading the Youth Provincial Government of Sindh and driving youth legislation and parliamentary affairs.',
    displayOrder: 2,
    isActive: true,
    category: 'PARLIAMENTARIAN',
    parliamentaryRole: 'CHIEF_MINISTER'
  },
  {
    id: 'parl-speaker',
    fullName: 'ZAINAB FATIMA',
    designation: 'Speaker Youth Provincial Assembly',
    cabinetLevel: 'PROVINCIAL',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    bio: 'Presiding officer maintaining decorum and procedure in the Youth Provincial Assembly of Sindh.',
    displayOrder: 3,
    isActive: true,
    category: 'PARLIAMENTARIAN',
    parliamentaryRole: 'SPEAKER'
  },
  {
    id: 'parl-deputy-speaker',
    fullName: 'AHMED KHAN SANGHANG',
    designation: 'Deputy Speaker Youth Assembly',
    cabinetLevel: 'PROVINCIAL',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    bio: 'Assisting parliamentary proceedings and legislative debate management.',
    displayOrder: 4,
    isActive: true,
    category: 'PARLIAMENTARIAN',
    parliamentaryRole: 'DEPUTY_SPEAKER'
  },
  {
    id: 'parl-opp-leader',
    fullName: 'SHAHZAIB ALI LEGHARI',
    designation: 'Leader of Opposition',
    cabinetLevel: 'PROVINCIAL',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    bio: 'Leading democratic scrutiny, parliamentary debate, and constructive opposition policies.',
    displayOrder: 5,
    isActive: true,
    category: 'PARLIAMENTARIAN',
    parliamentaryRole: 'OPPOSITION_LEADER'
  },
  {
    id: 'parl-minister-it',
    fullName: 'TARIQ HUSSAIN SHAH',
    designation: 'Youth Provincial Minister',
    cabinetLevel: 'PROVINCIAL',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    bio: 'Pioneering digital innovation, IT training, and e-governance initiatives across Sindh.',
    displayOrder: 6,
    isActive: true,
    category: 'PARLIAMENTARIAN',
    parliamentaryRole: 'MINISTER',
    ministryDepartment: 'IT & Digital Innovation'
  }
];

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

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media-1',
    title: 'Sindh Youth Leadership Convention 2026',
    description: 'Grand youth leadership assembly bringing together over 500 delegates from all 6 divisions of Sindh at Karachi Assembly Hall.',
    category: 'Youth Summit',
    mediaType: 'IMAGE',
    mediaUrl: '/nyp-youth-summit.jpg',
    eventDate: '12 Sep 2026',
    location: 'Karachi, Sindh'
  },
  {
    id: 'media-2',
    title: 'Youth Parliamentary Simulation & Legislative Caucus',
    description: 'Debating model parliamentary resolutions on climate action, education, and digital governance in Sindh Assembly.',
    category: 'Assembly Session',
    mediaType: 'VIDEO',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
    eventDate: '28 Aug 2026',
    location: 'Sindh Assembly Hall'
  },
  {
    id: 'media-3',
    title: 'Hyderabad Divisional Youth Leadership Meetup',
    description: 'Divisional cabinet meeting and youth empowerment workshop held at Royal Taj Hyderabad.',
    category: 'Divisional Meetup',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1000',
    eventDate: '05 Sep 2026',
    location: 'Hyderabad, Sindh'
  },
  {
    id: 'media-4',
    title: 'Sukkur Divisional Coordination & SDG Workshop',
    description: 'Engaging youth leaders on sustainable development goals and local governance participation.',
    category: 'Divisional Meetup',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000',
    eventDate: '18 Aug 2026',
    location: 'Sukkur, Sindh'
  },
  {
    id: 'media-5',
    title: 'Defence Day Youth Tribute Caucus',
    description: 'Special parliamentary caucus paying tribute to national heroes and national unity across Sindh.',
    category: 'Community Outreach',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=1000',
    eventDate: '06 Sep 2026',
    location: 'Larkana & Mirpurkhas'
  },
  {
    id: 'media-6',
    title: 'IT & Digital Skills Innovation Bootcamp',
    description: 'Empowering Sindh youth with digital skills, coding, e-commerce, and modern technology frameworks.',
    category: 'Youth Summit',
    mediaType: 'VIDEO',
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000',
    eventDate: '10 Aug 2026',
    location: 'Shaheed Benazirabad'
  }
];

