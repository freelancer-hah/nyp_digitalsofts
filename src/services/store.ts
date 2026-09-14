import { User, MemberProfile, ApplicationStatus, CabinetMember, Announcement, LeadershipMessage, WorkingGoal } from '../types';
import { INITIAL_MEMBER_PROFILES, INITIAL_CABINET_MEMBERS, INITIAL_ANNOUNCEMENTS, INITIAL_LEADERSHIP_MESSAGES, INITIAL_WORKING_GOALS } from '../data/mockData';
import { SINDH_DIVISIONS, SINDH_DISTRICTS, SINDH_TALUKAS } from '../data/sindhHierarchy';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const KEY_PROFILES = 'nyp_sindh_member_profiles';
const KEY_CURRENT_USER = 'nyp_sindh_current_user';
const KEY_CABINET = 'nyp_sindh_cabinet_members';
const KEY_ANNOUNCEMENTS = 'nyp_sindh_announcements';
const KEY_LEADERSHIP = 'nyp_sindh_leadership_messages';
const KEY_WORKING_GOALS = 'nyp_sindh_working_goals';
const KEY_OFFICER_USERS = 'nyp_sindh_officer_users';

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
    id: 'usr-super-admin',
    cnicNumber: '41304-0000000-0',
    fullName: 'Super Admin - Executive Office',
    email: 'admin@nypsindh.org.pk',
    mobileNumber: '0333-7612564',
    role: 'SUPER_ADMIN',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-verifier-01',
    cnicNumber: '41304-1111111-1',
    fullName: 'Verifying Officer - Scrutiny Desk',
    email: 'verifier@nypsindh.org.pk',
    mobileNumber: '0300-1111111',
    role: 'VERIFYING_OFFICER',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-president-01',
    cnicNumber: '41304-2222222-2',
    fullName: 'Approval Authority - President Desk',
    email: 'president@nypsindh.org.pk',
    mobileNumber: '0300-2222222',
    role: 'APPROVAL_AUTHORITY',
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

  constructor() {
    this.init();
    this.fetchFromSupabase();
  }

  private init() {
    const storedOfficers = localStorage.getItem(KEY_OFFICER_USERS);
    if (storedOfficers) {
      try {
        this.officerUsers = JSON.parse(storedOfficers);
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
        const hannanOnly = parsed.filter(
          (p) => p.fullName.toLowerCase().includes('hannan') || isSameCnic(p.cnicNumber, '33105-7853093-7')
        );
        if (hannanOnly.length > 0) {
          this.profiles = hannanOnly;
        } else {
          this.profiles = INITIAL_MEMBER_PROFILES;
        }
      } catch (e) {
        this.profiles = INITIAL_MEMBER_PROFILES;
      }
    } else {
      this.profiles = INITIAL_MEMBER_PROFILES;
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

    const storedCabinet = localStorage.getItem(KEY_CABINET);
    this.cabinetMembers = storedCabinet ? JSON.parse(storedCabinet) : INITIAL_CABINET_MEMBERS;

    const storedAnn = localStorage.getItem(KEY_ANNOUNCEMENTS);
    this.announcements = storedAnn ? JSON.parse(storedAnn) : INITIAL_ANNOUNCEMENTS;

    const storedLead = localStorage.getItem(KEY_LEADERSHIP);
    this.leadershipMessages = storedLead ? JSON.parse(storedLead) : INITIAL_LEADERSHIP_MESSAGES;

    const storedGoals = localStorage.getItem(KEY_WORKING_GOALS);
    this.workingGoals = storedGoals ? JSON.parse(storedGoals) : INITIAL_WORKING_GOALS;
  }

  private saveOfficerUsers() {
    localStorage.setItem(KEY_OFFICER_USERS, JSON.stringify(this.officerUsers));
  }


  /**
   * Fetch real live data from Supabase backend for Profiles, Cabinet, Announcements, Leadership, and Goals
   */
  public async fetchFromSupabase() {
    if (!isSupabaseConfigured()) return;
    try {
      // 1. Fetch Member Profiles
      const { data: profData, error: profErr } = await supabase.from('member_profiles').select('*');
      if (profErr) {
        console.info('ℹ️ NYP Sindh Database Notice: Remote Supabase database tables not created yet on cloud project. Operating in local database mode. (Run supabase_schema.sql in your Supabase SQL Editor to enable live cloud database sync)');
      }
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
          levelApplied: d.level_applied,
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

        // Merge fetched profiles with local profiles (don't overwrite local profiles that haven't synced yet)
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

      // 2. Fetch Cabinet Members
      const { data: cabData, error: cabErr } = await supabase.from('cabinet_members').select('*');
      if (!cabErr && cabData && cabData.length > 0) {
        const fetchedCab: CabinetMember[] = cabData.map((d: any) => ({
          id: d.id,
          fullName: d.full_name,
          designation: d.designation,
          cabinetLevel: d.cabinet_level,
          divisionId: d.division_id,
          photoUrl: d.photo_url,
          bio: d.bio,
          displayOrder: d.display_order || 1,
          isActive: d.is_active ?? true,
        }));
        
        // Merge fetched cabinet members with local cabinet members (preserve locally added members)
        const cabMap = new Map<string, CabinetMember>();
        this.cabinetMembers.forEach((c) => cabMap.set(c.id || c.fullName, c));
        fetchedCab.forEach((c) => cabMap.set(c.id || c.fullName, c));

        this.cabinetMembers = Array.from(cabMap.values());
        localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));
      }

      // 3. Fetch Announcements
      const { data: annData, error: annErr } = await supabase.from('announcements').select('*');
      if (!annErr && annData && annData.length > 0) {
        const fetchedAnn: Announcement[] = annData.map((d: any) => ({
          id: d.id,
          title: d.title,
          content: d.content,
          publishedAt: d.published_at,
          bannerUrl: d.banner_url,
          isActive: d.is_active ?? true,
        }));

        const annMap = new Map<string, Announcement>();
        this.announcements.forEach((a) => annMap.set(a.id || a.title, a));
        fetchedAnn.forEach((a) => annMap.set(a.id || a.title, a));

        this.announcements = Array.from(annMap.values());
        localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));
      }

      // 4. Fetch Leadership Messages
      const { data: leadData, error: leadErr } = await supabase.from('leadership_messages').select('*');
      if (!leadErr && leadData && leadData.length > 0) {
        this.leadershipMessages = leadData.map((d: any) => ({
          id: d.id,
          title: d.title,
          leaderName: d.leader_name,
          leaderTitle: d.leader_title,
          messageText: d.message_text,
          photoUrl: d.photo_url,
        }));
        localStorage.setItem(KEY_LEADERSHIP, JSON.stringify(this.leadershipMessages));
      }

      // 5. Fetch Working Goals
      const { data: goalData, error: goalErr } = await supabase.from('working_goals').select('*');
      if (!goalErr && goalData && goalData.length > 0) {
        this.workingGoals = goalData.map((d: any) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          description: d.description,
        }));
        localStorage.setItem(KEY_WORKING_GOALS, JSON.stringify(this.workingGoals));
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

  public loginUserByCnic(cnicNumber: string, _legacyRole?: string): { success: boolean; user?: User; error?: string } {
    const rawInput = cnicNumber.trim();
    if (!rawInput) return { success: false, error: 'CNIC number is required' };
    const cleanCnic = normalizeCnic(rawInput);

    // 1. Check if CNIC/email matches a registered Officer/Admin account
    const officer = this.officerUsers.find(
      (u) => isSameCnic(u.cnicNumber, rawInput) || (rawInput.toLowerCase() === 'admin@nypsindh.org.pk' && u.role === 'SUPER_ADMIN')
    );

    if (officer) {
      this.currentUser = officer;
      this.saveCurrentUser();
      return { success: true, user: officer };
    }

    // 2. Check if CNIC belongs to an existing Member Profile (robust comparison)
    const existingProfile = this.profiles.find((p) => isSameCnic(p.cnicNumber, rawInput));
    if (existingProfile) {
      const user: User = {
        id: existingProfile.userId,
        cnicNumber: existingProfile.cnicNumber,
        fullName: existingProfile.fullName,
        email: existingProfile.email,
        mobileNumber: existingProfile.mobileNumber,
        role: 'APPLICANT',
        createdAt: existingProfile.submittedAt,
      };
      this.currentUser = user;
      this.saveCurrentUser();
      return { success: true, user };
    }

    // 3. Brand new CNIC defaults to Youth Member (Applicant)
    const newUser: User = {
      id: `usr-${Date.now()}`,
      cnicNumber: cleanCnic,
      fullName: 'Youth Applicant',
      email: '',
      mobileNumber: '',
      role: 'APPLICANT',
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

  public async submitMemberProfile(data: Omit<MemberProfile, 'id' | 'status' | 'submittedAt'>): Promise<MemberProfile> {
    const cleanCnic = normalizeCnic(data.cnicNumber);
    const profileData = {
      ...data,
      cnicNumber: cleanCnic,
    };

    const existingIndex = this.profiles.findIndex((p) => isSameCnic(p.cnicNumber, cleanCnic));
    let newProfile: MemberProfile;

    if (existingIndex >= 0) {
      newProfile = {
        ...this.profiles[existingIndex],
        ...profileData,
        status: 'PENDING_VERIFICATION',
      };
      this.profiles[existingIndex] = newProfile;
    } else {
      newProfile = {
        ...profileData,
        id: `mem-${Date.now()}`,
        status: 'PENDING_VERIFICATION',
        submittedAt: new Date().toISOString(),
      };
      this.profiles.unshift(newProfile);
    }
    this.saveProfiles();

    // Auto-login / update current user state so dashboard immediately recognizes the applicant
    const currentUserState: User = {
      id: newProfile.userId || `usr-${Date.now()}`,
      cnicNumber: cleanCnic,
      fullName: newProfile.fullName,
      email: newProfile.email,
      mobileNumber: newProfile.mobileNumber,
      role: 'APPLICANT',
      createdAt: newProfile.submittedAt,
    };
    this.currentUser = currentUserState;
    this.saveCurrentUser();

    // Push to real Supabase database if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('member_profiles').insert([{
          full_name: profileData.fullName,
          father_guardian_name: profileData.fatherGuardianName,
          dob: profileData.dob,
          gender: profileData.gender,
          cnic_number: cleanCnic,
          blood_group: profileData.bloodGroup,
          mobile_number: profileData.mobileNumber,
          email: profileData.email,
          passport_photo_url: profileData.passportPhotoUrl,
          residential_address: profileData.residentialAddress,
          city_town: profileData.cityTown,
          province: profileData.province,
          division_id: profileData.divisionId,
          district_id: profileData.districtId,
          taluka_id: (profileData.talukaId && profileData.talukaId.trim() !== '') ? profileData.talukaId : null,
          qualification: profileData.qualification,
          institution_name: profileData.institutionName,
          profession: profileData.profession,
          organization_name: profileData.organizationName,
          level_applied: profileData.levelApplied,
          preferred_department: profileData.preferredDepartment,
          statement_of_purpose: profileData.statementOfPurpose,
          skills: profileData.skills,
          areas_of_interest: profileData.areasOfInterest,
          previous_experience: profileData.previousExperience,
          prior_affiliations: profileData.priorAffiliations,
          social_links: profileData.socialLinks,
          declaration_accepted: profileData.declarationAccepted,
          status: 'PENDING_VERIFICATION',
        }]).then(({ error }) => {
          if (error) {
            console.error('🔴 Supabase Profile Insert Error:', error);
          } else {
            console.log('🟢 Supabase Profile Insert Successful');
          }
        });
      } catch (e) {
        console.warn('Supabase insert notice:', e);
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
      profile.verifiedByUserId = this.currentUser?.id || 'admin-verifier';
    } else if (status === 'APPROVED') {
      profile.authorizedByUserId = this.currentUser?.id || 'admin-authorizer';
      profile.approvalDate = new Date().toISOString().split('T')[0];
      if (details?.designation) {
        profile.assignedDesignation = details.designation;
      }
      if (details?.membershipIdNumber) {
        profile.membershipIdNumber = details.membershipIdNumber;
      } else if (!profile.membershipIdNumber) {
        const divCode = SINDH_DIVISIONS.find((d) => d.id === profile.divisionId)?.code || 'SND';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        profile.membershipIdNumber = `NYP-SINDH-2026-${divCode}-${randomNum}`;
      }
    } else if (status === 'REJECTED' && details?.rejectionReason) {
      profile.rejectionReason = details.rejectionReason;
    }

    this.saveProfiles();

    // Sync status update with Supabase DB
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('member_profiles').update({
          status: profile.status,
          rejection_reason: profile.rejectionReason,
          assigned_designation: profile.assignedDesignation,
          membership_id_number: profile.membershipIdNumber,
          approval_date: profile.approvalDate,
        }).eq('cnic_number', profile.cnicNumber);
      } catch (e) {
        console.warn('Supabase status update notice:', e);
      }
    }

    return profile;
  }

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

    if (isSupabaseConfigured()) {
      supabase.from('cabinet_members').insert([{
        full_name: data.fullName,
        designation: data.designation,
        cabinet_level: data.cabinetLevel,
        division_id: data.divisionId,
        photo_url: data.photoUrl,
        bio: data.bio,
        display_order: data.displayOrder || 1,
        is_active: data.isActive ?? true,
      }]).then(({ error }) => {
        if (error) console.warn('Supabase cabinet insert notice:', error);
      });
    }

    return newMember;
  }

  public deleteCabinetMember(id: string) {
    const itemToDelete = this.cabinetMembers.find((m) => m.id === id);
    this.cabinetMembers = this.cabinetMembers.filter((m) => m.id !== id);
    localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));

    if (isSupabaseConfigured()) {
      if (itemToDelete?.fullName) {
        supabase.from('cabinet_members').delete().eq('full_name', itemToDelete.fullName).then(({ error }) => {
          if (error) console.warn('Supabase cabinet delete notice:', error);
        });
      } else {
        supabase.from('cabinet_members').delete().eq('id', id).then(({ error }) => {
          if (error) console.warn('Supabase cabinet delete notice:', error);
        });
      }
    }
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
        title: data.title,
        content: data.content,
        published_at: data.publishedAt || new Date().toISOString().split('T')[0],
        banner_url: data.bannerUrl,
        is_active: data.isActive ?? true,
      }]).then(({ error }) => {
        if (error) console.warn('Supabase announcement insert notice:', error);
      });
    }

    return newAnn;
  }

  public deleteAnnouncement(id: string) {
    const itemToDelete = this.announcements.find((a) => a.id === id);
    this.announcements = this.announcements.filter((a) => a.id !== id);
    localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));

    if (isSupabaseConfigured()) {
      if (itemToDelete?.title) {
        supabase.from('announcements').delete().eq('title', itemToDelete.title).then(({ error }) => {
          if (error) console.warn('Supabase announcement delete notice:', error);
        });
      } else {
        supabase.from('announcements').delete().eq('id', id).then(({ error }) => {
          if (error) console.warn('Supabase announcement delete notice:', error);
        });
      }
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

    if (isSupabaseConfigured()) {
      supabase.from('leadership_messages').insert([{
        title: data.title,
        leader_name: data.leaderName,
        leader_title: data.leaderTitle,
        message_text: data.messageText,
        photo_url: data.photoUrl,
      }]).then(({ error }) => {
        if (error) console.warn('Supabase leadership insert notice:', error);
      });
    }

    return newMsg;
  }

  public deleteLeadershipMessage(id: string) {
    const itemToDelete = this.leadershipMessages.find((m) => m.id === id);
    this.leadershipMessages = this.leadershipMessages.filter((m) => m.id !== id);
    localStorage.setItem(KEY_LEADERSHIP, JSON.stringify(this.leadershipMessages));

    if (isSupabaseConfigured()) {
      if (itemToDelete?.leaderName) {
        supabase.from('leadership_messages').delete().eq('leader_name', itemToDelete.leaderName).then(({ error }) => {
          if (error) console.warn('Supabase leadership delete notice:', error);
        });
      } else {
        supabase.from('leadership_messages').delete().eq('id', id).then(({ error }) => {
          if (error) console.warn('Supabase leadership delete notice:', error);
        });
      }
    }
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

    if (isSupabaseConfigured()) {
      supabase.from('working_goals').insert([{
        title: data.title,
        category: data.category,
        description: data.description,
      }]).then(({ error }) => {
        if (error) console.warn('Supabase working goal insert notice:', error);
      });
    }

    return newGoal;
  }

  public deleteWorkingGoal(id: string) {
    const itemToDelete = this.workingGoals.find((g) => g.id === id);
    this.workingGoals = this.workingGoals.filter((g) => g.id !== id);
    localStorage.setItem(KEY_WORKING_GOALS, JSON.stringify(this.workingGoals));

    if (isSupabaseConfigured()) {
      if (itemToDelete?.title) {
        supabase.from('working_goals').delete().eq('title', itemToDelete.title).then(({ error }) => {
          if (error) console.warn('Supabase working goal delete notice:', error);
        });
      } else {
        supabase.from('working_goals').delete().eq('id', id).then(({ error }) => {
          if (error) console.warn('Supabase working goal delete notice:', error);
        });
      }
    }
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
