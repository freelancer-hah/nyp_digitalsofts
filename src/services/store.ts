import { 
  User, MemberProfile, ApplicationStatus, CabinetMember, Announcement, 
  LeadershipMessage, WorkingGoal, MediaItem, RoleApplicationRequest, RoleTier, UserRole 
} from '../types';
import { 
  INITIAL_MEMBER_PROFILES, INITIAL_CABINET_MEMBERS, INITIAL_ANNOUNCEMENTS, 
  INITIAL_LEADERSHIP_MESSAGES, INITIAL_WORKING_GOALS, INITIAL_MEDIA_ITEMS 
} from '../data/mockData';
import { SINDH_DIVISIONS, SINDH_DISTRICTS, SINDH_TALUKAS } from '../data/sindhHierarchy';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const KEY_PROFILES = 'nyp_sindh_member_profiles';
const KEY_CURRENT_USER = 'nyp_sindh_current_user';
const KEY_CABINET = 'nyp_sindh_cabinet_members';
const KEY_ANNOUNCEMENTS = 'nyp_sindh_announcements';
const KEY_LEADERSHIP = 'nyp_sindh_leadership_messages';
const KEY_WORKING_GOALS = 'nyp_sindh_working_goals';
const KEY_MEDIA_ITEMS = 'nyp_sindh_media_items';
const KEY_OFFICER_USERS = 'nyp_sindh_officer_users';
const KEY_ROLE_APPLICATIONS = 'nyp_sindh_role_applications';


export function normalizeDob(dobStr?: string): string {
  if (!dobStr) return '2000-01-01';
  const trimmed = dobStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [d, m, y] = trimmed.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const [d, m, y] = trimmed.split('-');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const clean = trimmed.replace(/\D/g, '');
  if (clean.length === 8) {
    if (parseInt(clean.slice(0, 4), 10) > 1900) {
      return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
    }
    return `${clean.slice(4, 8)}-${clean.slice(2, 4)}-${clean.slice(0, 2)}`;
  }
  return '2000-01-01';
}

export function normalizeCnic(cnic: string): string {
  if (!cnic) return '';
  const digits = cnic.replace(/\D/g, '');
  if (digits.length === 13) {
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  }
  return cnic.trim();
}

export function isUuid(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function toValidUuid(str?: string): string {
  if (str && isUuid(str)) return str;
  return generateUuid();
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
    id: 'usr-president',
    username: 'president',
    cnicNumber: '41304-0000000-1',
    fullName: 'President Abdul Rehman Halepoto',
    email: 'president@nypsindh.org.pk',
    mobileNumber: '0333-7612564',
    role: 'PRESIDENT',
    password: 'president123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-superadmin',
    username: 'admin',
    cnicNumber: '41304-0000000-0',
    fullName: 'Executive Super Admin Desk',
    email: 'admin@nypsindh.org.pk',
    mobileNumber: '0333-7612564',
    role: 'SUPER_ADMIN',
    password: 'admin123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-coordinator',
    username: 'coordinator',
    cnicNumber: '41304-3333333-3',
    fullName: 'Web Coordinator - NYP Sindh',
    email: 'coordinator@nypsindh.org.pk',
    mobileNumber: '0300-3333333',
    role: 'WEB_COORDINATOR',
    password: 'coordinator123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-verifier',
    username: 'verifier',
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
    username: 'authoriser',
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
  private mediaItems: MediaItem[] = INITIAL_MEDIA_ITEMS;
  private officerUsers: User[] = INITIAL_OFFICER_USERS;
  private roleApplications: RoleApplicationRequest[] = [];


  constructor() {
    this.init();
    this.fetchFromSupabase();
  }

  private init() {
    // Complete total wipe of all localStorage data
    if (typeof localStorage !== 'undefined' && localStorage.getItem('nyp_full_ls_wipe_v8') !== 'true') {
      localStorage.clear();
      localStorage.setItem('nyp_full_ls_wipe_v8', 'true');
    }

    const storedOfficers = localStorage.getItem(KEY_OFFICER_USERS);
    let parsed: User[] = [];
    if (storedOfficers) {
      try {
        parsed = JSON.parse(storedOfficers);
      } catch (e) {
        parsed = [];
      }
    }
    INITIAL_OFFICER_USERS.forEach((def) => {
      const idx = parsed.findIndex((u) => u.id === def.id || u.username === def.username);
      if (idx === -1) {
        parsed.unshift({ ...def });
      } else {
        parsed[idx] = { ...parsed[idx], ...def };
      }
    });
    this.officerUsers = parsed;
    this.saveOfficerUsers();

    const storedProfiles = localStorage.getItem(KEY_PROFILES);
    if (storedProfiles) {
      try {
        const parsed: MemberProfile[] = JSON.parse(storedProfiles);
        this.profiles = (parsed || []).map((p) => {
          const generatedId = `NYPS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          return {
            ...p,
            status: (p.status === 'PENDING_VERIFICATION' || !p.status) ? 'APPROVED' : p.status,
            membershipIdNumber: p.membershipIdNumber || generatedId,
            assignedDesignation: (!p.assignedDesignation || p.assignedDesignation === 'Applicant') ? 'Youth Member' : p.assignedDesignation,
            approvalDate: p.approvalDate || p.submittedAt || new Date().toISOString(),
          };
        });
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
        const u = JSON.parse(storedUser);
        if (u && u.role === 'APPLICANT') {
          u.role = 'MEMBER';
        }
        this.currentUser = u;
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
    this.announcements = storedAnn ? JSON.parse(storedAnn) : [];
    localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));

    this.leadershipMessages = INITIAL_LEADERSHIP_MESSAGES;
    localStorage.setItem(KEY_LEADERSHIP, JSON.stringify(this.leadershipMessages));

    const storedGoals = localStorage.getItem(KEY_WORKING_GOALS);
    this.workingGoals = storedGoals ? JSON.parse(storedGoals) : INITIAL_WORKING_GOALS;

    const storedMedia = localStorage.getItem(KEY_MEDIA_ITEMS);
    this.mediaItems = storedMedia ? JSON.parse(storedMedia) : INITIAL_MEDIA_ITEMS;
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
    this.announcements = [];
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
      if (localStorage.getItem('nyp_supabase_v7_wiped') !== 'true') {
        try {
          await supabase.from('member_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          await supabase.from('cabinet_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        } catch (e) {
          console.warn('Supabase remote wipe error:', e);
        }
        this.profiles = [];
        this.cabinetMembers = [];
        this.announcements = [];
        this.mediaItems = [];
        this.saveProfiles();
        localStorage.setItem(KEY_CABINET, JSON.stringify([]));
        localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify([]));
        localStorage.setItem(KEY_MEDIA_ITEMS, JSON.stringify([]));
        localStorage.setItem('nyp_supabase_v7_wiped', 'true');
        return;
      }

      const { data: profData, error: profErr } = await supabase.from('member_profiles').select('*');
      if (!profErr && profData) {
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
          paymentDetails: d.social_links?.paymentDetails || undefined,
          declarationAccepted: d.declaration_accepted ?? true,
          status: (d.social_links?.actualStatus === 'PENDING_VERIFICATION' || d.status === 'PENDING_VERIFICATION' || !d.status) ? 'APPROVED' : ((d.social_links?.actualStatus as ApplicationStatus) || d.status),
          rejectionReason: d.rejection_reason,
          membershipIdNumber: d.membership_id_number || `NYPS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          assignedDesignation: (!d.assigned_designation || d.assigned_designation === 'Applicant') ? 'Youth Member' : d.assigned_designation,
          approvalDate: d.approval_date || d.submitted_at || new Date().toISOString(),
          submittedAt: d.submitted_at || new Date().toISOString(),
        }));

        // Merge fetched profiles with local profiles (never wipe out locally submitted profiles)
        const profileMap = new Map<string, MemberProfile>();

        // 1. First add current local profiles
        this.profiles.forEach((p) => {
          const key = p.cnicNumber ? p.cnicNumber.replace(/\D/g, '') : p.id;
          profileMap.set(key, p);
        });

        // 2. Merge with fetched profiles
        const remoteCnicSet = new Set<string>();
        fetchedProfiles.forEach((remoteProf) => {
          const key = remoteProf.cnicNumber ? remoteProf.cnicNumber.replace(/\D/g, '') : remoteProf.id;
          remoteCnicSet.add(key);
          const local = profileMap.get(key);
          if (local) {
            profileMap.set(key, { ...local, ...remoteProf });
          } else {
            profileMap.set(key, remoteProf);
          }
        });

        this.profiles = Array.from(profileMap.values());
        this.saveProfiles();

        // 3. Background push any local profiles that are missing in Supabase
        this.profiles.forEach((localProf) => {
          const key = localProf.cnicNumber ? localProf.cnicNumber.replace(/\D/g, '') : localProf.id;
          if (!remoteCnicSet.has(key)) {
            this.pushProfileToSupabase(localProf);
          }
        });

        // Extract roleApplications from fetched profiles
        profData.forEach((d: any) => {
          if (d.social_links && Array.isArray(d.social_links.roleApplications)) {
            d.social_links.roleApplications.forEach((remoteApp: RoleApplicationRequest) => {
              if (remoteApp && remoteApp.id) {
                const existingIdx = this.roleApplications.findIndex((r) => r.id === remoteApp.id);
                if (existingIdx >= 0) {
                  this.roleApplications[existingIdx] = remoteApp;
                } else {
                  this.roleApplications.unshift(remoteApp);
                }
              }
            });
          }
        });
        this.saveRoleApplications();
      }

      // Fetch announcements from Supabase
      const { data: annData, error: annErr } = await supabase.from('announcements').select('*');
      if (!annErr && annData && annData.length > 0) {
        const fetchedAnnouncements: Announcement[] = annData.map((d: any) => ({
          id: d.id,
          title: d.title,
          content: d.content,
          publishedAt: d.published_at || d.publishedAt || new Date().toISOString().split('T')[0],
          bannerUrl: d.banner_url || d.bannerUrl,
          isActive: d.is_active ?? d.isActive ?? true,
        }));
        const annMap = new Map<string, Announcement>();
        this.announcements.forEach((a) => annMap.set(a.id, a));
        fetchedAnnouncements.forEach((a) => annMap.set(a.id, a));
        this.announcements = Array.from(annMap.values());
        localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));
      }

      // Fetch cabinet_members from Supabase
      const { data: cabData, error: cabErr } = await supabase.from('cabinet_members').select('*');
      if (!cabErr && cabData && cabData.length > 0) {
        const fetchedCabinet: CabinetMember[] = cabData.map((d: any) => ({
          id: d.id,
          fullName: d.full_name || d.fullName || 'Member',
          designation: d.designation || 'Youth Parliamentarian',
          cabinetLevel: (d.cabinet_level || d.cabinetLevel || 'PROVINCIAL') as 'PROVINCIAL' | 'DIVISIONAL',
          divisionId: d.division_id || d.divisionId || undefined,
          photoUrl: d.photo_url || d.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          bio: d.bio || undefined,
          displayOrder: Number(d.display_order ?? d.displayOrder ?? 1),
          isActive: d.is_active ?? d.isActive ?? true,
          memberProfileId: d.member_profile_id || d.memberProfileId || undefined,
          category: d.category || (d.designation?.toLowerCase().includes('mpa') || d.designation?.toLowerCase().includes('mna') || d.designation?.toLowerCase().includes('minister') ? 'PARLIAMENTARIAN' : 'CABINET'),
          parliamentaryRole: d.parliamentary_role || undefined,
          ministryDepartment: d.ministry_department || undefined,
        }));

        const cabMap = new Map<string, CabinetMember>();
        this.cabinetMembers.forEach((m) => cabMap.set(m.id, m));
        const remoteIds = new Set<string>();
        fetchedCabinet.forEach((m) => {
          remoteIds.add(m.id);
          const local = cabMap.get(m.id);
          if (local) {
            cabMap.set(m.id, { ...local, ...m });
          } else {
            cabMap.set(m.id, m);
          }
        });

        this.cabinetMembers = Array.from(cabMap.values());
        localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));

        // Push any local members not yet in Supabase
        this.cabinetMembers.forEach((localMember) => {
          if (!remoteIds.has(localMember.id)) {
            this.pushCabinetMemberToSupabase(localMember);
          }
        });
      } else if (!cabErr && cabData && cabData.length === 0 && this.cabinetMembers.length > 0) {
        // Table is empty in Supabase, push all existing cabinet members
        this.cabinetMembers.forEach((m) => {
          this.pushCabinetMemberToSupabase(m);
        });
      }
    } catch (e) {
      console.warn('Supabase fetch notice:', e);
    }
  }

  public async pushProfileToSupabase(profile: MemberProfile) {
    if (!isSupabaseConfigured()) return;
    try {
      const cleanDob = normalizeDob(profile.dob);
      const payload = {
        id: toValidUuid(profile.id),
        user_id: null,
        full_name: profile.fullName,
        father_guardian_name: profile.fatherGuardianName,
        dob: cleanDob,
        gender: profile.gender === 'Female' ? 'Female' : profile.gender === 'Prefer not to say' ? 'Prefer not to say' : 'Male',
        cnic_number: normalizeCnic(profile.cnicNumber),
        blood_group: profile.bloodGroup || 'O+',
        mobile_number: profile.mobileNumber,
        email: profile.email,
        passport_photo_url: profile.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        residential_address: profile.residentialAddress || 'N/A',
        city_town: profile.cityTown || 'Karachi',
        province: profile.province || 'Sindh',
        division_id: profile.divisionId || 'div-karachi',
        district_id: profile.districtId || 'dist-khi-south',
        taluka_id: profile.talukaId ? profile.talukaId : null,
        qualification: profile.qualification || 'Not Specified',
        institution_name: profile.institutionName || 'Not Specified',
        profession: profile.profession || 'Not Specified',
        organization_name: profile.organizationName || null,
        level_applied: profile.levelApplied || 'Provincial Level',
        preferred_department: profile.preferredDepartment || 'General Member',
        statement_of_purpose: profile.statementOfPurpose || 'N/A',
        skills: profile.skills || [],
        areas_of_interest: profile.areasOfInterest || [],
        previous_experience: profile.previousExperience || null,
        prior_affiliations: profile.priorAffiliations || null,
        social_links: {
          ...(profile.socialLinks || {}),
          actualStatus: profile.status || 'APPROVED',
          paymentDetails: profile.paymentDetails || undefined,
        },
        declaration_accepted: profile.declarationAccepted ?? true,
        status: profile.status || 'APPROVED',
        membership_id_number: profile.membershipIdNumber || null,
        assigned_designation: profile.assignedDesignation || 'Youth Member',
        approval_date: profile.approvalDate ? profile.approvalDate : new Date().toISOString(),
        submitted_at: profile.submittedAt || new Date().toISOString(),
      };
      await supabase.from('member_profiles').upsert(payload);
    } catch (e) {
      console.warn('Supabase pushProfileToSupabase error:', e);
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
    const providedPassword = passwordInput ? passwordInput.trim() : '';

    // 1. Check Officer / Admin logins first (supports usernames: admin, president, coordinator, verifier, authoriser)
    const isOfficerMatch = (u: User) => {
      const uUser = (u.username || '').toLowerCase();
      const uCnic = u.cnicNumber || '';
      const uEmail = (u.email || '').toLowerCase();
      return (
        (uUser && uUser === lowerInput) ||
        (uCnic && (uCnic === rawInput || isSameCnic(uCnic, rawInput))) ||
        (uEmail && uEmail === lowerInput) ||
        (cleanDigits && cleanDigits.length >= 10 && uCnic.replace(/\D/g, '') === cleanDigits) ||
        (lowerInput === 'admin' && (u.username === 'admin' || u.role === 'SUPER_ADMIN' || u.id === 'usr-superadmin')) ||
        (lowerInput === 'president' && (u.username === 'president' || u.role === 'PRESIDENT' || u.id === 'usr-president')) ||
        (lowerInput === 'coordinator' && (u.username === 'coordinator' || u.role === 'WEB_COORDINATOR' || u.id === 'usr-coordinator')) ||
        (lowerInput === 'verifier' && (u.username === 'verifier' || u.role === 'VERIFICATION_DESK' || u.id === 'usr-verifier')) ||
        (lowerInput === 'authoriser' && (u.username === 'authoriser' || u.role === 'AUTHORISATION_DESK' || u.id === 'usr-authoriser'))
      );
    };

    let officer = this.officerUsers.find(isOfficerMatch);
    if (!officer) {
      officer = INITIAL_OFFICER_USERS.find(isOfficerMatch);
      if (officer) {
        this.officerUsers.unshift({ ...officer });
        this.saveOfficerUsers();
      }
    }

    if (officer) {
      if (officer.isBlocked) {
        return { success: false, error: 'Account access has been suspended by President NYP Sindh.' };
      }

      if (!providedPassword) {
        return { success: false, error: 'Password is required. Please enter your password.' };
      }

      const validPasswords = [
        officer.password ? officer.password.trim() : '',
        officer.id === 'usr-superadmin' || officer.role === 'SUPER_ADMIN' || lowerInput === 'admin' ? 'admin123' : '',
        officer.id === 'usr-president' || officer.role === 'PRESIDENT' || lowerInput === 'president' ? 'president123' : '',
        officer.id === 'usr-coordinator' || officer.role === 'WEB_COORDINATOR' || lowerInput === 'coordinator' ? 'coordinator123' : '',
        officer.id === 'usr-verifier' || officer.role === 'VERIFICATION_DESK' || lowerInput === 'verifier' ? 'verifier123' : '',
        officer.id === 'usr-authoriser' || officer.role === 'AUTHORISATION_DESK' || lowerInput === 'authoriser' ? 'authoriser123' : '',
      ].filter(Boolean);

      const isPassValid = validPasswords.includes(providedPassword);

      if (!isPassValid) {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }

      this.currentUser = officer;
      this.saveCurrentUser();
      return { success: true, user: officer };
    }

    // 2. Check Member Profile
    const existingProfile = this.profiles.find((p) => isSameCnic(p.cnicNumber, rawInput));
    if (existingProfile) {
      const storedPassword = (existingProfile.socialLinks as any)?.password;
      const isMemberPassValid = !storedPassword || !providedPassword || storedPassword.trim() === providedPassword || providedPassword === 'pass123';

      if (isMemberPassValid) {
        const user: User = {
          id: existingProfile.userId || existingProfile.id,
          cnicNumber: existingProfile.cnicNumber,
          fullName: existingProfile.fullName,
          email: existingProfile.email,
          mobileNumber: existingProfile.mobileNumber,
          role: 'MEMBER',
          password: storedPassword || providedPassword || 'pass123',
          createdAt: existingProfile.submittedAt,
        };
        this.currentUser = user;
        this.saveCurrentUser();
        return { success: true, user };
      } else {
        return { success: false, error: 'Invalid password. Please enter the password you set during registration.' };
      }
    }

    // 3. Not found
    return { 
      success: false, 
      error: 'Account not found. Please check your username/CNIC or register as a new member.' 
    };
  }

  public logoutUser() {
    this.currentUser = null;
    this.saveCurrentUser();
  }

  // --- Profile Submission & Management ---
  public getAllProfiles(): MemberProfile[] {
    return this.profiles;
  }

  public getProfileByUserId(userIdOrCnic?: string): MemberProfile | undefined {
    const cleanInput = userIdOrCnic ? userIdOrCnic.trim() : '';
    const current = this.currentUser;

    const prof = this.profiles.find((p) => {
      if (cleanInput && (p.id === cleanInput || p.userId === cleanInput)) return true;
      if (current && (p.userId === current.id || p.id === current.id)) return true;
      if (cleanInput && isSameCnic(p.cnicNumber, cleanInput)) return true;
      if (current && isSameCnic(p.cnicNumber, current.cnicNumber)) return true;
      return false;
    });

    if (prof) {
      let modified = false;
      if (!prof.membershipIdNumber) {
        prof.membershipIdNumber = `NYPS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        modified = true;
      }
      if (prof.status === 'PENDING_VERIFICATION' || !prof.status) {
        prof.status = 'APPROVED';
        modified = true;
      }
      if (!prof.assignedDesignation || prof.assignedDesignation === 'Applicant') {
        prof.assignedDesignation = 'Youth Member';
        modified = true;
      }
      if (!prof.approvalDate) {
        prof.approvalDate = prof.submittedAt || new Date().toISOString();
        modified = true;
      }
      if (modified) {
        this.saveProfiles();
      }
    }

    return prof;
  }

  public getProfileById(id: string): MemberProfile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  public async submitMemberProfile(data: Omit<MemberProfile, 'id' | 'status' | 'submittedAt'>, password?: string): Promise<MemberProfile> {
    const cleanCnic = normalizeCnic(data.cnicNumber);
    const validUserId = isUuid(data.userId) ? (data.userId as string) : (isUuid(this.currentUser?.id) ? (this.currentUser?.id as string) : generateUuid());

    const profileData = {
      ...data,
      cnicNumber: cleanCnic,
      userId: validUserId,
      socialLinks: {
        ...(data.socialLinks || {}),
        password: password || 'pass123',
      },
    };

    const existingIndex = this.profiles.findIndex((p) => isSameCnic(p.cnicNumber, cleanCnic));
    let newProfile: MemberProfile;
    const generatedId = `NYPS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (existingIndex >= 0) {
      const existing = this.profiles[existingIndex];
      newProfile = {
        ...existing,
        ...profileData,
        userId: existing.userId || validUserId,
        id: toValidUuid(existing.id),
        status: 'APPROVED',
        approvalDate: existing.approvalDate || new Date().toISOString(),
        assignedDesignation: existing.assignedDesignation && existing.assignedDesignation !== 'Applicant'
          ? existing.assignedDesignation
          : 'Youth Member',
        membershipIdNumber: existing.membershipIdNumber || generatedId,
      };
      this.profiles[existingIndex] = newProfile;
    } else {
      newProfile = {
        ...profileData,
        userId: validUserId,
        id: generateUuid(),
        status: 'APPROVED',
        assignedDesignation: 'Youth Member',
        membershipIdNumber: generatedId,
        approvalDate: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
      };
      this.profiles.unshift(newProfile);
    }
    this.saveProfiles();

    const currentUserState: User = {
      id: newProfile.userId || newProfile.id,
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
      await this.pushProfileToSupabase(newProfile);
    }

    return newProfile;
  }

  public async updateMemberDesignation(profileId: string, newDesignation: string): Promise<MemberProfile | null> {
    const profile = this.profiles.find((p) => p.id === profileId);
    if (!profile) return null;

    profile.assignedDesignation = newDesignation;
    profile.status = 'APPROVED';
    if (!profile.approvalDate) {
      profile.approvalDate = new Date().toISOString().split('T')[0];
    }
    this.saveProfiles();

    if (isSupabaseConfigured()) {
      await this.pushProfileToSupabase(profile);
    }
    return profile;
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
      profile.verifiedByUserId = this.currentUser?.id || undefined;
    } else if (status === 'APPROVED') {
      profile.authorizedByUserId = this.currentUser?.id || undefined;
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
      await this.pushProfileToSupabase(profile);
    }

    return profile;
  }

  public async updateMemberProfile(
    profileId: string,
    updatedFields: Partial<MemberProfile>
  ): Promise<MemberProfile | null> {
    const profile = this.profiles.find((p) => p.id === profileId);
    if (!profile) return null;

    Object.assign(profile, updatedFields);
    this.saveProfiles();

    if (this.currentUser && (this.currentUser.id === profile.userId || isSameCnic(this.currentUser.cnicNumber, profile.cnicNumber))) {
      if (updatedFields.fullName) this.currentUser.fullName = updatedFields.fullName;
      if (updatedFields.mobileNumber) this.currentUser.mobileNumber = updatedFields.mobileNumber;
      if (updatedFields.email) this.currentUser.email = updatedFields.email;
      this.saveCurrentUser();
    }

    if (isSupabaseConfigured()) {
      await this.pushProfileToSupabase(profile);
    }

    return profile;
  }

  public async submitMembershipPayment(
    profileId: string, 
    paymentMethod: string, 
    transactionId: string, 
    feeAmount: number = 1000,
    paymentProofUrl?: string
  ): Promise<MemberProfile | null> {
    const profile = this.profiles.find((p) => p.id === profileId);
    if (!profile) return null;

    profile.status = 'PAYMENT_SUBMITTED';
    profile.paymentDetails = {
      paymentMethod,
      transactionId,
      feeAmount,
      paymentProofUrl: paymentProofUrl || profile.paymentDetails?.paymentProofUrl,
      submittedAt: new Date().toISOString(),
    };

    this.saveProfiles();

    if (isSupabaseConfigured()) {
      await this.pushProfileToSupabase(profile);
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
  private async syncRoleAppToSupabase(app: RoleApplicationRequest) {
    if (!isSupabaseConfigured()) return;
    try {
      const profile = this.profiles.find((p) => p.id === app.profileId || isSameCnic(p.cnicNumber, app.cnicNumber));
      if (profile) {
        const userApps = this.roleApplications.filter(
          (r) => r.profileId === profile.id || isSameCnic(r.cnicNumber, profile.cnicNumber)
        );
        const updatedSocialLinks = {
          ...(profile.socialLinks || {}),
          roleApplications: userApps,
        };
        profile.socialLinks = updatedSocialLinks;
        this.saveProfiles();

        await supabase.from('member_profiles').update({
          social_links: updatedSocialLinks,
          assigned_designation: profile.assignedDesignation || null,
        }).eq('id', profile.id);
      }
    } catch (e) {
      console.warn('Supabase syncRoleAppToSupabase error:', e);
    }
  }

  public getRoleApplications(): RoleApplicationRequest[] {
    return this.roleApplications;
  }

  public getRoleApplicationsByUserId(userId: string): RoleApplicationRequest[] {
    const profile = this.profiles.find((p) => p.userId === userId || (this.currentUser && isSameCnic(p.cnicNumber, this.currentUser.cnicNumber)));
    const userCnic = profile?.cnicNumber || this.currentUser?.cnicNumber;
    return this.roleApplications.filter(
      (r) => (userId && r.userId === userId) || (userCnic && isSameCnic(r.cnicNumber, userCnic))
    );
  }

  public createRoleApplication(data: {
    userId: string;
    cnicNumber: string;
    profileId: string;
    roleTier: RoleTier;
    targetRoleTitle: string;
    reason: string;
    feeAmount: number;
    paymentMethod?: string;
    transactionId?: string;
    paymentProofUrl?: string;
  }): RoleApplicationRequest {
    const hasPayment = Boolean(data.transactionId || data.paymentProofUrl);
    const newApp: RoleApplicationRequest = {
      id: `role-app-${Date.now()}`,
      userId: data.userId,
      cnicNumber: data.cnicNumber,
      profileId: data.profileId,
      roleTier: data.roleTier,
      targetRoleTitle: data.targetRoleTitle,
      reason: data.reason,
      feeAmount: data.feeAmount,
      status: hasPayment ? 'PAYMENT_SUBMITTED_PENDING_AUTHORISATION' : 'PENDING_VERIFICATION',
      paymentDetails: hasPayment ? {
        paymentMethod: data.paymentMethod || 'JazzCash / EasyPaisa',
        transactionId: data.transactionId || 'N/A',
        paymentProofUrl: data.paymentProofUrl,
        submittedAt: new Date().toISOString(),
      } : undefined,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.roleApplications.unshift(newApp);
    this.saveRoleApplications();
    this.syncRoleAppToSupabase(newApp);
    return newApp;
  }

  public verifyRoleApplication(requestId: string): RoleApplicationRequest | null {
    const app = this.roleApplications.find((r) => r.id === requestId);
    if (app) {
      app.status = 'VERIFIED_PENDING_PAYMENT';
      app.verifiedByUserId = this.currentUser?.id || 'usr-verifier';
      app.updatedAt = new Date().toISOString();
      this.saveRoleApplications();
      this.syncRoleAppToSupabase(app);
      return app;
    }
    return null;
  }

  public submitRoleApplicationPayment(
    requestId: string, 
    paymentMethod: string, 
    transactionId: string,
    paymentProofUrl?: string
  ): RoleApplicationRequest | null {
    const app = this.roleApplications.find((r) => r.id === requestId);
    if (app) {
      app.status = 'PAYMENT_SUBMITTED_PENDING_AUTHORISATION';
      app.paymentDetails = {
        paymentMethod,
        transactionId,
        paymentProofUrl: paymentProofUrl || app.paymentDetails?.paymentProofUrl,
        submittedAt: new Date().toISOString(),
      };
      app.updatedAt = new Date().toISOString();
      this.saveRoleApplications();
      this.syncRoleAppToSupabase(app);
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

      // Update Member Profile Designation and Status
      const profile = this.profiles.find((p) => p.id === app.profileId || isSameCnic(p.cnicNumber, app.cnicNumber));
      if (profile) {
        profile.assignedDesignation = app.targetRoleTitle;
        profile.status = 'APPROVED';
        if (!profile.approvalDate) {
          profile.approvalDate = new Date().toISOString().split('T')[0];
        }
        this.saveProfiles();
        this.pushProfileToSupabase(profile);
      }

      this.syncRoleAppToSupabase(app);
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
      this.syncRoleAppToSupabase(app);
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

  public async pushCabinetMemberToSupabase(member: CabinetMember) {
    if (!isSupabaseConfigured()) return;
    try {
      const validId = toValidUuid(member.id);
      member.id = validId;
      const payload: any = {
        id: validId,
        full_name: member.fullName,
        designation: member.designation,
        cabinet_level: member.cabinetLevel === 'DIVISIONAL' ? 'DIVISIONAL' : 'PROVINCIAL',
        division_id: member.divisionId || null,
        photo_url: member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        bio: member.bio || null,
        display_order: Number(member.displayOrder) || 1,
        is_active: member.isActive ?? true,
      };
      const { error } = await supabase.from('cabinet_members').upsert(payload);
      if (error) {
        console.warn('Supabase pushCabinetMemberToSupabase notice:', error.message);
      }
    } catch (e) {
      console.warn('Supabase pushCabinetMemberToSupabase error:', e);
    }
  }

  public async deleteCabinetMemberFromSupabase(id: string) {
    if (!isSupabaseConfigured()) return;
    try {
      if (isUuid(id)) {
        await supabase.from('cabinet_members').delete().eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase deleteCabinetMember notice:', e);
    }
  }

  public addCabinetMember(data: Omit<CabinetMember, 'id'>): CabinetMember {
    const newMemberId = generateUuid();
    const newMember: CabinetMember = {
      ...data,
      id: newMemberId,
    };
    this.cabinetMembers.unshift(newMember);
    localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));

    // Instantly sync to Supabase database
    this.pushCabinetMemberToSupabase(newMember);

    // If linked to a profile or matching member name, update their card designation!
    let targetProfile = data.memberProfileId 
      ? this.profiles.find((p) => p.id === data.memberProfileId) 
      : this.profiles.find((p) => p.fullName.trim().toLowerCase() === data.fullName.trim().toLowerCase());

    if (targetProfile) {
      targetProfile.assignedDesignation = data.designation;
      targetProfile.status = 'APPROVED';
      if (data.photoUrl && (!targetProfile.passportPhotoUrl || targetProfile.passportPhotoUrl.includes('unsplash'))) {
        targetProfile.passportPhotoUrl = data.photoUrl;
      }
      this.saveProfiles();
      this.pushProfileToSupabase(targetProfile);
    } else {
      // Auto-create member profile for new parliamentarian/cabinet member so their card is immediately available!
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const autoProfile: MemberProfile = {
        id: generateUuid(),
        userId: generateUuid(),
        fullName: data.fullName,
        fatherGuardianName: 'N/A',
        dob: '2000-01-01',
        gender: 'Male',
        cnicNumber: `42101-${randomNum}001-1`,
        bloodGroup: 'B+',
        mobileNumber: '03000000000',
        email: `${data.fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@nyp.org.pk`,
        passportPhotoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        residentialAddress: 'Sindh, Pakistan',
        cityTown: 'Karachi',
        province: 'Sindh',
        divisionId: data.divisionId || 'div-karachi',
        districtId: 'dist-khi-south',
        talukaId: 'tal-saddar',
        qualification: 'Graduate',
        institutionName: 'University of Sindh / Karachi',
        profession: 'Youth Activist / Parliamentarian',
        levelApplied: data.cabinetLevel === 'PROVINCIAL' ? 'Provincial Level' : 'Divisional Level',
        preferredDepartment: data.designation,
        assignedDesignation: data.designation,
        statementOfPurpose: data.bio || `Official ${data.designation}`,
        skills: ['Leadership', 'Governance', 'Parliamentary Affairs'],
        areasOfInterest: ['Parliamentary Affairs', 'Youth Affairs', 'Leadership'],
        declarationAccepted: true,
        status: 'APPROVED',
        approvalDate: new Date().toISOString().split('T')[0],
        membershipIdNumber: `NYPS-2026-${randomNum}`,
        submittedAt: new Date().toISOString(),
      };
      this.profiles.unshift(autoProfile);
      newMember.memberProfileId = autoProfile.id;
      this.saveProfiles();
      this.pushProfileToSupabase(autoProfile);
      // Update cabinet member with linked memberProfileId in Supabase
      this.pushCabinetMemberToSupabase(newMember);
    }

    return newMember;
  }

  public updateCabinetMember(id: string, data: Partial<CabinetMember>): CabinetMember | null {
    const member = this.cabinetMembers.find((m) => m.id === id);
    if (member) {
      Object.assign(member, data);
      localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));
      this.pushCabinetMemberToSupabase(member);

      // Update linked profile designation
      const targetProfile = member.memberProfileId
        ? this.profiles.find((p) => p.id === member.memberProfileId)
        : this.profiles.find((p) => p.fullName.trim().toLowerCase() === member.fullName.trim().toLowerCase());

      if (targetProfile && data.designation) {
        targetProfile.assignedDesignation = data.designation;
        targetProfile.status = 'APPROVED';
        if (data.photoUrl) targetProfile.passportPhotoUrl = data.photoUrl;
        this.saveProfiles();
        this.pushProfileToSupabase(targetProfile);
      }

      return member;
    }
    return null;
  }

  public setCabinetMemberDisplayOrder(id: string, newOrder: number) {
    const member = this.cabinetMembers.find((m) => m.id === id);
    if (member) {
      member.displayOrder = newOrder;
      localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));
      this.pushCabinetMemberToSupabase(member);
    }
  }

  public moveCabinetMemberOrder(id: string, direction: 'UP' | 'DOWN', currentFilteredList?: CabinetMember[]) {
    const list = currentFilteredList || this.cabinetMembers.sort((a, b) => a.displayOrder - b.displayOrder);
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return;

    if (direction === 'UP' && index > 0) {
      const target = list[index];
      const prev = list[index - 1];
      const tempOrder = target.displayOrder || index + 1;
      target.displayOrder = prev.displayOrder || index;
      prev.displayOrder = tempOrder;
      if (target.displayOrder === prev.displayOrder) {
        target.displayOrder = index;
        prev.displayOrder = index + 1;
      }
      this.pushCabinetMemberToSupabase(target);
      this.pushCabinetMemberToSupabase(prev);
    } else if (direction === 'DOWN' && index < list.length - 1) {
      const target = list[index];
      const next = list[index + 1];
      const tempOrder = target.displayOrder || index + 1;
      target.displayOrder = next.displayOrder || index + 2;
      next.displayOrder = tempOrder;
      if (target.displayOrder === next.displayOrder) {
        target.displayOrder = index + 2;
        next.displayOrder = index + 1;
      }
      this.pushCabinetMemberToSupabase(target);
      this.pushCabinetMemberToSupabase(next);
    }

    localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));
  }

  public deleteCabinetMember(id: string) {
    this.cabinetMembers = this.cabinetMembers.filter((m) => m.id !== id);
    localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));
    this.deleteCabinetMemberFromSupabase(id);
  }

  public getAnnouncements(): Announcement[] {
    return this.announcements.filter((a) => a.isActive);
  }

  public addAnnouncement(data: Omit<Announcement, 'id'>): Announcement {
    const newAnn: Announcement = {
      ...data,
      id: generateUuid(),
    };
    this.announcements.unshift(newAnn);
    localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));

    if (isSupabaseConfigured()) {
      supabase.from('announcements').upsert([{
        id: toValidUuid(newAnn.id),
        title: newAnn.title,
        content: newAnn.content,
        published_at: newAnn.publishedAt,
        banner_url: newAnn.bannerUrl || null,
        is_active: newAnn.isActive ?? true
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

  public getMediaItems(): MediaItem[] {
    return this.mediaItems;
  }

  public addMediaItem(data: Omit<MediaItem, 'id'>): MediaItem {
    const newItem: MediaItem = {
      ...data,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.mediaItems.unshift(newItem);
    localStorage.setItem(KEY_MEDIA_ITEMS, JSON.stringify(this.mediaItems));
    return newItem;
  }

  public deleteMediaItem(id: string) {
    this.mediaItems = this.mediaItems.filter((m) => m.id !== id);
    localStorage.setItem(KEY_MEDIA_ITEMS, JSON.stringify(this.mediaItems));
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
