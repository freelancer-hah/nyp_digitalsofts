import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { store } from '../services/store';
import { SINDH_DIVISIONS } from '../data/sindhHierarchy';
import { CabinetMember, MemberProfile } from '../types';
import { uploadToCloudinary } from '../services/cloudinary';
import { 
  Users, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  UserCheck, 
  Crown, 
  Upload,
  Loader2,
  CheckCircle2,
  Landmark,
  Search,
  Quote,
} from 'lucide-react';

export const CabinetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isParliamentariansView = searchParams.get('view') === 'parliamentarians';
  const activeDivParam = searchParams.get('div') || 'ALL';

  const [selectedDiv, setSelectedDiv] = useState(activeDivParam);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | 'MPA' | 'MNA' | 'PROVINCIAL_LEADERS'>('ALL');

  // Auth / Admin Status (President, Web Coordinator & Executive Desks)
  const currentUser = store.getCurrentUser();
  const isSuperAdmin =
    currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'PRESIDENT' ||
    currentUser?.role === 'WEB_COORDINATOR' ||
    currentUser?.role === 'APPROVAL_AUTHORITY';

  // Tick for forcing re-render when store updates
  const [, setTick] = useState(0);

  useEffect(() => {
    store.fetchFromSupabase().then(() => {
      setTick((t) => t + 1);
    });
  }, []);

  // Modal State for Assigning / Editing Member
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CabinetMember | null>(null);

  // Form State
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [profileSearchQuery, setProfileSearchQuery] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('President NYP Sindh');
  const [cabinetLevel, setCabinetLevel] = useState<'PROVINCIAL' | 'DIVISIONAL'>('PROVINCIAL');
  const [divisionId, setDivisionId] = useState(SINDH_DIVISIONS[0].id);
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [displayOrderInput, setDisplayOrderInput] = useState<number>(1);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Parliamentarian Form State
  const [parlType, setParlType] = useState<'MPA' | 'MNA' | 'PROVINCIAL_LEADER'>('MPA');
  const [provincialLeaderRole, setProvincialLeaderRole] = useState<'SPEAKER' | 'DEPUTY_SPEAKER' | 'CHIEF_MINISTER' | 'OPPOSITION_LEADER' | 'MINISTER'>('CHIEF_MINISTER');
  const [ministryDepartment, setMinistryDepartment] = useState('');

  const registeredProfiles = store.getAllProfiles();

  // Get raw list from store
  const allCabinetMembersList = store.getCabinetMembers();

  // Filter list depending on current View Mode (Cabinets vs Parliamentarians)
  const filteredMembers = allCabinetMembersList.filter((member) => {
    if (isParliamentariansView) {
      const isParl = member.category === 'PARLIAMENTARIAN' || 
        member.designation.toLowerCase().includes('mpa') || 
        member.designation.toLowerCase().includes('mna') ||
        member.designation.toLowerCase().includes('speaker') ||
        member.designation.toLowerCase().includes('minister') ||
        member.designation.toLowerCase().includes('opposition');
      
      if (!isParl) return false;

      // 1. PROVINCIAL LEADERSHIP TAB (selectedDiv === 'ALL'):
      if (selectedDiv === 'ALL') {
        const isProvincialLeadership = member.cabinetLevel === 'PROVINCIAL' && (
          ['SPEAKER', 'DEPUTY_SPEAKER', 'CHIEF_MINISTER', 'OPPOSITION_LEADER', 'MINISTER'].includes(member.parliamentaryRole || '') ||
          member.designation.toLowerCase().includes('speaker') ||
          member.designation.toLowerCase().includes('chief minister') ||
          member.designation.toLowerCase().includes('minister') ||
          member.designation.toLowerCase().includes('opposition') ||
          (!member.designation.toLowerCase().includes('mpa') && !member.designation.toLowerCase().includes('mna') && !member.divisionId)
        );

        const isDivisionalMpaMna = (member.cabinetLevel === 'DIVISIONAL' || !!member.divisionId) ||
          member.parliamentaryRole === 'YOUTH_MPA' || member.parliamentaryRole === 'YOUTH_MNA' ||
          member.designation.toLowerCase().includes('youth mpa') || member.designation.toLowerCase().includes('youth mna');

        if (isDivisionalMpaMna && member.cabinetLevel !== 'PROVINCIAL') {
          return false;
        }

        return isProvincialLeadership;
      }

      // 2. DIVISIONAL TABS:
      if (member.divisionId !== selectedDiv) {
        return false;
      }

      // Role filter check (All, Youth MPA, Youth MNA)
      if (selectedRoleFilter === 'MPA') return member.parliamentaryRole === 'YOUTH_MPA' || member.designation.toLowerCase().includes('mpa');
      if (selectedRoleFilter === 'MNA') return member.parliamentaryRole === 'YOUTH_MNA' || member.designation.toLowerCase().includes('mna');
      
      return true;
    } else {
      // Must NOT be a pure parliamentarian (or show main executive cabinet)
      if (member.category === 'PARLIAMENTARIAN') return false;

      // 1. PROVINCIAL CABINET TAB: Only show Provincial Cabinet members
      if (selectedDiv === 'ALL') {
        return member.cabinetLevel === 'PROVINCIAL';
      }

      // 2. DIVISIONAL TABS: Only show Divisional members for that division
      return member.cabinetLevel === 'DIVISIONAL' && member.divisionId === selectedDiv;
    }
  });

  // Sort strictly number-wise by displayOrder
  const displayMembers = [...filteredMembers].sort(
    (a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999)
  );

  // Filter out profiles that are ALREADY assigned to the Cabinet or Parliament
  const assignedProfileIds = new Set(
    allCabinetMembersList
      .filter((cm) => !editingMember || cm.id !== editingMember.id)
      .map((cm) => cm.memberProfileId)
      .filter(Boolean)
  );
  const assignedNames = new Set(
    allCabinetMembersList
      .filter((cm) => !editingMember || cm.id !== editingMember.id)
      .map((cm) => cm.fullName.trim().toLowerCase())
  );

  const availableProfiles = registeredProfiles.filter((p) => {
    if (editingMember && (editingMember.memberProfileId === p.id || editingMember.fullName.trim().toLowerCase() === p.fullName.trim().toLowerCase())) {
      return true;
    }
    return !assignedProfileIds.has(p.id) && !assignedNames.has(p.fullName.trim().toLowerCase());
  });

  const filteredSelectableProfiles = availableProfiles.filter((p) => {
    if (!profileSearchQuery.trim()) return true;
    const q = profileSearchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.cnicNumber.includes(q) ||
      (p.divisionId && store.getDivisionName(p.divisionId).toLowerCase().includes(q))
    );
  });

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setSelectedProfileId('');
    setProfileSearchQuery('');
    setFullName('');
    setDesignation(isParliamentariansView ? 'Youth MPA' : 'President NYP Sindh');
    setCabinetLevel(isParliamentariansView ? 'DIVISIONAL' : 'PROVINCIAL');
    setDivisionId(SINDH_DIVISIONS[0].id);
    setPhotoUrl(isParliamentariansView ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' : '/nyp-president.png');
    setBio('');
    setDisplayOrderInput(displayMembers.length + 1);
    setParlType('MPA');
    setProvincialLeaderRole('CHIEF_MINISTER');
    setMinistryDepartment('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: CabinetMember) => {
    setEditingMember(member);
    setSelectedProfileId(member.memberProfileId || '');
    setProfileSearchQuery('');
    setFullName(member.fullName);
    setDesignation(member.designation);
    setCabinetLevel(member.cabinetLevel);
    setDivisionId(member.divisionId || SINDH_DIVISIONS[0].id);
    setPhotoUrl(member.photoUrl);
    setBio(member.bio || '');
    setDisplayOrderInput(member.displayOrder || 1);
    setMinistryDepartment(member.ministryDepartment || '');
    
    if (member.parliamentaryRole === 'YOUTH_MNA' || member.designation.toLowerCase().includes('mna')) {
      setParlType('MNA');
    } else if (member.parliamentaryRole === 'YOUTH_MPA' || member.designation.toLowerCase().includes('mpa')) {
      setParlType('MPA');
    } else {
      setParlType('PROVINCIAL_LEADER');
      if (member.parliamentaryRole) {
        setProvincialLeaderRole(member.parliamentaryRole as any);
      }
    }
    
    setIsModalOpen(true);
  };

  // AUTO-FILL FORM WHEN SELECTING A REGISTERED MEMBER
  const handleProfileSelect = (profId: string) => {
    setSelectedProfileId(profId);
    if (!profId) return;

    const prof = registeredProfiles.find((p) => p.id === profId || p.userId === profId);
    if (prof) {
      setFullName(prof.fullName);
      setPhotoUrl(prof.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
      
      if (prof.divisionId) {
        setDivisionId(prof.divisionId);
        setCabinetLevel('DIVISIONAL');
      } else {
        setCabinetLevel('PROVINCIAL');
      }

      if (prof.assignedDesignation && prof.assignedDesignation !== 'Member' && prof.assignedDesignation !== 'General Member') {
        setDesignation(prof.assignedDesignation);
      }
      if (prof.statementOfPurpose) {
        setBio(prof.statementOfPurpose);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const cdnUrl = await uploadToCloudinary(file);
      setPhotoUrl(cdnUrl);
    } catch (err) {
      alert('Photo upload failed. Using default image.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      alert('Please fill Member Full Name.');
      return;
    }

    let finalDesignation = designation;
    let finalCategory: 'CABINET' | 'PARLIAMENTARIAN' = isParliamentariansView ? 'PARLIAMENTARIAN' : 'CABINET';
    let finalParlRole: any = undefined;
    let finalLevel = cabinetLevel;

    if (isParliamentariansView) {
      if (parlType === 'MPA') {
        finalDesignation = 'Youth MPA';
        finalParlRole = 'YOUTH_MPA';
        finalLevel = 'DIVISIONAL';
      } else if (parlType === 'MNA') {
        finalDesignation = 'Youth MNA';
        finalParlRole = 'YOUTH_MNA';
        finalLevel = 'DIVISIONAL';
      } else if (parlType === 'PROVINCIAL_LEADER') {
        finalLevel = 'PROVINCIAL';
        finalParlRole = provincialLeaderRole;
        if (provincialLeaderRole === 'CHIEF_MINISTER') finalDesignation = 'Youth Chief Minister (CM)';
        if (provincialLeaderRole === 'SPEAKER') finalDesignation = 'Speaker Youth Provincial Assembly';
        if (provincialLeaderRole === 'DEPUTY_SPEAKER') finalDesignation = 'Deputy Speaker Youth Assembly';
        if (provincialLeaderRole === 'OPPOSITION_LEADER') finalDesignation = 'Leader of Opposition';
        if (provincialLeaderRole === 'MINISTER') finalDesignation = 'Youth Provincial Minister';
      }
    }

    if (editingMember) {
      store.updateCabinetMember(editingMember.id, {
        fullName,
        designation: finalDesignation,
        cabinetLevel: finalLevel,
        divisionId: finalLevel === 'DIVISIONAL' ? divisionId : undefined,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        bio,
        displayOrder: Number(displayOrderInput) || 1,
        memberProfileId: selectedProfileId || undefined,
        category: finalCategory,
        parliamentaryRole: finalParlRole,
        ministryDepartment: (parlType === 'PROVINCIAL_LEADER' && provincialLeaderRole === 'MINISTER') ? ministryDepartment : undefined,
      });
    } else {
      store.addCabinetMember({
        fullName,
        designation: finalDesignation,
        cabinetLevel: finalLevel,
        divisionId: finalLevel === 'DIVISIONAL' ? divisionId : undefined,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        bio,
        displayOrder: Number(displayOrderInput) || displayMembers.length + 1,
        isActive: true,
        memberProfileId: selectedProfileId || undefined,
        category: finalCategory,
        parliamentaryRole: finalParlRole,
        ministryDepartment: (parlType === 'PROVINCIAL_LEADER' && provincialLeaderRole === 'MINISTER') ? ministryDepartment : undefined,
      });
    }

    setIsModalOpen(false);
    setTick((t) => t + 1);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}"?`)) {
      store.deleteCabinetMember(id);
      setTick((t) => t + 1);
    }
  };

  const selectedProfileObj = registeredProfiles.find(
    (p) => p.id === selectedProfileId || p.userId === selectedProfileId
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in font-sans transition-colors">
      
      {/* Top Banner / Header */}
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Super Admin Control Bar */}
        {isSuperAdmin && (
          <div className="bg-amber-50/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/60 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                  {currentUser?.role === 'WEB_COORDINATOR' ? 'WEB COORDINATOR' : 'PRESIDENT & EXECUTIVE'} {isParliamentariansView ? 'PARLIAMENTARIAN MANAGEMENT' : 'CABINET MANAGEMENT'}
                </span>
                <p className="text-xs text-amber-800 dark:text-amber-400">
                  {isParliamentariansView 
                    ? 'Assign registered member profiles as Youth MPAs, Youth MNAs, Speaker, CM or Youth Ministers.' 
                    : 'Select registered members to assign cabinet positions, set hierarchy number, and choose division.'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 rounded-xl bg-[#052818] hover:bg-[#073822] text-amber-300 font-bold text-xs uppercase tracking-wider shadow-md flex items-center space-x-2 transition-transform hover:scale-105 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isParliamentariansView ? 'Assign Youth Parliamentarian' : 'Assign Member Profile'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700/60 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-xs">
            {isParliamentariansView ? <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            <span>{isParliamentariansView ? 'YOUTH PARLIAMENTARIANS DIRECTORY 2026' : 'EXECUTIVE CABINET & OFFICE BEARERS'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
            {isParliamentariansView ? 'Youth Provincial Assembly & Parliamentarians' : 'NYP Sindh Executive Leadership Directory'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            {isParliamentariansView 
              ? 'Official directory of Youth MPAs, Youth MNAs, Speaker, Chief Minister, and Youth Provincial Ministers across Sindh.' 
              : 'Official public directory of provincial leadership and divisional cabinet members across Sindh Province.'}
          </p>
        </div>

      </div>

      {/* Filter Tabs Toolbar */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        
        {/* Division Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedDiv('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              selectedDiv === 'ALL'
                ? 'bg-[#052818] dark:bg-emerald-600 text-amber-300 dark:text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            {isParliamentariansView ? 'PROVINCIAL LEADERSHIP' : 'PROVINCIAL CABINET'}
          </button>

          {SINDH_DIVISIONS.map((div) => (
            <button
              key={div.id}
              onClick={() => setSelectedDiv(div.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedDiv === div.id
                  ? 'bg-[#052818] dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              {div.name.replace(' Division', '')}
            </button>
          ))}
        </div>

        {/* Role Filter Toggle (ONLY IN DIVISIONAL VIEW FOR YOUTH PARLIAMENTARIANS) */}
        {isParliamentariansView && selectedDiv !== 'ALL' && (
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setSelectedRoleFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRoleFilter === 'ALL' ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedRoleFilter('MPA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRoleFilter === 'MPA' ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Youth MPA
            </button>
            <button
              onClick={() => setSelectedRoleFilter('MNA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRoleFilter === 'MNA' ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Youth MNA
            </button>
            <button
              onClick={() => setSelectedRoleFilter('PROVINCIAL_LEADERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRoleFilter === 'PROVINCIAL_LEADERS' ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Provincial Leaders
            </button>
          </div>
        )}

      </div>

      {/* Grid of Cabinet Members / Parliamentarians (Strictly 3 per row on lg screens, sorted number-wise) */}
      <div className="max-w-7xl mx-auto space-y-6">
        {displayMembers.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <Users className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {isParliamentariansView 
                ? 'No Youth Parliamentarians assigned for the selected filter yet.' 
                : 'No cabinet members found for the selected filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMembers.map((member) => {
              const isLeadershipRole = 
                member.cabinetLevel === 'PROVINCIAL' && (
                  ['SPEAKER', 'DEPUTY_SPEAKER', 'CHIEF_MINISTER', 'OPPOSITION_LEADER', 'MINISTER'].includes(member.parliamentaryRole || '') ||
                  member.designation.toLowerCase().includes('president') ||
                  member.designation.toLowerCase().includes('speaker') ||
                  member.designation.toLowerCase().includes('chief minister') ||
                  member.designation.toLowerCase().includes('minister')
                );

              const isProvincial = member.cabinetLevel === 'PROVINCIAL';

              return (
                <div
                  key={member.id}
                  className={`group relative rounded-3xl overflow-hidden transition-all duration-300 text-left flex flex-col justify-between hover:-translate-y-1.5 ${
                    isLeadershipRole
                      ? 'bg-gradient-to-b from-[#062419] via-[#041a12] to-[#02100b] text-white border-2 border-amber-400/70 shadow-xl shadow-emerald-950/20 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10'
                      : 'bg-white dark:bg-[#0c1424] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-xl hover:shadow-emerald-950/10 dark:hover:shadow-emerald-950/30 hover:border-emerald-500/50 dark:hover:border-emerald-500/40'
                  }`}
                >
                  {/* Decorative Top Accent Line */}
                  <div className={`h-1.5 w-full ${
                    isLeadershipRole
                      ? 'bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500'
                      : isProvincial
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-400 to-amber-400'
                      : 'bg-gradient-to-r from-emerald-700 via-teal-500 to-emerald-600'
                  }`} />

                  {/* Ambient Glow in Corner */}
                  <div className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl transition-opacity duration-300 opacity-40 group-hover:opacity-75 ${
                    isLeadershipRole ? 'bg-amber-400/20' : 'bg-emerald-500/15 dark:bg-emerald-400/15'
                  }`} />

                  {/* Card Content Area */}
                  <div className="p-5 sm:p-6 space-y-4 relative z-10 flex-1">
                    
                    {/* Header: Level & Division Badges / Admin Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
                        <span className={`inline-flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          isLeadershipRole
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                            : isProvincial
                            ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {isLeadershipRole ? (
                            <Crown className="w-3 h-3 text-slate-950" />
                          ) : isProvincial ? (
                            <Landmark className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Users className="w-3 h-3 text-emerald-500" />
                          )}
                          <span>
                            {member.cabinetLevel} {isParliamentariansView ? 'PARLIAMENT' : 'CABINET'}
                          </span>
                        </span>

                        {member.divisionId && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            <MapPin className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                            <span>{store.getDivisionName(member.divisionId)}</span>
                          </span>
                        )}
                      </div>

                      {/* Admin Actions (Numbering is strictly backend, hidden from public frontend) */}
                      {isSuperAdmin && (
                        <div className="flex items-center space-x-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs shrink-0">
                          <button
                            onClick={() => handleOpenEditModal(member)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                            title="Edit Member & Sequence Order"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, member.fullName)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            title="Remove Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Member Profile Block */}
                    <div className="space-y-4 pt-1">
                      <div className="flex items-start space-x-4">
                        
                        {/* Member Portrait */}
                        <div className="relative shrink-0">
                          <div className={`w-20 h-24 sm:w-22 sm:h-26 rounded-2xl overflow-hidden shadow-md ${
                            isLeadershipRole
                              ? 'ring-2 ring-amber-400/90 bg-emerald-950'
                              : 'ring-2 ring-emerald-500/25 dark:ring-emerald-400/30 bg-slate-100 dark:bg-slate-800'
                          }`}>
                            <img
                              src={member.photoUrl}
                              alt={member.fullName}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                              }}
                            />
                          </div>
                          
                          {/* Verified Badge Icon */}
                          <div 
                            className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white p-1 rounded-full shadow-md ring-2 ring-white dark:ring-slate-900 flex items-center justify-center" 
                            title="Official Appointment"
                          >
                            <ShieldCheck className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Title, Ministry & Full Name */}
                        <div className="space-y-2 text-left flex-1 min-w-0">
                          
                          {/* Highlighted Designation Pill */}
                          <div className={`inline-flex items-center space-x-1.5 font-black px-2.5 py-1 rounded-lg text-xs uppercase tracking-wide shadow-xs font-heading max-w-full ${
                            isLeadershipRole
                              ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 border border-amber-300'
                              : 'bg-gradient-to-r from-emerald-800 to-emerald-700 dark:from-emerald-700 dark:to-emerald-600 text-amber-200 dark:text-white border border-emerald-700 dark:border-emerald-500'
                          }`}>
                            {isLeadershipRole && <Sparkles className="w-3 h-3 text-slate-950 shrink-0" />}
                            <span className="truncate">{member.designation}</span>
                          </div>

                          {/* Ministry Department Sub-Tag */}
                          {member.ministryDepartment && (
                            <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-500 dark:text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20 w-fit max-w-full truncate">
                              <Landmark className="w-3 h-3 shrink-0" />
                              <span className="truncate">Minister for {member.ministryDepartment}</span>
                            </div>
                          )}

                          {/* Full Name */}
                          <h3 className={`font-black text-base sm:text-lg leading-snug font-heading truncate ${
                            isLeadershipRole
                              ? 'text-white'
                              : 'text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'
                          }`}>
                            {member.fullName}
                          </h3>
                        </div>
                      </div>

                      {/* Bio / Quote Section */}
                      {member.bio && (
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isLeadershipRole
                            ? 'bg-emerald-950/40 border border-emerald-800/40 text-slate-200'
                            : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-300'
                        }`}>
                          <div className="flex items-start space-x-2">
                            <Quote className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 opacity-70 rotate-180" />
                            <p className="italic line-clamp-3 leading-relaxed">
                              {member.bio}
                            </p>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Card Footer Bar */}
                  <div className={`px-5 sm:px-6 py-3 border-t flex items-center justify-between text-[11px] font-medium z-10 ${
                    isLeadershipRole
                      ? 'border-emerald-900/60 bg-emerald-950/20 text-slate-400' 
                      : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400'
                  }`}>
                    <div className="flex items-center space-x-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate font-semibold">
                        {member.divisionId ? store.getDivisionName(member.divisionId) : 'Sindh Province (General)'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isParliamentariansView ? 'Youth Assembly' : 'Cabinet Member'}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SUPER ADMIN MODAL: ASSIGN / EDIT MEMBER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl text-left relative text-slate-900 dark:text-white overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4 sm:px-6 sm:py-5 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md shrink-0 z-10">
              <div className="flex items-center space-x-3 text-emerald-700 dark:text-emerald-400 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading leading-tight truncate">
                    {editingMember 
                      ? 'Edit Member' 
                      : isParliamentariansView 
                      ? 'Assign Youth Parliamentarian' 
                      : 'Assign Registered Member to Cabinet'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                    {isParliamentariansView ? 'Youth Provincial Assembly Sindh Role' : 'National Youth Parliament Sindh Cabinet'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="flex flex-col flex-1 overflow-hidden min-h-0 text-xs">
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              
              {/* 1. SELECT REGISTERED PROFILE DROPDOWN */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                    SELECT REGISTERED MEMBER PROFILE
                  </label>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {availableProfiles.length} unassigned member{availableProfiles.length === 1 ? '' : 's'} available
                  </span>
                </div>

                {/* Quick Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={profileSearchQuery}
                    onChange={(e) => setProfileSearchQuery(e.target.value)}
                    placeholder="Search unassigned member by Name or CNIC..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <select
                  value={selectedProfileId}
                  onChange={(e) => handleProfileSelect(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="">-- Choose from Unassigned Registered Members ({filteredSelectableProfiles.length}) --</option>
                  {filteredSelectableProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.cnicNumber}) - {p.divisionId ? store.getDivisionName(p.divisionId) : 'Sindh'}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Members already assigned to a cabinet/parliament role are automatically filtered out.
                </p>
              </div>

              {/* HIERARCHY POSITION NUMBER */}
              <div className="space-y-1.5 p-3.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-900 dark:text-amber-300 block uppercase tracking-wider">
                    POSITION / NUMBER (TARTEEB #) *
                  </label>
                  <span className="text-xs font-mono font-black text-amber-700 dark:text-amber-400">
                    Position #{displayOrderInput}
                  </span>
                </div>

                <div>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    required
                    value={displayOrderInput}
                    onChange={(e) => setDisplayOrderInput(Number(e.target.value))}
                    placeholder="e.g. 1, 2, 3..."
                    className="w-full bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold font-mono text-sm"
                  />
                  <p className="text-[10px] text-amber-800 dark:text-amber-400 mt-1">
                    Enter the display sequence number (e.g. 1 will be shown first, then 2, 3, etc.).
                  </p>
                </div>
              </div>

              {/* AUTO-LOADED MEMBER PREVIEW BADGE */}
              {selectedProfileObj && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 rounded-xl flex items-center space-x-3 text-xs">
                  <img
                    src={photoUrl || selectedProfileObj.passportPhotoUrl}
                    alt="Uploaded Form Photo"
                    className="w-10 h-12 object-cover rounded-lg border border-amber-400 shadow-xs"
                  />
                  <div>
                    <span className="font-black text-emerald-900 dark:text-emerald-200 block flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
                      {selectedProfileObj.fullName}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-medium">
                      Membership Form Photo & Profile Auto-Loaded
                    </span>
                  </div>
                </div>
              )}

              {/* 2. MEMBER FULL NAME */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                  MEMBER FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abdul Rehman Halepoto"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* PARLIAMENTARIAN MODE: MPA / MNA / PROVINCIAL LEADERSHIP SELECTION */}
              {isParliamentariansView ? (
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  
                  {/* Parliamentary Position Type Selection */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                      SELECT PARLIAMENTARY ROLE / POSITION *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setParlType('MPA')}
                        className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                          parlType === 'MPA' 
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        YOUTH MPA
                      </button>

                      <button
                        type="button"
                        onClick={() => setParlType('MNA')}
                        className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                          parlType === 'MNA' 
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        YOUTH MNA
                      </button>

                      <button
                        type="button"
                        onClick={() => setParlType('PROVINCIAL_LEADER')}
                        className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                          parlType === 'PROVINCIAL_LEADER' 
                            ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        PROVINCIAL LEADERSHIP
                      </button>
                    </div>
                  </div>

                  {/* If Provincial Leader Selected */}
                  {parlType === 'PROVINCIAL_LEADER' && (
                    <div className="space-y-3 p-4 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-2xl">
                      <label className="font-bold text-amber-900 dark:text-amber-300 block uppercase tracking-wider">
                        SELECT PROVINCIAL LEADERSHIP ROLE *
                      </label>
                      <select
                        value={provincialLeaderRole}
                        onChange={(e) => setProvincialLeaderRole(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold"
                      >
                        <option value="CHIEF_MINISTER">Youth Chief Minister (CM)</option>
                        <option value="SPEAKER">Speaker Youth Provincial Assembly</option>
                        <option value="DEPUTY_SPEAKER">Deputy Speaker Youth Assembly</option>
                        <option value="OPPOSITION_LEADER">Leader of Opposition</option>
                        <option value="MINISTER">Youth Provincial Minister</option>
                      </select>

                      {/* If Minister selected, ask for Ministry / Department */}
                      {provincialLeaderRole === 'MINISTER' && (
                        <div className="space-y-1.5 pt-2">
                          <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                            MINISTRY / DEPARTMENT NAME *
                          </label>
                          <input
                            type="text"
                            required
                            value={ministryDepartment}
                            onChange={(e) => setMinistryDepartment(e.target.value)}
                            placeholder="e.g. Youth Affairs & Sports, IT & Innovation, Finance, Health..."
                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold"
                          />
                          <p className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold">
                            Will display as: Minister for {ministryDepartment || '[Ministry Name]'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Division Selection for MPAs & MNAs */}
                  {parlType !== 'PROVINCIAL_LEADER' && (
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                        SELECT DIVISION *
                      </label>
                      <select
                        value={divisionId}
                        onChange={(e) => setDivisionId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
                      >
                        {SINDH_DIVISIONS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                </div>
              ) : (
                /* CABINET MODE DESIGNATION FIELD */
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                    OFFICIAL TITLE / DESIGNATION (OHDA) *
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. President NYP Sindh, Vice President, General Secretary..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              )}

              {/* CABINET LEVEL & DIVISION SELECTION (Only when not in Parliamentarian mode or fallback) */}
              {!isParliamentariansView && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                      CABINET LEVEL *
                    </label>
                    <select
                      value={cabinetLevel}
                      onChange={(e) => setCabinetLevel(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
                    >
                      <option value="PROVINCIAL">Provincial Level (Central Leadership)</option>
                      <option value="DIVISIONAL">Divisional Level (Sindh Division)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                      SELECT DIVISION
                    </label>
                    <select
                      disabled={cabinetLevel === 'PROVINCIAL'}
                      value={divisionId}
                      onChange={(e) => setDivisionId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 font-bold disabled:opacity-50"
                    >
                      {cabinetLevel === 'PROVINCIAL' ? (
                        <option value="">Provincial / Central (All Sindh)</option>
                      ) : (
                        SINDH_DIVISIONS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              )}

              {/* 5. PHOTO URL & UPLOAD */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                  PHOTO (AUTO-LOADED FROM FORM / UPLOAD CUSTOM)
                </label>
                <div className="flex items-center space-x-3">
                  <img
                    src={photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                    alt="Preview"
                    className="w-12 h-14 object-cover rounded-xl border border-amber-400 shadow-xs bg-slate-100"
                  />
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Photo URL"
                    className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white text-xs font-medium"
                  />
                  <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5 shrink-0">
                    {isUploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" /> : <Upload className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* 6. GUIDING QUOTE / STATEMENT */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                  GUIDING QUOTE / STATEMENT
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Statement / Profile bio..."
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              </div>

              {/* Modal Action Buttons (Fixed Bottom Bar) */}
              <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-end space-x-3 shrink-0 rounded-b-2xl sm:rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#052818] hover:bg-[#073822] text-amber-300 font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-2 text-xs"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{editingMember ? 'Save Changes' : isParliamentariansView ? 'ASSIGN PARLIAMENTARIAN' : 'ASSIGN MEMBER'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

