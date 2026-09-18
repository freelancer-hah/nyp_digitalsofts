import React, { useState } from 'react';
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
  Building2,
  Award
} from 'lucide-react';

export const CabinetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isParliamentariansView = searchParams.get('view') === 'parliamentarians';
  const activeDivParam = searchParams.get('div') || 'ALL';

  const [selectedDiv, setSelectedDiv] = useState(activeDivParam);
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'PROVINCIAL' | 'DIVISIONAL'>('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | 'MPA' | 'MNA' | 'PROVINCIAL_LEADERS'>('ALL');

  // Auth / Admin Status
  const currentUser = store.getCurrentUser();
  const isSuperAdmin =
    currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'PRESIDENT' ||
    currentUser?.role === 'APPROVAL_AUTHORITY';

  // Tick for forcing re-render when store updates
  const [, setTick] = useState(0);

  // Modal State for Assigning / Editing Member
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CabinetMember | null>(null);

  // Form State
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('President NYP Sindh');
  const [cabinetLevel, setCabinetLevel] = useState<'PROVINCIAL' | 'DIVISIONAL'>('PROVINCIAL');
  const [divisionId, setDivisionId] = useState(SINDH_DIVISIONS[0].id);
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Parliamentarian Form State
  const [parlType, setParlType] = useState<'MPA' | 'MNA' | 'PROVINCIAL_LEADER'>('MPA');
  const [provincialLeaderRole, setProvincialLeaderRole] = useState<'SPEAKER' | 'DEPUTY_SPEAKER' | 'CHIEF_MINISTER' | 'OPPOSITION_LEADER' | 'MINISTER'>('CHIEF_MINISTER');
  const [ministryDepartment, setMinistryDepartment] = useState('');

  const registeredProfiles = store.getAllProfiles();

  // Get raw list from store
  const allMembers = store.getCabinetMembers(
    selectedLevel === 'ALL' ? undefined : selectedLevel,
    selectedDiv === 'ALL' ? undefined : selectedDiv
  );

  // Filter list depending on current View Mode (Cabinets vs Parliamentarians)
  const displayMembers = allMembers.filter((member) => {
    if (isParliamentariansView) {
      // Must be a parliamentarian OR have an MPA/MNA/Provincial Leadership role
      const isParl = member.category === 'PARLIAMENTARIAN' || 
        member.designation.toLowerCase().includes('mpa') || 
        member.designation.toLowerCase().includes('mna') ||
        member.designation.toLowerCase().includes('speaker') ||
        member.designation.toLowerCase().includes('minister') ||
        member.designation.toLowerCase().includes('opposition');
      
      if (!isParl) return false;

      // Role filter check
      if (selectedRoleFilter === 'MPA') return member.parliamentaryRole === 'YOUTH_MPA' || member.designation.toLowerCase().includes('mpa');
      if (selectedRoleFilter === 'MNA') return member.parliamentaryRole === 'YOUTH_MNA' || member.designation.toLowerCase().includes('mna');
      if (selectedRoleFilter === 'PROVINCIAL_LEADERS') return member.cabinetLevel === 'PROVINCIAL' || member.parliamentaryRole === 'CHIEF_MINISTER' || member.parliamentaryRole === 'SPEAKER' || member.parliamentaryRole === 'MINISTER';
      
      return true;
    } else {
      // Must NOT be a pure parliamentarian (or show main executive cabinet)
      return member.category !== 'PARLIAMENTARIAN';
    }
  });

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setSelectedProfileId('');
    setFullName('');
    setDesignation(isParliamentariansView ? 'Youth MPA' : 'President NYP Sindh');
    setCabinetLevel(isParliamentariansView ? 'DIVISIONAL' : 'PROVINCIAL');
    setDivisionId(SINDH_DIVISIONS[0].id);
    setPhotoUrl(isParliamentariansView ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' : '/nyp-president.png');
    setBio('');
    setParlType('MPA');
    setProvincialLeaderRole('CHIEF_MINISTER');
    setMinistryDepartment('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: CabinetMember) => {
    setEditingMember(member);
    setSelectedProfileId(member.memberProfileId || '');
    setFullName(member.fullName);
    setDesignation(member.designation);
    setCabinetLevel(member.cabinetLevel);
    setDivisionId(member.divisionId || SINDH_DIVISIONS[0].id);
    setPhotoUrl(member.photoUrl);
    setBio(member.bio || '');
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

  // 1. AUTO-FILL FORM WHEN SELECTING A REGISTERED MEMBER
  const handleProfileSelect = (profId: string) => {
    setSelectedProfileId(profId);
    if (!profId) return;

    const prof = registeredProfiles.find((p) => p.id === profId || p.userId === profId);
    if (prof) {
      setFullName(prof.fullName);
      // Auto fill picture uploaded on membership form
      setPhotoUrl(prof.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
      
      if (prof.divisionId) {
        setDivisionId(prof.divisionId);
        setCabinetLevel('DIVISIONAL');
      } else {
        setCabinetLevel('PROVINCIAL');
      }

      if (prof.assignedDesignation && prof.assignedDesignation !== 'Member') {
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
        displayOrder: 1,
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

  const isProvincialPresident = (member: CabinetMember) => {
    const des = (member.designation || '').toLowerCase();
    return (
      des.includes('president nyp sindh') ||
      (des.includes('president') && member.cabinetLevel === 'PROVINCIAL' && !des.includes('vice') && !des.includes('divisional'))
    );
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
                  SUPER ADMIN {isParliamentariansView ? 'PARLIAMENTARIAN MANAGEMENT' : 'CABINET MANAGEMENT'}
                </span>
                <p className="text-xs text-amber-800 dark:text-amber-400">
                  {isParliamentariansView 
                    ? 'Assign registered member profiles as Youth MPAs, Youth MNAs, Speaker, CM or Youth Ministers.' 
                    : 'Select registered members to assign cabinet positions, customize designations, and choose division.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-xl bg-[#052818] hover:bg-[#073822] text-amber-300 font-bold text-xs uppercase tracking-wider shadow-md flex items-center space-x-2 shrink-0 transition-transform hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isParliamentariansView ? 'Assign Youth Parliamentarian' : 'Assign Member Profile'}</span>
            </button>
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
            PROVINCIAL LEADERSHIP
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

        {/* Level & Role Filter Toggle */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shrink-0">
          {isParliamentariansView ? (
            <>
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
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedLevel('ALL')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedLevel === 'ALL' ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                All Levels
              </button>
              <button
                onClick={() => setSelectedLevel('PROVINCIAL')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedLevel === 'PROVINCIAL' ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Provincial
              </button>
              <button
                onClick={() => setSelectedLevel('DIVISIONAL')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedLevel === 'DIVISIONAL' ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Divisional
              </button>
            </>
          )}
        </div>

      </div>

      {/* Grid of Cabinet Members / Parliamentarians */}
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
              const isPresident = !isParliamentariansView && isProvincialPresident(member);
              const isProvincialLeader = member.cabinetLevel === 'PROVINCIAL' || member.parliamentaryRole === 'CHIEF_MINISTER' || member.parliamentaryRole === 'SPEAKER';

              return (
                <div
                  key={member.id}
                  className={`relative rounded-3xl overflow-hidden transition-all duration-300 text-left flex flex-col justify-between group ${
                    isPresident
                      ? 'col-span-full bg-gradient-to-br from-amber-50 via-white to-emerald-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-emerald-950/20 border-2 border-amber-400/90 shadow-2xl p-6 sm:p-10'
                      : isProvincialLeader && isParliamentariansView
                      ? 'bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 text-white border-2 border-amber-400/80 shadow-lg p-6'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm hover:shadow-md p-6'
                  }`}
                >
                  {/* Card Content */}
                  <div className="space-y-4">
                    
                    {/* Top Level Badge & Admin Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                          isPresident || isProvincialLeader
                            ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm font-bold' 
                            : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        }`}>
                          {member.cabinetLevel} {isParliamentariansView ? 'PARLIAMENT' : 'CABINET'}
                        </span>

                        {member.divisionId && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {store.getDivisionName(member.divisionId)}
                          </span>
                        )}
                      </div>

                      {isSuperAdmin && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(member)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 text-slate-600 dark:text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Assignment"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, member.fullName)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 text-slate-600 dark:text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Remove Member Slot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Member Details */}
                    {isPresident ? (
                      /* FEATURED PRESIDENT NYP SINDH CARD (LARGER SIZE) */
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
                        
                        {/* Larger Photo Profile */}
                        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                          <div className="w-44 h-56 sm:w-52 sm:h-64 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-slate-200 dark:bg-slate-800 shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={member.photoUrl}
                              alt={member.fullName}
                              className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute bottom-3 right-3 bg-amber-400 text-slate-950 p-2 rounded-full shadow-lg border-2 border-slate-950">
                              <Crown className="w-5 h-5" />
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="md:col-span-8 space-y-4">
                          <div>
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-md border border-amber-300 font-heading mb-3">
                              <Crown className="w-4 h-4 text-slate-950 shrink-0" />
                              <span>{member.designation}</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                              {member.fullName}
                            </h2>
                          </div>

                          {member.bio && (
                            <blockquote className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic border-l-4 border-amber-400 pl-4 py-1.5 leading-relaxed whitespace-pre-line bg-amber-50/50 dark:bg-slate-800/40 rounded-r-xl">
                              "{member.bio}"
                            </blockquote>
                          )}

                          <div className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 font-bold pt-2">
                            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>
                              {member.divisionId ? store.getDivisionName(member.divisionId) : 'Sindh Province (Central Leadership)'}
                            </span>
                            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-auto" />
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* OTHER CABINET MEMBERS OR PARLIAMENTARIANS CARD */
                      <div className="space-y-4 pt-1">
                        <div className="flex items-start space-x-4">
                          {/* Member Photo */}
                          <div className="w-16 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800 shrink-0">
                            <img
                              src={member.photoUrl}
                              alt={member.fullName}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>

                          <div className="space-y-1 text-left">
                            {/* HIGHLIGHTED DESIGNATION BADGE */}
                            <div className={`inline-block font-black px-3 py-1 rounded-lg text-xs uppercase tracking-wide shadow-xs font-heading ${
                              isProvincialLeader && isParliamentariansView
                                ? 'bg-amber-400 text-slate-950 border border-amber-300'
                                : 'bg-gradient-to-r from-emerald-800 to-emerald-600 dark:from-emerald-600 dark:to-emerald-500 text-amber-300 dark:text-white border border-emerald-700 dark:border-emerald-400'
                            }`}>
                              {member.designation}
                            </div>

                            {/* MINISTRY DEPARTMENT SUB-LINE FOR PROVINCIAL MINISTERS */}
                            {member.ministryDepartment && (
                              <div className="text-[11px] font-bold text-amber-300 dark:text-amber-400 block pt-0.5">
                                Minister for {member.ministryDepartment}
                              </div>
                            )}

                            <h3 className={`font-black text-base leading-snug font-heading ${
                              isProvincialLeader && isParliamentariansView ? 'text-white' : 'text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors'
                            }`}>
                              {member.fullName}
                            </h3>
                          </div>
                        </div>

                        {member.bio && (
                          <p className={`text-xs leading-relaxed italic border-l-2 border-emerald-500 pl-3 line-clamp-3 ${
                            isProvincialLeader && isParliamentariansView ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'
                          }`}>
                            "{member.bio}"
                          </p>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Card Footer (Non-President) */}
                  {!isPresident && (
                    <div className={`pt-3 mt-4 border-t flex items-center justify-between text-[11px] font-medium ${
                      isProvincialLeader && isParliamentariansView 
                        ? 'border-emerald-800 text-slate-400' 
                        : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {member.divisionId ? store.getDivisionName(member.divisionId) : 'Sindh Province'}
                        </span>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SUPER ADMIN MODAL: ASSIGN / EDIT MEMBER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-left relative text-slate-900 dark:text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5 text-emerald-700 dark:text-emerald-400">
                <UserCheck className="w-6 h-6" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  {editingMember 
                    ? 'Edit Assignment' 
                    : isParliamentariansView 
                    ? 'Assign Registered Member as Youth Parliamentarian' 
                    : 'Assign Registered Member to Cabinet'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              
              {/* 1. SELECT REGISTERED PROFILE DROPDOWN */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                  SELECT REGISTERED MEMBER PROFILE
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => handleProfileSelect(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="">-- Choose from Registered Members --</option>
                  {registeredProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.cnicNumber}) - {p.divisionId ? store.getDivisionName(p.divisionId) : 'Sindh'}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Selecting a profile automatically fills Name, Photo uploaded on membership form, Division, and details.
                </p>
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

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#052818] hover:bg-[#073822] text-amber-300 font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  {editingMember ? 'Save Changes' : isParliamentariansView ? 'ASSIGN PARLIAMENTARIAN' : 'ASSIGN MEMBER'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
