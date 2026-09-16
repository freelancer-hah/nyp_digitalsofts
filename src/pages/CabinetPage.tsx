import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { store } from '../services/store';
import { SINDH_DIVISIONS } from '../data/sindhHierarchy';
import { CabinetMember, MemberProfile } from '../types';
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
  Award,
  Crown,
  CheckCircle2,
  Lock
} from 'lucide-react';

const PRESET_DESIGNATIONS = [
  'President NYP Sindh',
  'Chairman & Management Focal Person',
  'General Secretary',
  'Information Secretary',
  'Vice President',
  'Finance Secretary',
  'Joint Secretary',
  'Divisional President',
  'Divisional General Secretary',
  'Divisional Information Secretary',
  'Youth MPA Representative'
];

export const CabinetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeDivParam = searchParams.get('div') || 'ALL';

  const [selectedDiv, setSelectedDiv] = useState(activeDivParam);
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'PROVINCIAL' | 'DIVISIONAL'>('ALL');

  // Auth / Admin Status
  const currentUser = store.getCurrentUser();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PRESIDENT' || currentUser?.role === 'APPROVAL_AUTHORITY';

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

  const registeredProfiles = store.getAllProfiles();

  const cabinetMembers = store.getCabinetMembers(
    selectedLevel === 'ALL' ? undefined : selectedLevel,
    selectedDiv === 'ALL' ? undefined : selectedDiv
  );

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setSelectedProfileId('');
    setFullName('');
    setDesignation('President NYP Sindh');
    setCabinetLevel('PROVINCIAL');
    setDivisionId(SINDH_DIVISIONS[0].id);
    setPhotoUrl('/nyp-president.png');
    setBio('');
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
    setIsModalOpen(true);
  };

  const handleProfileSelect = (profId: string) => {
    setSelectedProfileId(profId);
    if (!profId) return;

    const prof = registeredProfiles.find((p) => p.id === profId);
    if (prof) {
      setFullName(prof.fullName);
      setPhotoUrl(prof.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
      if (prof.divisionId) {
        setDivisionId(prof.divisionId);
        setCabinetLevel('DIVISIONAL');
      }
      if (prof.assignedDesignation && prof.assignedDesignation !== 'Member') {
        setDesignation(prof.assignedDesignation);
      }
      if (prof.statementOfPurpose) {
        setBio(prof.statementOfPurpose);
      }
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !designation) {
      alert('Please fill Member Name and Designation.');
      return;
    }

    if (editingMember) {
      store.updateCabinetMember(editingMember.id, {
        fullName,
        designation,
        cabinetLevel,
        divisionId: cabinetLevel === 'DIVISIONAL' ? divisionId : undefined,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        bio,
        memberProfileId: selectedProfileId || undefined,
      });
    } else {
      store.addCabinetMember({
        fullName,
        designation,
        cabinetLevel,
        divisionId: cabinetLevel === 'DIVISIONAL' ? divisionId : undefined,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        bio,
        displayOrder: 1,
        isActive: true,
        memberProfileId: selectedProfileId || undefined,
      });
    }

    setIsModalOpen(false);
    setTick((t) => t + 1);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the Executive Cabinet?`)) {
      store.deleteCabinetMember(id);
      setTick((t) => t + 1);
    }
  };

  const isProvincialPresident = (member: CabinetMember) => {
    const des = member.designation.toLowerCase();
    return des.includes('president nyp sindh') || (des.includes('president') && member.cabinetLevel === 'PROVINCIAL' && !des.includes('vice') && !des.includes('divisional'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in font-sans">
      
      {/* Top Banner / Header */}
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Super Admin Control Bar */}
        {isSuperAdmin && (
          <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-amber-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/50 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">SUPER ADMIN ACCESS ENABLED</span>
                <p className="text-xs text-slate-300">You can assign registered member profiles to official cabinet positions.</p>
              </div>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 shrink-0 transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Member Profile</span>
            </button>
          </div>
        )}

        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-extrabold text-amber-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>EXECUTIVE CABINET & OFFICE BEARERS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-heading text-white">
            NYP Sindh Executive Leadership Directory
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Official public directory of provincial leadership and divisional cabinet members across Sindh Province.
          </p>
        </div>

      </div>

      {/* Filter Tabs Toolbar */}
      <div className="max-w-7xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        
        {/* Division Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedDiv('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
              selectedDiv === 'ALL'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
            }`}
          >
            All Sindh Cabinets
          </button>

          {SINDH_DIVISIONS.map((div) => (
            <button
              key={div.id}
              onClick={() => setSelectedDiv(div.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                selectedDiv === div.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {div.name.replace(' Division', '')}
            </button>
          ))}
        </div>

        {/* Level Filter Toggle */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedLevel('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              selectedLevel === 'ALL' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Levels
          </button>
          <button
            onClick={() => setSelectedLevel('PROVINCIAL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              selectedLevel === 'PROVINCIAL' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Provincial
          </button>
          <button
            onClick={() => setSelectedLevel('DIVISIONAL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              selectedLevel === 'DIVISIONAL' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Divisional
          </button>
        </div>

      </div>

      {/* Grid of Cabinet Members */}
      <div className="max-w-7xl mx-auto space-y-6">
        {cabinetMembers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs bg-slate-900 rounded-3xl border border-slate-800 shadow-sm space-y-3">
            <Users className="w-10 h-10 mx-auto text-slate-600" />
            <p>No cabinet members found for the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cabinetMembers.map((member) => {
              const isPresident = isProvincialPresident(member);

              return (
                <div
                  key={member.id}
                  className={`relative rounded-3xl overflow-hidden transition-all duration-300 text-left flex flex-col justify-between group ${
                    isPresident
                      ? 'md:col-span-2 lg:col-span-3 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 border-2 border-amber-400/90 shadow-2xl p-6 sm:p-8'
                      : 'bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 shadow-xl p-5'
                  }`}
                >
                  {/* Card Content */}
                  <div className="space-y-4">
                    
                    {/* Header Badge & Admin Actions */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                        isPresident 
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                          : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}>
                        {member.cabinetLevel} CABINET
                      </span>

                      {isSuperAdmin && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(member)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                            title="Edit Assignment"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, member.fullName)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                            title="Remove Member Slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Member Details */}
                    {isPresident ? (
                      /* PROVINCIAL PRESIDENT: BARI PHOTO PROFILE CARD */
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
                        {/* Big Photo Profile */}
                        <div className="sm:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                          <div className="w-36 h-44 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-slate-950 shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={member.photoUrl}
                              alt={member.fullName}
                              className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute bottom-2 right-2 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md">
                              <Crown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="sm:col-span-8 space-y-3">
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                              {member.fullName}
                            </h2>
                            <p className="text-sm font-extrabold text-amber-300 uppercase tracking-wider mt-0.5">
                              {member.designation}
                            </p>
                          </div>

                          {member.bio && (
                            <blockquote className="text-xs sm:text-sm text-emerald-100 italic border-l-2 border-amber-400 pl-3.5 py-1 leading-relaxed whitespace-pre-line font-serif">
                              "{member.bio}"
                            </blockquote>
                          )}

                          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold pt-2">
                            <MapPin className="w-4 h-4 text-amber-400" />
                            <span>
                              {member.divisionId ? store.getDivisionName(member.divisionId) : 'Sindh Province'}
                            </span>
                            <ShieldCheck className="w-4 h-4 text-emerald-400 ml-auto" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* OTHER MEMBERS: CHOTI PHOTO PROFILE CARD */
                      <div className="space-y-4 pt-1">
                        <div className="flex items-center space-x-3.5">
                          {/* Small Photo Profile */}
                          <div className="w-14 h-16 rounded-xl overflow-hidden border-2 border-emerald-500/70 shadow-md bg-slate-950 shrink-0">
                            <img
                              src={member.photoUrl}
                              alt={member.fullName}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div>
                            <h3 className="font-black text-white text-base leading-snug font-heading group-hover:text-emerald-400 transition-colors">
                              {member.fullName}
                            </h3>
                            <p className="text-xs font-bold text-emerald-400 mt-0.5">{member.designation}</p>
                          </div>
                        </div>

                        {member.bio && (
                          <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-emerald-500/70 pl-3 line-clamp-3">
                            "{member.bio}"
                          </p>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Card Footer (Non-President) */}
                  {!isPresident && (
                    <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-bold">
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

      {/* SUPER ADMIN MODAL: ASSIGN / EDIT CABINET MEMBER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-left relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2 text-emerald-400">
                <UserCheck className="w-5 h-5" />
                <h3 className="text-lg font-black text-white font-heading">
                  {editingMember ? 'Edit Cabinet Assignment' : 'Assign Registered Member to Cabinet'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              
              {/* 1. Select Registered Profile Dropdown */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-300 block uppercase tracking-wider">
                  Select Registered Member Profile
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => handleProfileSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="">-- Choose from Registered Members --</option>
                  {registeredProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.cnicNumber}) - {p.divisionId ? store.getDivisionName(p.divisionId) : 'Sindh'}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  Selecting a profile automatically fills Name, Photo, Division, and details.
                </p>
              </div>

              {/* 2. Member Name */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-300 block uppercase tracking-wider">
                  Member Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abdul Rehman Halepoto"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* 3. Designation / Ohda Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-300 block uppercase tracking-wider">
                    Select Preset Designation (Ohda)
                  </label>
                  <select
                    value={PRESET_DESIGNATIONS.includes(designation) ? designation : 'CUSTOM'}
                    onChange={(e) => {
                      if (e.target.value !== 'CUSTOM') {
                        setDesignation(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {PRESET_DESIGNATIONS.map((des) => (
                      <option key={des} value={des}>
                        {des}
                      </option>
                    ))}
                    <option value="CUSTOM">Custom Designation...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-300 block uppercase tracking-wider">
                    Official Title / Designation Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. President NYP Sindh"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* 4. Level & Division */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-300 block uppercase tracking-wider">
                    Cabinet Level
                  </label>
                  <select
                    value={cabinetLevel}
                    onChange={(e) => setCabinetLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="PROVINCIAL">Provincial Level</option>
                    <option value="DIVISIONAL">Divisional Level</option>
                  </select>
                </div>

                {cabinetLevel === 'DIVISIONAL' && (
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-300 block uppercase tracking-wider">
                      Select Division
                    </label>
                    <select
                      value={divisionId}
                      onChange={(e) => setDivisionId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
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

              {/* 5. Photo URL */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-300 block uppercase tracking-wider">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="/nyp-president.png or https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* 6. Bio / Quote Statement */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-300 block uppercase tracking-wider">
                  Guiding Quote / Statement
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Executive Head leading provincial youth policy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black uppercase tracking-wider shadow-md"
                >
                  {editingMember ? 'Save Changes' : 'Assign Member'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
