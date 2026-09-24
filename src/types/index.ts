export type UserRole = 
  | 'APPLICANT' 
  | 'MEMBER'
  | 'VERIFICATION_DESK' 
  | 'AUTHORISATION_DESK' 
  | 'PRESIDENT'
  | 'WEB_COORDINATOR'
  | 'VERIFYING_OFFICER' 
  | 'APPROVAL_AUTHORITY' 
  | 'DIVISIONAL_ADMIN' 
  | 'SUPER_ADMIN';

export type ApplicationStatus = 
  | 'PENDING_VERIFICATION' 
  | 'VERIFIED' 
  | 'PAYMENT_SUBMITTED'
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
  cnicNumber: string; // CNIC
  username?: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  password?: string;
  isBlocked?: boolean;
  assignedDivisionId?: string;
  assignedDistrictId?: string;
  createdAt: string;
}

export type RoleTier = 
  | 'YOUTH_MPA'
  | 'YOUTH_MNA'
  | 'DIVISIONAL_ROLE'
  | 'DISTRICT_ROLE'
  | 'TALUKA_ROLE'
  | 'PHYSICAL_CARD';

export type RoleApplicationStatus = 
  | 'PENDING_VERIFICATION'
  | 'VERIFIED_PENDING_PAYMENT'
  | 'PAYMENT_SUBMITTED_PENDING_AUTHORISATION'
  | 'AUTHORISED'
  | 'REJECTED';

export interface RoleApplicationRequest {
  id: string;
  userId: string;
  cnicNumber: string;
  profileId: string;
  roleTier: RoleTier;
  targetRoleTitle: string; // e.g. "Youth MPA Assembly Delegate", "Youth MNA Representative"
  reason: string;
  feeAmount: number; // MNA: 5000, MPA: 4000, Division: 3000, District: 2000, Taluka: 1500, Physical Card: 1000
  status: RoleApplicationStatus;
  paymentDetails?: {
    paymentMethod: string; // JazzCash, EasyPaisa, Bank Transfer
    transactionId: string;
    paymentProofUrl?: string; // Image / screenshot URL of payment receipt
    submittedAt: string;
  };
  rejectionReason?: string;
  verifiedByUserId?: string;
  authorizedByUserId?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface MemberProfile {
  id: string;
  userId?: string;
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
  levelApplied?: 'Provincial Level' | 'Divisional Level' | 'District Level' | 'Taluka Level' | 'City Level';
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
  paymentDetails?: {
    paymentMethod: string;
    transactionId: string;
    paymentProofUrl?: string; // Image / screenshot URL of payment receipt
    feeAmount: number;
    submittedAt: string;
  };
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
  memberProfileId?: string;
  cnicNumber?: string;

  // Parliamentary Attributes
  category?: 'CABINET' | 'PARLIAMENTARIAN';
  parliamentaryRole?: 'YOUTH_MPA' | 'YOUTH_MNA' | 'SPEAKER' | 'DEPUTY_SPEAKER' | 'CHIEF_MINISTER' | 'OPPOSITION_LEADER' | 'MINISTER';
  ministryDepartment?: string;
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
  subtitle?: string;
}

export interface WorkingGoal {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: string; // e.g. Youth Summit, Assembly Session, Divisional Meetup, Community Outreach
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  eventDate?: string;
  location?: string;
  createdAt?: string;
}

