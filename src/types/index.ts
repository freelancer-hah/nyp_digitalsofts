export type UserRole = 
  | 'APPLICANT' 
  | 'VERIFYING_OFFICER' 
  | 'APPROVAL_AUTHORITY' 
  | 'DIVISIONAL_ADMIN' 
  | 'SUPER_ADMIN';

export type ApplicationStatus = 
  | 'PENDING_VERIFICATION' 
  | 'VERIFIED' 
  | 'APPROVED' 
  | 'REJECTED';

export type CabinetLevel = 'PROVINCIAL' | 'DIVISIONAL';

export interface Division {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  name: string;
  divisionId: string;
}

export interface Taluka {
  id: string;
  name: string;
  districtId: string;
}

export interface User {
  id: string;
  cnicNumber: string; // Username
  fullName: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  assignedDivisionId?: string;
  assignedDistrictId?: string;
  createdAt: string;
}

export interface MemberProfile {
  id: string;
  userId: string;
  fullName: string;
  fatherGuardianName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Prefer not to say';
  cnicNumber: string;
  bloodGroup?: string;
  mobileNumber: string;
  email: string;
  passportPhotoUrl: string;
  
  // Location Hierarchy
  residentialAddress: string;
  cityTown: string;
  province: string; // Default 'Sindh'
  divisionId: string;
  districtId: string;
  talukaId: string;
  
  // Academic & Profession
  qualification: string;
  institutionName: string;
  profession: string;
  organizationName?: string;
  
  // Application Preferences & SOP
  levelApplied: 'Provincial Level' | 'Divisional Level' | 'District Level' | 'Taluka Level' | 'City Level';
  preferredDepartment: string;
  statementOfPurpose: string;
  
  // Multi-select Checkboxes
  skills: string[];
  areasOfInterest: string[];
  
  // Experience & Socials
  previousExperience?: string;
  priorAffiliations?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  declarationAccepted: boolean;
  
  // Administrative Verification & Authorization
  status: ApplicationStatus;
  rejectionReason?: string;
  membershipIdNumber?: string; // e.g. NYP-SINDH-2026-KHI-0142
  assignedDesignation?: string; // e.g. Youth MPA, Executive Member, District Coordinator
  verifiedByUserId?: string;
  authorizedByUserId?: string;
  approvalDate?: string;
  submittedAt: string;
}

export interface CabinetMember {
  id: string;
  fullName: string;
  designation: string;
  cabinetLevel: CabinetLevel;
  divisionId?: string;
  photoUrl: string;
  bio?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  bannerUrl?: string;
  isActive: boolean;
}

export interface LeadershipMessage {
  id: string;
  title: string;
  leaderName: string;
  leaderTitle: string;
  messageText: string;
  photoUrl: string;
}

export interface WorkingGoal {
  id: string;
  title: string;
  description: string;
  category: string;
}

