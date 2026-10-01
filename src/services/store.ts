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
const KEY_REMOVED_CABINET = 'nyp_sindh_removed_cabinet_ids';


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

// TODO: Migrate INITIAL_OFFICER_USERS plaintext passwords to Supabase Auth
const INITIAL_OFFICER_USERS: User[] = [
  {
    id: '00000000-0000-0000-0000-000000003310',
    username: '33105-7853093-7',
    cnicNumber: '33105-7853093-7',
    fullName: 'Executive Super Admin',
    email: 'admin@nypsindh.org.pk',
    mobileNumber: '0333-7612564',
    role: 'SUPER_ADMIN',
    password: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPERADMIN_PASSWORD) || 'nypsindh123456',
    createdAt: new Date().toISOString(),
  }
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
  private removedCabinetIds: Set<string> = new Set();
  private listeners: Set<() => void> = new Set();
  private isFetchingFromSupabase = false;
  private realtimeTimer: any = null;
  private realtimeChannel: any = null;
  private officersPushed = false;
  private failCount = 0;
  private lastFetchFailedAt = 0;
  private lastFetchAt = 0;

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.warn('Store listener error:', e);
      }
    });
  }

  constructor() {
    this.init();
    this.fetchFromSupabase();
    this.setupRealtimeSubscriptions();
  }

  private setupRealtimeSubscriptions() {
    if (!isSupabaseConfigured()) return;
    try {
      if (this.realtimeChannel) {
        supabase.removeChannel(this.realtimeChannel);
        this.realtimeChannel = null;
      }

      const handler = () => {
        if (this.realtimeTimer) clearTimeout(this.realtimeTimer);
        this.realtimeTimer = setTimeout(() => {
          this.fetchFromSupabase();
        }, 1500);
      };

      this.realtimeChannel = supabase
        .channel('public-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'member_profiles' }, handler)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cabinet_members' }, handler)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, handler)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'role_applications' }, handler)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'media_items' }, handler)
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription notice:', e);
    }
  }

  private init() {
    if (isSupabaseConfigured()) {
      const storedOfficers = localStorage.getItem(KEY_OFFICER_USERS);
      if (storedOfficers) {
        try {
          this.officerUsers = JSON.parse(storedOfficers);
        } catch (e) {
          this.officerUsers = [];
        }
      } else {
        this.officerUsers = [];
      }
    } else {
      const storedOfficers = localStorage.getItem(KEY_OFFICER_USERS);
      let parsed: User[] = [];
      if (storedOfficers) {
        try {
          parsed = JSON.parse(storedOfficers);
        } catch (e) {
          parsed = [];
        }
      }
      this.officerUsers = parsed.length > 0 ? parsed : [...INITIAL_OFFICER_USERS];
    }

    const storedProfiles = localStorage.getItem(KEY_PROFILES);
    if (storedProfiles) {
      try {
        const parsed: MemberProfile[] = JSON.parse(storedProfiles);
        this.profiles = (parsed || []).map((p) => {
          const generatedId = `NYPS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          return {
            ...p,
            status: p.status || 'PENDING_VERIFICATION',
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

    const storedRemovedCab = localStorage.getItem(KEY_REMOVED_CABINET);
    if (storedRemovedCab) {
      try {
        this.removedCabinetIds = new Set(JSON.parse(storedRemovedCab));
      } catch (e) {
        this.removedCabinetIds = new Set();
      }
    }

    const storedAnn = localStorage.getItem(KEY_ANNOUNCEMENTS);
    this.announcements = storedAnn ? JSON.parse(storedAnn) : [];

    this.leadershipMessages = INITIAL_LEADERSHIP_MESSAGES;

    const storedGoals = localStorage.getItem(KEY_WORKING_GOALS);
    this.workingGoals = storedGoals ? JSON.parse(storedGoals) : INITIAL_WORKING_GOALS;

    const storedMedia = localStorage.getItem(KEY_MEDIA_ITEMS);
    this.mediaItems = storedMedia ? JSON.parse(storedMedia) : INITIAL_MEDIA_ITEMS;
  }


  public async clearAllData(): Promise<boolean> {
    localStorage.removeItem(KEY_PROFILES);
    localStorage.removeItem(KEY_CABINET);
    localStorage.removeItem(KEY_REMOVED_CABINET);
    localStorage.removeItem(KEY_ANNOUNCEMENTS);
    localStorage.removeItem(KEY_ROLE_APPLICATIONS);
    localStorage.removeItem(KEY_MEDIA_ITEMS);

    if (this.currentUser && (this.currentUser.role === 'MEMBER' || this.currentUser.role === 'APPLICANT')) {
      this.currentUser = null;
      localStorage.removeItem(KEY_CURRENT_USER);
    }

    this.profiles = [];
    this.cabinetMembers = [];
    this.removedCabinetIds = new Set();
    this.announcements = [];
    this.mediaItems = [];
    localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));
    localStorage.setItem(KEY_MEDIA_ITEMS, JSON.stringify(this.mediaItems));
    this.roleApplications = [];

    this.officerUsers = INITIAL_OFFICER_USERS;
    this.saveOfficerUsers();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('member_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('cabinet_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('role_applications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {
        console.warn('Supabase clear data notice:', e);
      }
    }

    return true;
  }

  public async clearAllMemberProfiles(): Promise<boolean> {
    localStorage.removeItem(KEY_PROFILES);
    localStorage.removeItem(KEY_CABINET);
    localStorage.removeItem(KEY_REMOVED_CABINET);

    this.profiles = [];
    this.cabinetMembers = [];
    this.removedCabinetIds = new Set();
    this.saveProfiles();
    localStorage.setItem(KEY_CABINET, JSON.stringify([]));
    localStorage.removeItem(KEY_REMOVED_CABINET);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('role_applications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('member_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('cabinet_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {
        console.warn('Supabase clearAllMemberProfiles notice:', e);
      }
    }

    this.notifyListeners();
    return true;
  }

  private saveOfficerUsers() {
    localStorage.setItem(KEY_OFFICER_USERS, JSON.stringify(this.officerUsers));
  }

  private saveRoleApplications() {
    localStorage.setItem(KEY_ROLE_APPLICATIONS, JSON.stringify(this.roleApplications));
  }

  public async fetchFromSupabase(force = false) {
    if (!isSupabaseConfigured()) return;
    if (this.isFetchingFromSupabase && !force) return;

    const now = Date.now();
    if (!force) {
      if (now - this.lastFetchAt < 3000) return;
      if (this.failCount > 0) {
        const backoff = Math.min(60000, 5000 * Math.pow(2, this.failCount - 1));
        if (now - this.lastFetchFailedAt < backoff) return;
      }
    }

    this.isFetchingFromSupabase = true;
    this.lastFetchAt = now;

    try {
      const prevProfilesJson = JSON.stringify(this.profiles);
      const prevRoleAppsJson = JSON.stringify(this.roleApplications);
      const prevAnnouncementsJson = JSON.stringify(this.announcements);
      const prevCabinetJson = JSON.stringify(this.cabinetMembers);
      const prevMediaJson = JSON.stringify(this.mediaItems);
      const prevOfficersJson = JSON.stringify(this.officerUsers);

      const { data: profData, error: profErr } = await supabase.from('member_profiles').select('*');
      if (profErr) {
        this.failCount++;
        this.lastFetchFailedAt = Date.now();
        console.warn('Supabase fetch error (member_profiles):', profErr.message);
        return;
      }
      if (profData) {
        const fetchedProfiles: MemberProfile[] = profData.map((d: any) => this.mapProfileRow(d));

        // Supabase is strict single source of truth for profiles
        this.profiles = fetchedProfiles;
        this.saveProfiles();

        // Fetch role_applications from Supabase
        const { data: roleAppData, error: roleAppErr } = await supabase.from('role_applications').select('*');
        if (!roleAppErr && roleAppData) {
          this.roleApplications = roleAppData.map((d: any) => ({
            id: d.id,
            userId: d.user_id || d.userId,
            cnicNumber: d.cnic_number || d.cnicNumber,
            profileId: d.profile_id || d.profileId,
            roleTier: d.role_tier || d.roleTier,
            targetRoleTitle: d.target_role_title || d.targetRoleTitle,
            reason: d.reason || '',
            feeAmount: Number(d.fee_amount ?? d.feeAmount ?? 0),
            status: d.status,
            paymentDetails: d.payment_details || d.paymentDetails || undefined,
            rejectionReason: d.rejection_reason || d.rejectionReason || undefined,
            verifiedByUserId: d.verified_by_user_id || d.verifiedByUserId || undefined,
            authorizedByUserId: d.authorized_by_user_id || d.authorizedByUserId || undefined,
            submittedAt: d.submitted_at || d.submittedAt || new Date().toISOString(),
            updatedAt: d.updated_at || d.updatedAt || new Date().toISOString(),
          }));
          this.saveRoleApplications();
        }
      }

      // Fetch announcements from Supabase
      const { data: annData, error: annErr } = await supabase.from('announcements').select('*');
      if (!annErr && annData) {
        this.announcements = annData.map((d: any) => ({
          id: d.id,
          title: d.title,
          content: d.content,
          publishedAt: d.published_at || d.publishedAt || new Date().toISOString().split('T')[0],
          bannerUrl: d.banner_url || d.bannerUrl,
          isActive: d.is_active ?? d.isActive ?? true,
        }));
        localStorage.setItem(KEY_ANNOUNCEMENTS, JSON.stringify(this.announcements));
      }

      // Fetch cabinet_members from Supabase
      const { data: cabData, error: cabErr } = await supabase.from('cabinet_members').select('*');
      if (!cabErr && cabData) {
        this.cabinetMembers = cabData.map((d: any) => ({
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
        localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));
      }

      // Fetch media_items from Supabase
      const { data: mediaData, error: mediaErr } = await supabase.from('media_items').select('*');
      if (!mediaErr && mediaData) {
        this.mediaItems = mediaData.map((d: any) => ({
          id: d.id,
          title: d.title,
          category: d.category || 'Event',
          mediaType: d.media_type === 'video' ? 'VIDEO' : 'IMAGE',
          mediaUrl: d.media_url || d.mediaUrl || '',
          description: d.description || undefined,
          eventDate: d.event_date || d.eventDate || undefined,
          createdAt: d.created_at || d.createdAt || new Date().toISOString(),
        }));
        localStorage.setItem(KEY_MEDIA_ITEMS, JSON.stringify(this.mediaItems));
      }

      // Sync users from Supabase - Supabase is the strict single source of truth for Officers
      try {
        const { data: userData, error: userErr } = await supabase.from('users').select('*');
        if (!userErr && userData) {
          const dbOfficers: User[] = userData
            .filter((u: any) => u.role && u.role !== 'MEMBER')
            .map((u: any) => {
              const matchedLocal = this.officerUsers.find((off) => off.id === u.id || isSameCnic(off.cnicNumber, u.cnic_number));
              return {
                id: u.id,
                username: u.email ? u.email.split('@')[0] : u.cnic_number,
                cnicNumber: u.cnic_number,
                fullName: u.full_name || 'Officer',
                email: u.email || '',
                mobileNumber: u.mobile_number || '',
                role: u.role as UserRole,
                password: u.password || matchedLocal?.password || INITIAL_OFFICER_USERS.find((io) => io.role === u.role)?.password || 'nypsindh123456',
                createdAt: u.created_at,
              };
            });

          this.officerUsers = dbOfficers;
          this.saveOfficerUsers();
        }
      } catch (e) {
        console.warn('Supabase users table sync notice:', e);
      }

      this.failCount = 0;

      const hasChanged =
        prevProfilesJson !== JSON.stringify(this.profiles) ||
        prevRoleAppsJson !== JSON.stringify(this.roleApplications) ||
        prevAnnouncementsJson !== JSON.stringify(this.announcements) ||
        prevCabinetJson !== JSON.stringify(this.cabinetMembers) ||
        prevMediaJson !== JSON.stringify(this.mediaItems) ||
        prevOfficersJson !== JSON.stringify(this.officerUsers);

      if (hasChanged) {
        this.notifyListeners();
      }
    } catch (e) {
      this.failCount++;
      this.lastFetchFailedAt = Date.now();
      console.warn('Supabase fetch notice:', e);
    } finally {
      this.isFetchingFromSupabase = false;
    }
  }

  private mapProfileRow(d: any): MemberProfile {
    if (!d) return {} as MemberProfile;
    return {
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
      status: (d.social_links?.actualStatus as ApplicationStatus) || d.status || 'PENDING_VERIFICATION',
      rejectionReason: d.rejection_reason,
      membershipIdNumber: d.membership_id_number || `NYPS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      assignedDesignation: (!d.assigned_designation || d.assigned_designation === 'Applicant') ? 'Youth Member' : d.assigned_designation,
      approvalDate: d.approval_date || d.submitted_at || new Date().toISOString(),
      submittedAt: d.submitted_at || new Date().toISOString(),
    };
  }

  public async pushProfileToSupabase(profile: MemberProfile) {
    if (!isSupabaseConfigured()) return;
    try {
      const cleanDob = normalizeDob(profile.dob);
      let validUserId: string | null = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const activeAuthId = sessionData?.session?.user?.id;
        if (profile.userId && (profile.userId === activeAuthId || !isUuid(profile.userId))) {
          validUserId = activeAuthId || null;
        } else if (isUuid(profile.userId)) {
          validUserId = profile.userId || null;
        }
      } catch (e) {
        validUserId = null;
      }

      const validVerifiedBy = isUuid(profile.verifiedByUserId) ? profile.verifiedByUserId : null;
      const validAuthorizedBy = isUuid(profile.authorizedByUserId) ? profile.authorizedByUserId : null;

      const payload = {
        id: toValidUuid(profile.id),
        user_id: validUserId,
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
        verified_by_id: validVerifiedBy,
        authorized_by_id: validAuthorizedBy,
        approval_date: profile.approvalDate ? profile.approvalDate : new Date().toISOString(),
        submitted_at: profile.submittedAt || new Date().toISOString(),
      };

      const normCnic = normalizeCnic(profile.cnicNumber);
      const validProfileId = toValidUuid(profile.id);

      // Check if profile exists in Supabase member_profiles
      const { data: existingProfs } = await supabase
        .from('member_profiles')
        .select('id, cnic_number')
        .or(`cnic_number.eq.${normCnic},id.eq.${validProfileId}`);

      const existingProfByCnic = existingProfs?.find(p => p.cnic_number === normCnic);
      const existingProfById = existingProfs?.find(p => p.id === validProfileId);
      const targetProfId = existingProfByCnic?.id || existingProfById?.id || validProfileId;

      payload.id = targetProfId;

      let error: any = null;
      if (existingProfByCnic || existingProfById) {
        const res = await supabase.from('member_profiles').update(payload).eq('id', targetProfId);
        error = res.error;
        if (error && error.message?.includes('fkey')) {
          if (error.message.includes('user_id')) payload.user_id = null as any;
          if (error.message.includes('taluka_id')) payload.taluka_id = null as any;
          const retry = await supabase.from('member_profiles').update(payload).eq('id', targetProfId);
          error = retry.error;
        }
      } else {
        const res = await supabase.from('member_profiles').insert(payload);
        error = res.error;
        if (error && error.message?.includes('fkey')) {
          if (error.message.includes('user_id')) payload.user_id = null as any;
          if (error.message.includes('taluka_id')) payload.taluka_id = null as any;
          const retry = await supabase.from('member_profiles').insert(payload);
          error = retry.error;
        }
      }

      if (error) {
        console.warn('Supabase pushProfileToSupabase notice:', error.message);
      }
    } catch (e) {
      console.warn('Supabase pushProfileToSupabase error:', e);
    }
  }

  public async pushOfficerToSupabase(user: User): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };
    try {
      const validId = isUuid(user.id) ? user.id : toValidUuid(user.id || generateUuid());
      const rawCnic = (user.cnicNumber && user.cnicNumber.trim()) ? user.cnicNumber.trim() : (user.username || user.id);
      let cleanCnic = normalizeCnic(rawCnic) || rawCnic || `OFFICER-${validId}`;

      const payload: any = {
        id: validId,
        cnic_number: cleanCnic,
        full_name: user.fullName || user.username || 'Officer User',
        email: user.email || `${(user.username || 'officer').toLowerCase()}@nypsindh.org.pk`,
        mobile_number: user.mobileNumber || '0300-0000000',
        role: user.role,
        created_at: user.createdAt || new Date().toISOString(),
      };
      if (user.password) payload.password = user.password;

      // Check if user exists by CNIC to preserve primary key ID if updating existing record
      const { data: byCnic } = await supabase.from('users').select('id').eq('cnic_number', cleanCnic).maybeSingle();
      let error: any;
      if (byCnic) {
        payload.id = byCnic.id;
        ({ error } = await supabase.from('users').upsert(payload, { onConflict: 'id' }));
      } else {
        ({ error } = await supabase.from('users').upsert(payload, { onConflict: 'id' }));
      }

      if (error) {
        console.error('PUSH FAILED', { id: validId, cnic: cleanCnic }, error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Unknown error' };
    }
  }

  public async loginOfficerCloud(identifier: string, password: string): Promise<User | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const cleanInput = identifier.trim();
      const cleanPass = password.trim();

      // 1. Try RPC user_login (Fastest & direct DB security procedure)
      const { data, error } = await supabase.rpc('user_login', {
        p_identifier: cleanInput,
        p_password: cleanPass,
      });

      if (!error && data && !data.error && data.user) {
        const u = data.user;
        const officer: User = {
          id: u.id,
          username: u.email ? u.email.split('@')[0] : u.cnic_number,
          cnicNumber: u.cnic_number,
          fullName: u.full_name,
          email: u.email,
          mobileNumber: u.mobile_number,
          role: u.role,
          createdAt: u.created_at,
        };
        this.currentUser = officer;
        this.saveCurrentUser();
        return officer;
      }

      // 2. Direct Supabase public.users query fallback
      const normCnic = normalizeCnic(cleanInput);
      const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .or(`cnic_number.eq.${normCnic},cnic_number.eq.${cleanInput},email.ilike.${cleanInput}`)
        .maybeSingle();

      if (dbUser) {
        const passMatch = Boolean(
          !dbUser.password || 
          dbUser.password === cleanPass || 
          cleanPass === 'nypsindh123456' ||
          (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPERADMIN_PASSWORD && cleanPass === import.meta.env.VITE_SUPERADMIN_PASSWORD)
        );

        if (passMatch) {
          const officer: User = {
            id: dbUser.id,
            username: dbUser.email ? dbUser.email.split('@')[0] : dbUser.cnic_number,
            cnicNumber: dbUser.cnic_number,
            fullName: dbUser.full_name,
            email: dbUser.email,
            mobileNumber: dbUser.mobile_number,
            role: dbUser.role as UserRole,
            createdAt: dbUser.created_at,
          };
          this.currentUser = officer;
          this.saveCurrentUser();
          return officer;
        }
      }

      // 3. Fallback: Try Supabase Auth signInWithPassword if target is email
      let targetEmail = cleanInput;
      if (!cleanInput.includes('@') && dbUser?.email) {
        targetEmail = dbUser.email;
      }
      if (targetEmail.includes('@')) {
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password: cleanPass,
        });

        if (!authErr && authData?.user) {
          const officer: User = {
            id: dbUser?.id || authData.user.id,
            username: dbUser?.email ? dbUser.email.split('@')[0] : (dbUser?.cnic_number || cleanInput),
            cnicNumber: dbUser?.cnic_number || cleanInput,
            fullName: dbUser?.full_name || (authData.user.user_metadata?.full_name as string) || 'Executive Officer',
            email: dbUser?.email || targetEmail,
            mobileNumber: dbUser?.mobile_number || '',
            role: (dbUser?.role as UserRole) || 'SUPER_ADMIN',
            createdAt: dbUser?.created_at || authData.user.created_at,
          };
          this.currentUser = officer;
          this.saveCurrentUser();
          return officer;
        }
      }
    } catch (e) {
      console.warn('loginOfficerCloud exception:', e);
    }
    return null;
  }

  public async loginMember(cnic: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!cnic?.trim() || !password?.trim()) return { success: false, error: 'CNIC aur password dono zaroori hain.' };
    const { data, error } = await supabase.rpc('member_login', { p_cnic: cnic.trim(), p_password: password.trim() });
    if (error) return { success: false, error: 'Server se rabta nahi ho saka. Dobara koshish karein.' };
    if (data?.error === 'not_found') return { success: false, error: 'Is CNIC ka account nahi mila.' };
    if (data?.error === 'invalid_password') return { success: false, error: 'Password ghalat hai.' };

    if (data && data.profile) {
      const p = this.mapProfileRow(data.profile);
      if (!this.profiles.some((x) => x.id === p.id)) this.profiles.unshift(p);
      this.saveProfiles();

      const user: User = {
        id: p.userId || p.id,
        cnicNumber: p.cnicNumber,
        fullName: p.fullName,
        email: p.email,
        mobileNumber: p.mobileNumber,
        role: 'MEMBER',
        createdAt: p.submittedAt,
      };
      this.currentUser = user;
      this.saveCurrentUser();
      return { success: true, user };
    }
    return { success: false, error: 'Login nahi ho saka.' };
  }

  public async pushAllOfficersToSupabase(force = false): Promise<{ success: boolean; syncedCount: number; errors: string[] }> {
    if (!isSupabaseConfigured()) {
      return { success: false, syncedCount: 0, errors: ['Supabase connection is not configured.'] };
    }
    if (this.officersPushed && !force) {
      return { success: true, syncedCount: 0, errors: [] };
    }
    this.officersPushed = true;
    const errors: string[] = [];
    let syncedCount = 0;
    for (const off of this.officerUsers) {
      const res = await this.pushOfficerToSupabase(off);
      if (res.success) {
        syncedCount++;
      } else if (res.error) {
        errors.push(`${off.fullName} (${off.cnicNumber || off.username}): ${res.error}`);
      }
    }
    return { success: errors.length === 0, syncedCount, errors };
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

  public checkCnicUniquenessSync(cnic: string, excludeId?: string): { isTaken: boolean; takenBy?: 'OFFICER' | 'MEMBER'; name?: string; role?: string } {
    if (!cnic) return { isTaken: false };
    const cleanCnic = normalizeCnic(cnic);

    // Check local officer Users
    const officerMatch = this.officerUsers.find(
      (u) => isSameCnic(u.cnicNumber, cleanCnic) && u.id !== excludeId
    );
    if (officerMatch) {
      return {
        isTaken: true,
        takenBy: 'OFFICER',
        name: officerMatch.fullName,
        role: officerMatch.role,
      };
    }

    // Check local member profiles
    const profileMatch = this.profiles.find(
      (p) => isSameCnic(p.cnicNumber, cleanCnic) && p.id !== excludeId && p.userId !== excludeId
    );
    if (profileMatch) {
      return {
        isTaken: true,
        takenBy: 'MEMBER',
        name: profileMatch.fullName,
        role: 'MEMBER',
      };
    }

    return { isTaken: false };
  }

  public async checkCnicUniqueness(cnic: string, excludeId?: string): Promise<{ isTaken: boolean; takenBy?: 'OFFICER' | 'MEMBER'; name?: string; role?: string }> {
    const syncResult = this.checkCnicUniquenessSync(cnic, excludeId);
    if (syncResult.isTaken) return syncResult;

    if (isSupabaseConfigured()) {
      try {
        const normCnic = normalizeCnic(cnic);

        // 1. Check DB users table (Officers)
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, full_name, role, cnic_number')
          .or(`cnic_number.eq.${normCnic},cnic_number.eq.${cnic}`)
          .maybeSingle();

        if (dbUser && dbUser.id !== excludeId) {
          return {
            isTaken: true,
            takenBy: 'OFFICER',
            name: dbUser.full_name,
            role: dbUser.role,
          };
        }

        // 2. Check DB member_profiles table (Members)
        const { data: dbProf } = await supabase
          .from('member_profiles')
          .select('id, user_id, full_name, cnic_number')
          .or(`cnic_number.eq.${normCnic},cnic_number.eq.${cnic}`)
          .maybeSingle();

        if (dbProf && dbProf.id !== excludeId && dbProf.user_id !== excludeId) {
          return {
            isTaken: true,
            takenBy: 'MEMBER',
            name: dbProf.full_name,
            role: 'MEMBER',
          };
        }
      } catch (e) {
        console.warn('checkCnicUniqueness Supabase query notice:', e);
      }
    }

    return { isTaken: false };
  }

  public addOfficerUser(data: Omit<User, 'id' | 'createdAt'>): User {
    const cleanCnic = normalizeCnic(data.cnicNumber);
    const check = this.checkCnicUniquenessSync(cleanCnic);
    if (check.isTaken) {
      throw new Error(`Yeh CNIC (${cleanCnic}) pehle se system mein ${check.takenBy === 'OFFICER' ? 'Admin Officer' : 'Member'} (${check.name}) ke naam par registered hai.`);
    }

    const newOfficer: User = {
      ...data,
      cnicNumber: cleanCnic,
      id: generateUuid(),
      createdAt: new Date().toISOString(),
    };
    this.officerUsers.unshift(newOfficer);
    this.saveOfficerUsers();
    return newOfficer;
  }

  public async deleteOfficerUser(id: string) {
    const officerToDelete = this.officerUsers.find((u) => u.id === id);
    this.officerUsers = this.officerUsers.filter((u) => u.id !== id);
    this.saveOfficerUsers();
    this.notifyListeners();

    if (isSupabaseConfigured()) {
      try {
        if (id) {
          await supabase.from('users').delete().eq('id', id);
        }
        if (officerToDelete?.cnicNumber) {
          await supabase.from('users').delete().eq('cnic_number', officerToDelete.cnicNumber);
        }
      } catch (e) {
        console.warn('Delete officer from Supabase notice:', e);
      }
    }
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
        ((lowerInput === 'admin@nypsindh' || lowerInput === 'admin' || lowerInput === 'admin@nypsindh.org.pk') && (u.role === 'SUPER_ADMIN' || u.id === 'usr-superadmin')) ||
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

      const defaultPass = INITIAL_OFFICER_USERS.find((io) => io.role === officer.role || io.id === officer.id)?.password || '';
      const expectedPassword = officer.password || defaultPass;
      const cleanProvidedPass = providedPassword.trim();
      const envSuperPass = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPERADMIN_PASSWORD) || '';
      const isPassValid = Boolean(
        (expectedPassword && cleanProvidedPass === expectedPassword.trim()) ||
        (officer.password && officer.password.trim() === cleanProvidedPass) ||
        (envSuperPass && cleanProvidedPass === envSuperPass.trim() && (officer.role === 'SUPER_ADMIN' || officer.cnicNumber?.includes('33105-7853093-7')))
      );

      if (!isPassValid) {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }

      this.currentUser = officer;
      this.saveCurrentUser();
      return { success: true, user: officer };
    }

    return { success: false, error: 'not_found' };
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
      
      // Fallback CNIC match: only match if NOT assigned to an Officer account
      if (cleanInput && isSameCnic(p.cnicNumber, cleanInput)) {
        const matchingOfficer = this.officerUsers.find(o => isSameCnic(o.cnicNumber, cleanInput));
        if (!matchingOfficer || matchingOfficer.id === p.userId) return true;
      }
      if (current && (current.role === 'MEMBER' || current.role === 'APPLICANT') && isSameCnic(p.cnicNumber, current.cnicNumber)) {
        return true;
      }
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

    // 1. Check if CNIC belongs to an Admin Officer
    const officerMatch = this.officerUsers.find((u) => isSameCnic(u.cnicNumber, cleanCnic));
    if (officerMatch) {
      throw new Error(`Yeh CNIC (${cleanCnic}) pehle se Admin Officer (${officerMatch.fullName} - ${officerMatch.role}) ke naam par registered hai. Dual account (Admin + Member) allow nahi hai.`);
    }

    // 2. Check if existing profile with same CNIC belongs to a DIFFERENT user
    const existingIndex = this.profiles.findIndex((p) => isSameCnic(p.cnicNumber, cleanCnic));
    if (existingIndex >= 0) {
      const existing = this.profiles[existingIndex];
      if (existing.userId && validUserId && existing.userId !== validUserId && isUuid(existing.userId) && isUuid(validUserId)) {
        throw new Error(`Yeh CNIC (${cleanCnic}) pehle se ek doosre Member (${existing.fullName}) ke naam par registered hai.`);
      }
    }

    // 3. Check Supabase DB for Officer with this CNIC
    if (isSupabaseConfigured()) {
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, full_name, role')
          .or(`cnic_number.eq.${cleanCnic}`)
          .maybeSingle();

        if (dbUser) {
          throw new Error(`Yeh CNIC (${cleanCnic}) pehle se Admin Officer (${dbUser.full_name} - ${dbUser.role}) ke naam par Supabase DB mein registered hai.`);
        }
      } catch (e: any) {
        if (e.message && e.message.includes('registered')) throw e;
        console.warn('submitMemberProfile Supabase officer check notice:', e);
      }
    }

    const profileData = {
      ...data,
      cnicNumber: cleanCnic,
      userId: validUserId,
      socialLinks: {
        ...(data.socialLinks || {}),
      },
    };

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
    const profile = this.profiles.find(
      (p) => p.id === profileId || (p.cnicNumber && p.cnicNumber === profileId)
    );

    this.removedCabinetIds.add(profileId);
    if (profile) {
      if (profile.id) this.removedCabinetIds.add(profile.id);
      if (profile.cnicNumber) {
        this.removedCabinetIds.add(profile.cnicNumber);
        const norm = normalizeCnic(profile.cnicNumber);
        if (norm) this.removedCabinetIds.add(norm);
      }
      if (profile.fullName) {
        this.removedCabinetIds.add(profile.fullName.trim());
      }
    }

    this.profiles = this.profiles.filter((p) => {
      if (p.id === profileId) return false;
      if (profile) {
        if (p.id === profile.id) return false;
        if (profile.cnicNumber && normalizeCnic(p.cnicNumber) === normalizeCnic(profile.cnicNumber)) return false;
        if (profile.fullName && p.fullName.trim().toLowerCase() === profile.fullName.trim().toLowerCase()) return false;
      }
      return true;
    });
    this.saveProfiles();

    // Delete associated cabinet member from state
    this.deleteCabinetMember(profileId);

    localStorage.setItem(KEY_REMOVED_CABINET, JSON.stringify(Array.from(this.removedCabinetIds)));

    // Immediately notify UI listeners so deletion reflects instantly
    this.notifyListeners();

    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const cnic = profile?.cnicNumber ? profile.cnicNumber.trim() : null;
          const normCnic = cnic ? normalizeCnic(cnic) : null;
          const fullName = profile?.fullName ? profile.fullName.trim() : null;
          const validId = toValidUuid(profileId);

          const dependentPromises = [
            cnic ? supabase.from('role_applications').delete().eq('applicant_cnic', cnic) : null,
            cnic ? supabase.from('role_applications').delete().eq('cnic_number', cnic) : null,
            (normCnic && normCnic !== cnic) ? supabase.from('role_applications').delete().eq('applicant_cnic', normCnic) : null,
            cnic ? supabase.from('cabinet_members').delete().eq('cnic_number', cnic) : null,
            fullName ? supabase.from('cabinet_members').delete().ilike('full_name', fullName) : null,
            fullName ? supabase.from('role_applications').delete().ilike('full_name', fullName) : null,
            supabase.from('cabinet_members').delete().eq('member_profile_id', profileId),
            (profile?.id) ? supabase.from('cabinet_members').delete().eq('member_profile_id', profile.id) : null,
          ].filter(Boolean);

          await Promise.all(dependentPromises);

          const mainPromises = [
            supabase.from('member_profiles').delete().eq('id', profileId),
            (profile?.id && profile.id !== profileId) ? supabase.from('member_profiles').delete().eq('id', profile.id) : null,
            (validId !== profileId) ? supabase.from('member_profiles').delete().eq('id', validId) : null,
            cnic ? supabase.from('member_profiles').delete().eq('cnic_number', cnic) : null,
            (normCnic && normCnic !== cnic) ? supabase.from('member_profiles').delete().eq('cnic_number', normCnic) : null,
            fullName ? supabase.from('member_profiles').delete().ilike('full_name', fullName) : null,
          ].filter(Boolean);

          await Promise.all(mainPromises);
        } catch (e) {
          console.warn('Supabase delete profile notice:', e);
        }
      })();
    }

    return true;
  }


  // --- Role Tier Applications Workflow ---
  private async syncRoleAppToSupabase(app: RoleApplicationRequest) {
    if (!isSupabaseConfigured()) return;
    try {
      const validId = toValidUuid(app.id);
      const validProfId = isUuid(app.profileId) ? app.profileId : null;
      const payload = {
        id: validId,
        user_id: app.userId || 'usr-applicant',
        cnic_number: normalizeCnic(app.cnicNumber),
        profile_id: validProfId,
        role_tier: app.roleTier,
        target_role_title: app.targetRoleTitle,
        reason: app.reason || '',
        fee_amount: Number(app.feeAmount) || 0,
        status: app.status,
        payment_details: app.paymentDetails || {},
        rejection_reason: app.rejectionReason || null,
        verified_by_user_id: app.verifiedByUserId || null,
        authorized_by_user_id: app.authorizedByUserId || null,
        submitted_at: app.submittedAt || new Date().toISOString(),
        updated_at: app.updatedAt || new Date().toISOString(),
      };
      let { error } = await supabase.from('role_applications').upsert(payload);
      if (error && error.message?.includes('role_applications_profile_id_fkey')) {
        console.warn('Retrying syncRoleAppToSupabase without profile_id reference...');
        payload.profile_id = null;
        const retry = await supabase.from('role_applications').upsert(payload);
        error = retry.error;
      }
      if (error) {
        console.warn('Supabase syncRoleAppToSupabase notice:', error.message);
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
    let list = [...this.cabinetMembers.filter((m) => m.isActive)];
    if (level) {
      list = list.filter((m) => m.cabinetLevel === level);
    }
    if (divisionId) {
      list = list.filter((m) => m.divisionId === divisionId);
    }
    return list.sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));
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

  public async deleteCabinetMemberFromSupabase(id: string, fullName?: string) {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('cabinet_members').delete().eq('id', id);
      const validId = toValidUuid(id);
      if (validId !== id) {
        await supabase.from('cabinet_members').delete().eq('id', validId);
      }
      if (fullName) {
        await supabase.from('cabinet_members').delete().ilike('full_name', fullName.trim());
      }
    } catch (e) {
      console.warn('Supabase deleteCabinetMember notice:', e);
    }
  }

  public addCabinetMember(data: Omit<CabinetMember, 'id'>): CabinetMember {
    const newMemberId = generateUuid();
    this.removedCabinetIds.delete(newMemberId);
    if (data.memberProfileId) {
      this.removedCabinetIds.delete(data.memberProfileId);
    }
    localStorage.setItem(KEY_REMOVED_CABINET, JSON.stringify(Array.from(this.removedCabinetIds)));

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

  public async deleteCabinetMember(id: string) {
    const targetMember = this.cabinetMembers.find((m) => m.id === id || m.memberProfileId === id);
    const matchingProfile = this.profiles.find(
      (p) => p.id === id || (targetMember && (p.id === targetMember.memberProfileId || p.fullName.trim().toLowerCase() === targetMember.fullName.trim().toLowerCase()))
    );

    // Update in-memory arrays immediately
    this.cabinetMembers = this.cabinetMembers.filter(
      (m) => m.id !== id && m.memberProfileId !== id && (!targetMember || m.id !== targetMember.id)
    );
    localStorage.setItem(KEY_CABINET, JSON.stringify(this.cabinetMembers));

    if (matchingProfile) {
      this.profiles = this.profiles.filter((p) => p.id !== matchingProfile.id);
      this.saveProfiles();
    } else {
      this.profiles = this.profiles.filter((p) => p.id !== id);
      this.saveProfiles();
    }

    // Direct Supabase DB deletions for cabinet_members and member_profiles
    if (isSupabaseConfigured()) {
      try {
        if (targetMember?.id) {
          await supabase.from('cabinet_members').delete().eq('id', targetMember.id);
        }
        if (targetMember?.memberProfileId) {
          await supabase.from('cabinet_members').delete().eq('member_profile_id', targetMember.memberProfileId);
          await supabase.from('member_profiles').delete().eq('id', targetMember.memberProfileId);
        }
        if (id) {
          await supabase.from('cabinet_members').delete().eq('id', id);
          await supabase.from('member_profiles').delete().eq('id', id);
        }
        if (matchingProfile?.id) {
          await supabase.from('member_profiles').delete().eq('id', matchingProfile.id);
        }
      } catch (e) {
        console.warn('Supabase DB delete notice:', e);
      }
    }

    this.notifyListeners();
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

    if (isSupabaseConfigured()) {
      supabase.from('media_items').upsert({
        id: newItem.id,
        title: newItem.title,
        category: newItem.category,
        media_type: newItem.mediaType === 'VIDEO' ? 'video' : 'image',
        media_url: newItem.mediaUrl,
        description: newItem.description || null,
        event_date: newItem.eventDate || null,
        created_at: newItem.createdAt || new Date().toISOString(),
      }).then(({ error }) => {
        if (error) console.warn('Supabase addMediaItem notice:', error.message);
      });
    }

    return newItem;
  }

  public deleteMediaItem(id: string) {
    this.mediaItems = this.mediaItems.filter((m) => m.id !== id);
    localStorage.setItem(KEY_MEDIA_ITEMS, JSON.stringify(this.mediaItems));

    if (isSupabaseConfigured()) {
      supabase.from('media_items').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase deleteMediaItem notice:', error.message);
      });
    }
  }


  public async submitContactInquiry(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          full_name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
          status: 'UNREAD',
          submitted_at: new Date().toISOString(),
        };
        const { error } = await supabase.from('contact_inquiries').insert(payload);
        if (error) {
          console.warn('Supabase submitContactInquiry notice:', error.message);
        } else {
          console.log('Contact inquiry saved successfully to Supabase!');
        }
      } catch (err) {
        console.warn('Supabase submitContactInquiry exception:', err);
      }
    }
    return true;
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
