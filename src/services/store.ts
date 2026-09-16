import { 
  User, MemberProfile, ApplicationStatus, CabinetMember, Announcement, 
  LeadershipMessage, WorkingGoal, RoleApplicationRequest, RoleTier, UserRole 
} from '../types';
import { 
  INITIAL_MEMBER_PROFILES, INITIAL_CABINET_MEMBERS, INITIAL_ANNOUNCEMENTS, 
  INITIAL_LEADERSHIP_MESSAGES, INITIAL_WORKING_GOALS 
} from '../data/mockData';
import { SINDH_DIVISIONS, SINDH_DISTRICTS, SINDH_TALUKAS } from '../data/sindhHierarchy';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const KEY_PROFILES = 'nyp_sindh_member_profiles';
const KEY_CURRENT_USER = 'nyp_sindh_current_user';
const KEY_CABINET = 'nyp_sindh_cabinet_members';
const KEY_ANNOUNCEMENTS = 'nyp_sindh_announcements';
const KEY_LEADERSHIP = 'nyp_sindh_leadership_messages';
const KEY_WORKING_GOALS = 'nyp_sindh_working_goals';
const KEY_OFFICER_USERS = 'nyp_sindh_officer_users';
const KEY_ROLE_APPLICATIONS = 'nyp_sindh_role_applications';

export function normalizeCnic(cnic: string): string {
  if (!cnic) return '';
  const digits = cnic.replace(/\D/g, '');
  if (digits.length === 13) {
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  }
  return cnic.trim();
}

export function formatCnic(val: string): string {
  if (!val) return '';
  const digits = val.replace(/\D/g, '').slice(0, 13);
  if (digits.length > 12) {
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  }
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

export function formatMobile(val: string): string {
  if (!val) return '';
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length > 4) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return digits;
}

export function isSameCnic(c1?: string, c2?: string): boolean {
  if (!c1 || !c2) return false;
  const digits1 = c1.replace(/\D/g, '');
  const digits2 = c2.replace(/\D/g, '');
  if (digits1.length > 0 && digits2.length > 0 && digits1 === digits2) {
    return true;
  }
  return c1.trim().toLowerCase() === c2.trim().toLowerCase();
}

const INITIAL_OFFICER_USERS: User[] = [
  {
    id: 'usr-superadmin',
    cnicNumber: '41304-0000000-0',
    fullName: 'Super Admin - NYP Sindh',
    email: 'admin@nypsindh.org.pk',
    mobileNumber: '0333-7612564',
    role: 'SUPER_ADMIN',
    password: 'admin123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-president',
    cnicNumber: '41304-0000000-1',
    fullName: 'President Abdul Rehman Halepoto',
    email: 'president@nypsindh.org.pk',
    mobileNumber: '0333-7612564',
    role: 'PRESIDENT',
    password: 'president123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-verifier',
    cnicNumber: '41304-1111111-1',
    fullName: 'Verification Desk Officer',
    email: 'verifier@nypsindh.org.pk',
    mobileNumber: '0300-1111111',
    role: 'VERIFICATION_DESK',
    password: 'verifier123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-authoriser',
    cnicNumber: '41304-2222222-2',
    fullName: 'Authorisation Desk Authority',
    email: 'authoriser@nypsindh.org.pk',
    mobileNumber: '0300-2222222',
    role: 'AUTHORISATION_DESK',
    password: 'authoriser123',
    createdAt: new Date().toISOString(),
  },
];

class StoreService {
  private profiles: MemberProfile[] = [];
  private currentUser: User | null = null;
  private cabinetMembers: CabinetMember[] = [];
  private announcements: Announcement[] = [];
  private leadershipMessages: LeadershipMessage[] = INITIAL_LEADERSHIP_MESSAGES;
  private workingGoals: WorkingGoal[] = INITIAL_WORKING_GOALS;
  private officerUsers: User[] = INITIAL_OFFICER_USERS;
  private roleApplications: RoleApplicationRequest[] = [];

  constructor() {
    this.init();
    this.fetchFromSupabase();
  }

  private init() {
    const storedOfficers = localStorage.getItem(KEY_OFFICER_USERS);
    if (storedOfficers) {
      try {
        const parsed: User[] = JSON.parse(storedOfficers);
        INITIAL_OFFICER_USERS.forEach((def) => {
          const idx = parsed.findIndex((u) => u.id === def.id || u.role === def.role);
          if (idx === -1) {
            parsed.unshift(def);
          } else {
            parsed[idx].password = def.password;
            parsed[idx].cnicNumber = def.cnicNumber;
            parsed[idx].email = def.email;
          }
        });
        this.officerUsers = parsed;
      } catch (e) {
        this.officerUsers = INITIAL_OFFICER_USERS;
      }
    } else {
      this.officerUsers = INITIAL_OFFICER_USERS;
      this.saveOfficerUsers();
    }

    const storedProfiles = localStorage.getItem(KEY_PROFILES);
    if (storedProfiles) {
      try {
        const parsed: MemberProfile[] = JSON.parse(storedProfiles);
        this.profiles = parsed || [];
      } catch (e) {
        this.profiles = [];
      }
    } else {
      this.profiles = [];
    }
    this.saveProfiles();

    const storedUser = localStorage.getItem(KEY_CURRENT_USER);
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (e) {
        this.currentUser = null;
      }
    }

    const storedRoleApps = localStorage.getItem(KEY_ROLE_APPLICATIONS);
    if (storedRoleApps) {
      try {
        this.roleApplications = JSON.parse(storedRoleApps);
      } catch (e) {
        this.roleApplications = [];
      }
    }

    const storedCabinet = localStorage.getItem(KEY_CABINET);
    this.cabinetMembers = storedCabinet ? JSON.parse(storedCabinet) : [];

    const storedAnn = localStorage.getItem(KEY_ANNOUNCEMENTS);
    const parsedAnn = storedAnn ? JSON.parse(storedAnn) : [];
    this.announcements = parsedAnn.length > 0 ? parsedAnn : INITIAL_ANNOUNCEMENTS;
    localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));

    this.leadershipMessages = INITIAL_LEADERSHIP_MESSAGES;
    localStorage.setItem(KEY_LEADERSHIP, JSON.stringify(this.leadershipMessages));

    const storedGoals = localStorage.getItem(KEY_WORKING_GOALS);
    this.workingGoals = storedGoals ? JSON.parse(storedGoals) : INITIAL_WORKING_GOALS;
  }

  public async clearAllData(): Promise<boolean> {
    localStorage.removeItem(KEY_PROFILES);
    localStorage.removeItem(KEY_CABINET);
    localStorage.removeItem(KEY_ANNOUNCEMENTS);
    localStorage.removeItem(KEY_ROLE_APPLICATIONS);

    if (this.currentUser && (this.currentUser.role === 'MEMBER' || this.currentUser.role === 'APPLICANT')) {
      this.currentUser = null;
      localStorage.removeItem(KEY_CURRENT_USER);
    }

    this.profiles = [];
    this.cabinetMembers = [];
    this.announcements = INITIAL_ANNOUNCEMENTS;
    localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));
    this.roleApplications = [];

    this.officerUsers = INITIAL_OFFICER_USERS;
    this.saveOfficerUsers();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('member_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('cabinet_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {
        console.warn('Supabase clear data notice:', e);
      }
    }

    return true;
  }

  private saveOfficerUsers() {
    localStorage.setItem(KEY_OFFICER_USERS, JSON.stringify(this.officerUsers));
  }

  private saveRoleApplications() {
    localStorage.setItem(KEY_ROLE_APPLICATIONS, JSON.stringify(this.roleApplications));
  }

  public async fetchFromSupabase() {
    if (!isSupabaseConfigured()) return;
    try {
      const { data: profData, error: profErr } = await supabase.from('member_profiles').select('*');
      if (!profErr && profData && profData.length > 0) {
        const fetchedProfiles: MemberProfile[] = profData.map((d: any) => ({
          id: d.id,
          userId: d.user_id || d.id,
          fullName: d.full_name,
          fatherGuardianName: d.father_guardian_name,
          dob: d.dob,
          gender: d.gender,
          cnicNumber: normalizeCnic(d.cnic_number),
          bloodGroup: d.blood_group,
          mobileNumber: d.mobile_number,
          email: d.email,
          passportPhotoUrl: d.passport_photo_url,
          residentialAddress: d.residential_address,
          cityTown: d.city_town,
          province: d.province || 'Sindh',
          divisionId: d.division_id,
          districtId: d.district_id,
          talukaId: d.taluka_id,
          qualification: d.qualification,
          institutionName: d.institution_name,
          profession: d.profession,
          organizationName: d.organization_name,
          preferredDepartment: d.preferred_department,
          statementOfPurpose: d.statement_of_purpose,
          skills: Array.isArray(d.skills) ? d.skills : [],
          areasOfInterest: Array.isArray(d.areas_of_interest) ? d.areas_of_interest : [],
          previousExperience: d.previous_experience,
          priorAffiliations: d.prior_affiliations,
          socialLinks: d.social_links || {},
          declarationAccepted: d.declaration_accepted ?? true,
          status: d.status,
          rejectionReason: d.rejection_reason,
          membershipIdNumber: d.membership_id_number,
          assignedDesignation: d.assigned_designation,
          approvalDate: d.approval_date,
          submittedAt: d.submitted_at || new Date().toISOString(),
        }));

        const profileMap = new Map<string, MemberProfile>();
        this.profiles.forEach((p) => {
          const key = p.cnicNumber.replace(/\D/g, '') || p.id;
          profileMap.set(key, p);
        });
        fetchedProfiles.forEach((p) => {
          const key = p.cnicNumber.replace(/\D/g, '') || p.id;
          const local = profileMap.get(key);
          profileMap.set(key, local ? { ...local, ...p } : p);
        });

        this.profiles = Array.from(profileMap.values());
        this.saveProfiles();
      }
    } catch (e) {
      console.warn('Supabase fetch notice:', e);
    }
  }

  private saveProfiles() {
    localStorage.setItem(KEY_PROFILES, JSON.stringify(this.profiles));
  }

  private saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem(KEY_CURRENT_USER);
    }
  }

  // --- Auth & User Functions ---
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getOfficerUsers(): User[] {
    return this.officerUsers;
  }

  public toggleBlockUser(userId: string): boolean {
    const user = this.officerUsers.find((u) => u.id === userId);
    if (user) {
      user.isBlocked = !user.isBlocked;
      this.saveOfficerUsers();
      return user.isBlocked;
    }
    return false;
  }

  public updateUserRole(userId: string, role: UserRole) {
    const user = this.officerUsers.find((u) => u.id === userId);
    if (user) {
      user.role = role;
      this.saveOfficerUsers();
    }
  }

  public addOfficerUser(data: Omit<User, 'id' | 'createdAt'>): User {
    const newOfficer: User = {
      ...data,
      id: `usr-off-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.officerUsers.unshift(newOfficer);
    this.saveOfficerUsers();
    return newOfficer;
  }

  public deleteOfficerUser(id: string) {
    this.officerUsers = this.officerUsers.filter((u) => u.id !== id);
    this.saveOfficerUsers();
  }

  public loginUserByCnic(cnicNumber: string, passwordInput?: string): { success: boolean; user?: User; error?: string } {
    const rawInput = cnicNumber ? cnicNumber.trim() : '';
    if (!rawInput) return { success: false, error: 'CNIC or Username is required' };

    const lowerInput = rawInput.toLowerCase();
    const cleanDigits = rawInput.replace(/\D/g, '');

    // 1. Check Officer / Admin logins
    const officer = this.officerUsers.find(
      (u) => 
        isSameCnic(u.cnicNumber, rawInput) || 
        (u.email && u.email.toLowerCase() === lowerInput) ||
        (cleanDigits && cleanDigits.length >= 10 && u.cnicNumber.replace(/\D/g, '') === cleanDigits) ||
        ((lowerInput === 'admin' || lowerInput === 'superadmin' || lowerInput === 'super_admin') && (u.role === 'SUPER_ADMIN' || u.id === 'usr-superadmin')) ||
        ((lowerInput === 'president') && (u.role === 'PRESIDENT' || u.id === 'usr-president')) ||
        ((lowerInput === 'verifier' || lowerInput === 'verification') && (u.role === 'VERIFICATION_DESK' || u.role === 'VERIFYING_OFFICER' || u.id === 'usr-verifier')) ||
        ((lowerInput === 'authoriser' || lowerInput === 'authorization' || lowerInput === 'approval') && (u.role === 'AUTHORISATION_DESK' || u.role === 'APPROVAL_AUTHORITY' || u.id === 'usr-authoriser'))
    );

    if (officer) {
      if (officer.isBlocked) {
        return { success: false, error: 'Account access has been suspended by President NYP Sindh.' };
      }

      const expectedPassword = 
        officer.id === 'usr-superadmin' || officer.role === 'SUPER_ADMIN' ? 'admin123' :
        officer.id === 'usr-president' || officer.role === 'PRESIDENT' ? 'president123' :
        officer.id === 'usr-verifier' || officer.role === 'VERIFICATION_DESK' ? 'verifier123' :
        officer.id === 'usr-authoriser' || officer.role === 'AUTHORISATION_DESK' ? 'authoriser123' :
        (officer.password || 'pass123');

      const providedPassword = passwordInput ? passwordInput.trim() : '';

      if (providedPassword.length > 0) {
        if (providedPassword !== expectedPassword.trim() && providedPassword !== (officer.password ? officer.password.trim() : '')) {
          return { success: false, error: 'Invalid password. Please check your credentials.' };
        }
      }

      this.currentUser = officer;
      this.saveCurrentUser();
      return { success: true, user: officer };
    }

    // 2. Check existing Member Profile
    const existingProfile = this.profiles.find((p) => isSameCnic(p.cnicNumber, rawInput));
    if (existingProfile) {
      const user: User = {
        id: existingProfile.userId,
        cnicNumber: existingProfile.cnicNumber,
        fullName: existingProfile.fullName,
        email: existingProfile.email,
        mobileNumber: existingProfile.mobileNumber,
        role: 'MEMBER',
        createdAt: existingProfile.submittedAt,
      };
      this.currentUser = user;
      this.saveCurrentUser();
      return { success: true, user };
    }

    // 3. Registering base Member if not found
    const newUser: User = {
      id: `usr-${Date.now()}`,
      cnicNumber: normalizeCnic(rawInput),
      fullName: 'Youth Member',
      email: '',
      mobileNumber: '',
      role: 'MEMBER',
      createdAt: new Date().toISOString(),
    };
    this.currentUser = newUser;
    this.saveCurrentUser();
    return { success: true, user: newUser };
  }

  public logoutUser() {
    this.currentUser = null;
    this.saveCurrentUser();
  }

  // --- Profile Submission & Management ---
  public getAllProfiles(): MemberProfile[] {
    return this.profiles;
  }

  public getProfileByUserId(userId: string): MemberProfile | undefined {
    return this.profiles.find(
      (p) =>
        (userId && p.userId === userId) ||
        isSameCnic(p.cnicNumber, this.currentUser?.cnicNumber)
    );
  }

  public getProfileById(id: string): MemberProfile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  public async submitMemberProfile(data: Omit<MemberProfile, 'id' | 'status' | 'submittedAt'>, password?: string): Promise<MemberProfile> {
    const cleanCnic = normalizeCnic(data.cnicNumber);
    const profileData = {
      ...data,
      cnicNumber: cleanCnic,
    };

    const existingIndex = this.profiles.findIndex((p) => isSameCnic(p.cnicNumber, cleanCnic));
    let newProfile: MemberProfile;

    if (existingIndex >= 0) {
      const existing = this.profiles[existingIndex];
      newProfile = {
        ...existing,
        ...profileData,
        status: existing.status === 'APPROVED' ? 'APPROVED' : 'PENDING_VERIFICATION',
        assignedDesignation: existing.assignedDesignation || 'Member',
      };
      this.profiles[existingIndex] = newProfile;
    } else {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      newProfile = {
        ...profileData,
        id: `mem-${Date.now()}`,
        status: 'PENDING_VERIFICATION',
        assignedDesignation: 'Member',
        membershipIdNumber: `NYPS-2026-${randomNum}`,
        submittedAt: new Date().toISOString(),
      };
      this.profiles.unshift(newProfile);
    }
    this.saveProfiles();

    const currentUserState: User = {
      id: newProfile.userId || `usr-${Date.now()}`,
      cnicNumber: cleanCnic,
      fullName: newProfile.fullName,
      email: newProfile.email,
      mobileNumber: newProfile.mobileNumber,
      role: 'MEMBER',
      password: password || 'pass123',
      createdAt: newProfile.submittedAt,
    };
    this.currentUser = currentUserState;
    this.saveCurrentUser();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('member_profiles').upsert({
          id: newProfile.id,
          user_id: newProfile.userId,
          full_name: newProfile.fullName,
          father_guardian_name: newProfile.fatherGuardianName,
          dob: newProfile.dob,
          gender: newProfile.gender,
          cnic_number: newProfile.cnicNumber,
          blood_group: newProfile.bloodGroup,
          mobile_number: newProfile.mobileNumber,
          email: newProfile.email,
          passport_photo_url: newProfile.passportPhotoUrl,
          residential_address: newProfile.residentialAddress,
          city_town: newProfile.cityTown,
          province: newProfile.province,
          division_id: newProfile.divisionId,
          district_id: newProfile.districtId,
          taluka_id: newProfile.talukaId,
          qualification: newProfile.qualification,
          institution_name: newProfile.institutionName,
          profession: newProfile.profession,
          organization_name: newProfile.organizationName,
          preferred_department: newProfile.preferredDepartment,
          statement_of_purpose: newProfile.statementOfPurpose,
          skills: newProfile.skills,
          areas_of_interest: newProfile.areasOfInterest,
          previous_experience: newProfile.previousExperience,
          prior_affiliations: newProfile.priorAffiliations,
          social_links: newProfile.socialLinks,
          declaration_accepted: newProfile.declarationAccepted,
          status: newProfile.status,
          membership_id_number: newProfile.membershipIdNumber,
          assigned_designation: newProfile.assignedDesignation,
          approval_date: newProfile.approvalDate,
          submitted_at: newProfile.submittedAt,
        });
      } catch (e) {
        console.warn('Supabase submit profile notice:', e);
      }
    }

    return newProfile;
  }

  public async updateProfileStatus(
    profileId: string, 
    status: ApplicationStatus, 
    details?: { rejectionReason?: string; designation?: string; membershipIdNumber?: string }
  ): Promise<MemberProfile | null> {
    const profile = this.profiles.find((p) => p.id === profileId);
    if (!profile) return null;

    profile.status = status;

    if (status === 'VERIFIED') {
      profile.verifiedByUserId = this.currentUser?.id || 'usr-verifier';
    } else if (status === 'APPROVED') {
      profile.authorizedByUserId = this.currentUser?.id || 'usr-authoriser';
      profile.approvalDate = new Date().toISOString().split('T')[0];
      if (details?.designation) {
        profile.assignedDesignation = details.designation;
      }
      if (details?.membershipIdNumber) {
        profile.membershipIdNumber = details.membershipIdNumber;
      } else if (!profile.membershipIdNumber) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        profile.membershipIdNumber = `NYPS-2026-${randomNum}`;
      }
    } else if (status === 'REJECTED' && details?.rejectionReason) {
      profile.rejectionReason = details.rejectionReason;
    }

    this.saveProfiles();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('member_profiles').update({
          status: profile.status,
          approval_date: profile.approvalDate,
          assigned_designation: profile.assignedDesignation,
          membership_id_number: profile.membershipIdNumber,
          rejection_reason: profile.rejectionReason,
          verified_by_id: profile.verifiedByUserId,
          authorized_by_id: profile.authorizedByUserId,
        }).eq('id', profile.id);
      } catch (e) {
        console.warn('Supabase update status notice:', e);
      }
    }

    return profile;
  }

  public async deleteMemberProfile(profileId: string): Promise<boolean> {
    const profile = this.profiles.find((p) => p.id === profileId);
    this.profiles = this.profiles.filter((p) => p.id !== profileId);
    this.saveProfiles();

    if (isSupabaseConfigured() && profile) {
      try {
        await supabase.from('member_profiles').delete().eq('id', profile.id);
      } catch (e) {
        console.warn('Supabase delete profile notice:', e);
      }
    }
    return true;
  }

  public async clearAllMemberProfiles(): Promise<boolean> {
    this.profiles = [];
    localStorage.removeItem(KEY_PROFILES);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('member_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {
        console.warn('Supabase clear all profiles notice:', e);
      }
    }
    return true;
  }

  // --- Role Tier Applications Workflow ---
  public getRoleApplications(): RoleApplicationRequest[] {
    return this.roleApplications;
  }

  public getRoleApplicationsByUserId(userId: string): RoleApplicationRequest[] {
    return this.roleApplications.filter((r) => r.userId === userId);
  }

  public createRoleApplication(data: {
    userId: string;
    cnicNumber: string;
    profileId: string;
    roleTier: RoleTier;
    targetRoleTitle: string;
    reason: string;
    feeAmount: number;
  }): RoleApplicationRequest {
    const newApp: RoleApplicationRequest = {
      id: `role-app-${Date.now()}`,
      userId: data.userId,
      cnicNumber: data.cnicNumber,
      profileId: data.profileId,
      roleTier: data.roleTier,
      targetRoleTitle: data.targetRoleTitle,
      reason: data.reason,
      feeAmount: data.feeAmount,
      status: 'PENDING_VERIFICATION',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.roleApplications.unshift(newApp);
    this.saveRoleApplications();
    return newApp;
  }

  public verifyRoleApplication(requestId: string): RoleApplicationRequest | null {
    const app = this.roleApplications.find((r) => r.id === requestId);
    if (app) {
      app.status = 'VERIFIED_PENDING_PAYMENT';
      app.verifiedByUserId = this.currentUser?.id || 'usr-verifier';
      app.updatedAt = new Date().toISOString();
      this.saveRoleApplications();
      return app;
    }
    return null;
  }

  public submitRoleApplicationPayment(requestId: string, paymentMethod: string, transactionId: string): RoleApplicationRequest | null {
    const app = this.roleApplications.find((r) => r.id === requestId);
    if (app) {
      app.status = 'PAYMENT_SUBMITTED_PENDING_AUTHORISATION';
      app.paymentDetails = {
        paymentMethod,
        transactionId,
        submittedAt: new Date().toISOString(),
      };
      app.updatedAt = new Date().toISOString();
      this.saveRoleApplications();
      return app;
    }
    return null;
  }

  public authorizeRoleApplication(requestId: string): RoleApplicationRequest | null {
    const app = this.roleApplications.find((r) => r.id === requestId);
    if (app) {
      app.status = 'AUTHORISED';
      app.authorizedByUserId = this.currentUser?.id || 'usr-authoriser';
      app.updatedAt = new Date().toISOString();
      this.saveRoleApplications();

      // Update Member Profile Designation
      const profile = this.profiles.find((p) => p.id === app.profileId || isSameCnic(p.cnicNumber, app.cnicNumber));
      if (profile) {
        profile.assignedDesignation = app.targetRoleTitle;
        this.saveProfiles();
      }

      return app;
    }
    return null;
  }

  public rejectRoleApplication(requestId: string, reason: string): RoleApplicationRequest | null {
    const app = this.roleApplications.find((r) => r.id === requestId);
    if (app) {
      app.status = 'REJECTED';
      app.rejectionReason = reason;
      app.updatedAt = new Date().toISOString();
      this.saveRoleApplications();
      return app;
    }
    return null;
  }

  // --- CMS Content Management ---
  public getCabinetMembers(level?: 'PROVINCIAL' | 'DIVISIONAL', divisionId?: string): CabinetMember[] {
    let list = this.cabinetMembers.filter((m) => m.isActive);
    if (level) {
      list = list.filter((m) => m.cabinetLevel === level);
    }
    if (divisionId) {
      list = list.filter((m) => m.divisionId === divisionId);
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public addCabinetMember(data: Omit<CabinetMember, 'id'>): CabinetMember {
    const newMember: CabinetMember = {
      ...data,
      id: `cab-${Date.now()}`,
    };
    this.cabinetMembers.unshift(newMember);
    localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));
    return newMember;
  }

  public updateCabinetMember(id: string, data: Partial<CabinetMember>): CabinetMember | null {
    const member = this.cabinetMembers.find((m) => m.id === id);
    if (member) {
      Object.assign(member, data);
      localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));
      return member;
    }
    return null;
  }

  public deleteCabinetMember(id: string) {
    this.cabinetMembers = this.cabinetMembers.filter((m) => m.id !== id);
    localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));
  }

  public getAnnouncements(): Announcement[] {
    return this.announcements.filter((a) => a.isActive);
  }

  public addAnnouncement(data: Omit<Announcement, 'id'>): Announcement {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
    };
    this.announcements.unshift(newAnn);
    localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));

    if (isSupabaseConfigured()) {
      supabase.from('announcements').insert([{
        id: newAnn.id,
        title: newAnn.title,
        content: newAnn.content,
        published_at: newAnn.publishedAt,
        banner_url: newAnn.bannerUrl,
        is_active: newAnn.isActive
      }]).then(({ error }) => {
        if (error) console.warn('Supabase addAnnouncement notice:', error.message);
      });
    }

    return newAnn;
  }

  public deleteAnnouncement(id: string) {
    this.announcements = this.announcements.filter((a) => a.id !== id);
    localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));

    if (isSupabaseConfigured()) {
      supabase.from('announcements').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase deleteAnnouncement notice:', error.message);
      });
    }
  }

  public getLeadershipMessages(): LeadershipMessage[] {
    return this.leadershipMessages;
  }

  public addLeadershipMessage(data: Omit<LeadershipMessage, 'id'>): LeadershipMessage {
    const newMsg: LeadershipMessage = {
      ...data,
      id: `msg-${Date.now()}`,
    };
    this.leadershipMessages.unshift(newMsg);
    localStorage.setItem(KEY_LEADERSHIP, JSON.stringify(this.leadershipMessages));
    return newMsg;
  }

  public deleteLeadershipMessage(id: string) {
    this.leadershipMessages = this.leadershipMessages.filter((m) => m.id !== id);
    localStorage.setItem(KEY_LEADERSHIP, JSON.stringify(this.leadershipMessages));
  }

  public getWorkingGoals(): WorkingGoal[] {
    return this.workingGoals;
  }

  public addWorkingGoal(data: Omit<WorkingGoal, 'id'>): WorkingGoal {
    const newGoal: WorkingGoal = {
      ...data,
      id: `goal-${Date.now()}`,
    };
    this.workingGoals.push(newGoal);
    localStorage.setItem(KEY_WORKING_GOALS, JSON.stringify(this.workingGoals));
    return newGoal;
  }

  public deleteWorkingGoal(id: string) {
    this.workingGoals = this.workingGoals.filter((g) => g.id !== id);
    localStorage.setItem(KEY_WORKING_GOALS, JSON.stringify(this.workingGoals));
  }

  public getDivisionName(divisionId: string): string {
    return SINDH_DIVISIONS.find((d) => d.id === divisionId)?.name || 'Sindh';
  }

  public getDistrictName(districtId: string): string {
    return SINDH_DISTRICTS.find((d) => d.id === districtId)?.name || '';
  }

  public getTalukaName(talukaId: string): string {
    return SINDH_TALUKAS.find((t) => t.id === talukaId)?.name || '';
  }

  public getStats() {
    const total = this.profiles.length;
    const approved = this.profiles.filter((p) => p.status === 'APPROVED').length;
    const pending = this.profiles.filter((p) => p.status === 'PENDING_VERIFICATION').length;
    const verified = this.profiles.filter((p) => p.status === 'VERIFIED').length;
    const rejected = this.profiles.filter((p) => p.status === 'REJECTED').length;

    const divisionCounts: Record<string, number> = {};
    SINDH_DIVISIONS.forEach((div) => {
      divisionCounts[div.name] = this.profiles.filter((p) => p.divisionId === div.id).length;
    });

    return { total, approved, pending, verified, rejected, divisionCounts };
  }
}

export const store = new StoreService();
