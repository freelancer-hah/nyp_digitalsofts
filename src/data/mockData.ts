import { CabinetMember, Announcement, LeadershipMessage, WorkingGoal, MemberProfile } from '../types';


export const INITIAL_LEADERSHIP_MESSAGES: LeadershipMessage[] = [
  {
    id: 'msg-president',
    title: "President's Message",
    leaderName: "Abdul Rehman Halepoto",
    leaderTitle: "President, National Youth Parliament (NYP) Sindh",
    messageText: "Youth are not merely the future of Pakistan; they are the active driving force of our present democratic and socio-economic transformation. NYP Sindh provides a structured, constitutional, and policy-oriented platform for young minds across all 6 divisions to engage, lead, and serve our province with integrity, vision, and patriotism.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 'msg-chairman',
    title: "Chairman's Message",
    leaderName: "Shakir Chandio",
    leaderTitle: "Management Focal Person & Chairman, NYP Sindh",
    messageText: "Empowering the youth of Sindh through digital literacy, parliamentary training, and grassroots community leadership is our primary operational focus. We welcome passionate youth from Karachi to Kashmore to join our provincial assembly initiatives.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: "Official Launch of NYP Sindh Digital Membership Portal 2026",
    content: "The National Youth Parliament Sindh has officially launched its online CNIC-based membership portal nypsindh.org.pk. Youth applicants across Karachi, Hyderabad, Sukkur, Larkana, Mirpurkhas, and Shaheed Benazirabad are invited to apply for provincial and divisional assembly roles.",
    publishedAt: "2026-09-10",
    bannerUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800",
    isActive: true
  },
  {
    id: 'ann-2',
    title: "Upcoming Sindh Youth Parliamentary Leadership Summit in Karachi",
    content: "Registrations are now open for the Annual Youth Parliamentary Summit 2026 focusing on Climate Action, SDGs, and Parliamentary Bill Drafting. Approved members will receive physical delegate passes.",
    publishedAt: "2026-09-05",
    bannerUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    isActive: true
  },
  {
    id: 'ann-3',
    title: "Induction of Youth MPAs for Hyderabad & Sukkur Divisions",
    content: "The Central Cabinet has initiated the verification and designation process for Youth Members of Provincial Assembly (Youth MPAs) representing regional constituencies in Sindh.",
    publishedAt: "2026-08-28",
    bannerUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800",
    isActive: true
  }
];

export const INITIAL_CABINET_MEMBERS: CabinetMember[] = [
  {
    id: 'cab-1',
    fullName: "Abdul Rehman Halepoto",
    designation: "President NYP Sindh",
    cabinetLevel: "PROVINCIAL",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    bio: "Executive Head leading provincial youth policy & legislative education.",
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'cab-2',
    fullName: "Shakir Chandio",
    designation: "Chairman & Management Focal Person",
    cabinetLevel: "PROVINCIAL",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    bio: "Overseeing provincial operations, member verification, and regional outreach.",
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'cab-3',
    fullName: "Syed Muhammad Ali",
    designation: "Vice President NYP Sindh",
    cabinetLevel: "PROVINCIAL",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    bio: "Coordinating youth parliamentary caucuses and SDGs initiatives.",
    displayOrder: 3,
    isActive: true
  },
  {
    id: 'cab-4',
    fullName: "Zainab Shah",
    designation: "Secretary General",
    cabinetLevel: "PROVINCIAL",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    bio: "Managing administrative protocols, cabinet records, and public communications.",
    displayOrder: 4,
    isActive: true
  },
  {
    id: 'cab-5',
    fullName: "Tariq Mahmood",
    designation: "Divisional President - Karachi Division",
    cabinetLevel: "DIVISIONAL",
    divisionId: "div-karachi",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    bio: "Leading 7 districts of Karachi Division youth initiatives.",
    displayOrder: 5,
    isActive: true
  },
  {
    id: 'cab-6',
    fullName: "Ayesha Kalhoro",
    designation: "Divisional Secretary - Sukkur Division",
    cabinetLevel: "DIVISIONAL",
    divisionId: "div-sukkur",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    bio: "Organizing grassroots youth assemblies across Sukkur & Khairpur.",
    displayOrder: 6,
    isActive: true
  }
];

export const INITIAL_MEMBER_PROFILES: MemberProfile[] = [
  {
    id: 'mem-5372',
    userId: 'usr-5372',
    fullName: 'Abdul Hannan',
    fatherGuardianName: 'Muhammad Hannan',
    dob: '2001-01-01',
    gender: 'Male',
    cnicNumber: '33105-7853093-7',
    bloodGroup: 'O+',
    mobileNumber: '0331-0578530',
    email: 'abdul.hannan@nypsindh.org.pk',
    passportPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    residentialAddress: 'Karachi South, Sindh',
    cityTown: 'Karachi',
    province: 'Sindh',
    divisionId: 'div-karachi',
    districtId: 'dist-khi-south',
    talukaId: 'tal-karachi-south',
    qualification: 'Bachelors',
    institutionName: 'University of Karachi',
    profession: 'Youth Member',
    organizationName: 'NYP Sindh',
    levelApplied: 'Provincial Level',
    preferredDepartment: 'Executive',
    statementOfPurpose: 'Dedicated to serving the youth of Sindh through leadership and civic engagement.',
    skills: ['Leadership', 'Management', 'Public Speaking'],
    areasOfInterest: ['Youth Governance', 'Parliamentary Affairs'],
    declarationAccepted: true,
    status: 'APPROVED',
    membershipIdNumber: 'NYP-SINDH-2026-KHI-5372',
    assignedDesignation: 'Executive Member - NYP Sindh',
    approvalDate: '2026-09-14',
    submittedAt: '2026-09-01T10:00:00Z'
  }
];

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

