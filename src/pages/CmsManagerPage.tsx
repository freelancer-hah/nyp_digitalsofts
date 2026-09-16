import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { uploadToCloudinary } from '../services/cloudinary';
import { SINDH_DIVISIONS } from '../data/sindhHierarchy';
import { CabinetMember, Announcement, LeadershipMessage, WorkingGoal } from '../types';
import { 
  Layout, 
  Plus, 
  Trash2, 
  Upload, 
  Megaphone, 
  Users, 
  Award, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  Quote, 
  Target, 
  ShieldCheck, 
  MapPin,
  Sparkles
} from 'lucide-react';

export const CmsManagerPage: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || !currentUser?.role || currentUser?.role === 'APPROVAL_AUTHORITY';
  const isDivisionalAdmin = currentUser?.role === 'DIVISIONAL_ADMIN';
  const assignedDivId = currentUser?.assignedDivisionId || SINDH_DIVISIONS[0].id;

  const [activeTab, setActiveTab] = useState<'CABINET' | 'ANNOUNCEMENTS' | 'LEADERSHIP' | 'GOALS'>('CABINET');

  // --- 1. Cabinet Form State ---
  const [cabFullName, setCabFullName] = useState('');
  const [cabDesignation, setCabDesignation] = useState('');
  const [cabLevel, setCabLevel] = useState<'PROVINCIAL' | 'DIVISIONAL'>(isDivisionalAdmin ? 'DIVISIONAL' : 'PROVINCIAL');
  const [cabDivisionId, setCabDivisionId] = useState(isDivisionalAdmin ? assignedDivId : SINDH_DIVISIONS[0].id);
  const [cabPhotoUrl, setCabPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
  const [cabBio, setCabBio] = useState('');
  const [isUploadingCabPhoto, setIsUploadingCabPhoto] = useState(false);

  // --- 2. Announcement Form State ---
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annBannerUrl, setAnnBannerUrl] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // --- 3. Leadership Message Form State ---
  const [leadTitle, setLeadTitle] = useState("President's Message");
  const [leadName, setLeadName] = useState('');
  const [leadRoleTitle, setLeadRoleTitle] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [leadPhotoUrl, setLeadPhotoUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400');
  const [isUploadingLeadPhoto, setIsUploadingLeadPhoto] = useState(false);

  // --- 4. Working Goal Form State ---
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('Parliamentary Education');
  const [goalDescription, setGoalDescription] = useState('');

  // Re-render tick for store mutations
  const [, setTick] = useState(0);

  // Sync cabinet division if user is divisional admin
  useEffect(() => {
    if (isDivisionalAdmin) {
      setCabLevel('DIVISIONAL');
      setCabDivisionId(assignedDivId);
    }
  }, [isDivisionalAdmin, assignedDivId]);

  // Photo / Banner Handlers (Cloudinary Integration)
  const handleCabPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCabPhoto(true);
    try {
      const url = await uploadToCloudinary(file);
      setCabPhotoUrl(url);
    } catch (e) {
      alert('Photo upload failed.');
    } finally {
      setIsUploadingCabPhoto(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    try {
      const url = await uploadToCloudinary(file);
      setAnnBannerUrl(url);
    } catch (e) {
      alert('Banner upload failed.');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleLeadPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLeadPhoto(true);
    try {
      const url = await uploadToCloudinary(file);
      setLeadPhotoUrl(url);
    } catch (e) {
      alert('Photo upload failed.');
    } finally {
      setIsUploadingLeadPhoto(false);
    }
  };

  // Submit Handlers
  const handleAddCabinetMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cabFullName || !cabDesignation) {
      alert('Please enter Name and Designation.');
      return;
    }
    store.addCabinetMember({
      fullName: cabFullName,
      designation: cabDesignation,
      cabinetLevel: cabLevel,
      divisionId: cabLevel === 'DIVISIONAL' ? cabDivisionId : undefined,
      photoUrl: cabPhotoUrl,
      bio: cabBio,
      displayOrder: 1,
      isActive: true,
    });

    setCabFullName('');
    setCabDesignation('');
    setCabBio('');
    setTick((t) => t + 1);
  };

  const handleDeleteCabinet = (id: string) => {
    if (confirm('Are you sure you want to remove this cabinet member?')) {
      store.deleteCabinetMember(id);
      setTick((t) => t + 1);
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) {
      alert('Please fill Title and Content.');
      return;
    }
    store.addAnnouncement({
      title: annTitle,
      content: annContent,
      publishedAt: new Date().toISOString().split('T')[0],
      bannerUrl: annBannerUrl,
      isActive: true,
    });

    setAnnTitle('');
    setAnnContent('');
    setTick((t) => t + 1);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Delete this announcement bulletin?')) {
      store.deleteAnnouncement(id);
      setTick((t) => t + 1);
    }
  };

  const handleAddLeadershipMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadRoleTitle || !leadMessage) {
      alert('Please fill Leader Name, Title, and Message.');
      return;
    }
    store.addLeadershipMessage({
      title: leadTitle,
      leaderName: leadName,
      leaderTitle: leadRoleTitle,
      messageText: leadMessage,
      photoUrl: leadPhotoUrl,
    });

    setLeadName('');
    setLeadRoleTitle('');
    setLeadMessage('');
    setTick((t) => t + 1);
  };

  const handleDeleteLeadershipMessage = (id: string) => {
    if (confirm('Delete this leadership message?')) {
      store.deleteLeadershipMessage(id);
      setTick((t) => t + 1);
    }
  };

  const handleAddWorkingGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalDescription) {
      alert('Please fill Goal Title and Description.');
      return;
    }
    store.addWorkingGoal({
      title: goalTitle,
      category: goalCategory,
      description: goalDescription,
    });

    setGoalTitle('');
    setGoalDescription('');
    setTick((t) => t + 1);
  };

  const handleDeleteWorkingGoal = (id: string) => {
    if (confirm('Delete this working goal?')) {
      store.deleteWorkingGoal(id);
      setTick((t) => t + 1);
    }
  };

  // Data fetching
  let cabinetList = store.getCabinetMembers();
  if (isDivisionalAdmin) {
    cabinetList = cabinetList.filter((m) => m.divisionId === assignedDivId);
  }

  const announcementsList = store.getAnnouncements();
  const leadershipList = store.getLeadershipMessages();
  const goalsList = store.getWorkingGoals();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left space-y-8 bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 transition-colors duration-300">
      
      {/* CMS Header & Role Status Banner */}
      <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-md backdrop-blur-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white p-0.5 border-2 border-emerald-600/30 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Website Content Management System (CMS)</h1>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                isSuperAdmin ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/60'
              }`}>
                {isSuperAdmin ? 'Super Admin Central Access' : `Divisional Sub-Admin (${store.getDivisionName(assignedDivId)})`}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Manage website announcements, news ticker, working goals, executive leadership messages, and provincial & divisional cabinet directories.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('CABINET')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'CABINET' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Cabinet Rosters</span>
          </button>

          <button
            onClick={() => setActiveTab('ANNOUNCEMENTS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'ANNOUNCEMENTS' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Announcements & News</span>
          </button>

          <button
            onClick={() => setActiveTab('LEADERSHIP')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'LEADERSHIP' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Leadership Messages</span>
          </button>

          <button
            onClick={() => setActiveTab('GOALS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'GOALS' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Working Goals</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: CABINET DIRECTORIES --- */}
      {activeTab === 'CABINET' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Cabinet Member Form */}
          <div className="lg:col-span-5">
            <form onSubmit={handleAddCabinetMember} className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-5 shadow-md rounded-3xl backdrop-blur-md">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center space-x-2 font-heading">
                  <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Add Cabinet Member / Ehedadar</span>
                </h3>
                {isDivisionalAdmin && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700 px-2 py-0.5 rounded">
                    Regional Lock
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cabinet Level *</label>
                <select
                  value={cabLevel}
                  disabled={isDivisionalAdmin}
                  onChange={(e) => setCabLevel(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs font-bold outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900"
                >
                  <option value="PROVINCIAL">Sindh Provincial Cabinet (Central Office Bearer)</option>
                  <option value="DIVISIONAL">Divisional Cabinet (Regional Member)</option>
                </select>
              </div>

              {cabLevel === 'DIVISIONAL' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Division *</label>
                  <select
                    value={cabDivisionId}
                    disabled={isDivisionalAdmin}
                    onChange={(e) => setCabDivisionId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs font-bold outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900"
                  >
                    {SINDH_DIVISIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Select from Registered Member Profiles */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select from Registered Profiles (Auto-Fill)</label>
                <select
                  onChange={(e) => {
                    const profId = e.target.value;
                    if (!profId) return;
                    const prof = store.getAllProfiles().find((p) => p.id === profId);
                    if (prof) {
                      setCabFullName(prof.fullName);
                      setCabPhotoUrl(prof.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
                      if (prof.divisionId) {
                        setCabDivisionId(prof.divisionId);
                        setCabLevel('DIVISIONAL');
                      }
                      if (prof.assignedDesignation && prof.assignedDesignation !== 'Member') {
                        setCabDesignation(prof.assignedDesignation);
                      }
                      if (prof.statementOfPurpose) {
                        setCabBio(prof.statementOfPurpose);
                      }
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs font-bold outline-none mb-3"
                >
                  <option value="">-- Select Registered Profile --</option>
                  {store.getAllProfiles().map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.cnicNumber}) - {p.divisionId ? store.getDivisionName(p.divisionId) : 'Sindh'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={cabFullName}
                  onChange={(e) => setCabFullName(e.target.value)}
                  placeholder="e.g. Abdul Rehman Halepoto"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation / Office Title *</label>
                <input
                  type="text"
                  required
                  value={cabDesignation}
                  onChange={(e) => setCabDesignation(e.target.value)}
                  placeholder="e.g. Divisional President / Youth MPA"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Profile Photograph *</label>
                <div className="flex items-center space-x-3">
                  <img
                    src={cabPhotoUrl}
                    alt="Preview"
                    className="w-12 h-14 object-cover rounded-lg border border-slate-300 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                  />
                  <label className="flex-1 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors border border-slate-300 dark:border-slate-700">
                    {isUploadingCabPhoto ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span>Upload Photo to Cloudinary</span>
                    <input type="file" accept="image/*" onChange={handleCabPhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Profile Bio</label>
                <textarea
                  rows={2}
                  value={cabBio}
                  onChange={(e) => setCabBio(e.target.value)}
                  placeholder="Key responsibilities summary"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full ui-btn-primary py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>PUBLISH TO CABINET DIRECTORY</span>
              </button>
            </form>
          </div>

          {/* Cabinet Members Active Roster */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-4 shadow-md rounded-3xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider font-heading">
                  Active Cabinet Members ({cabinetList.length})
                </h3>
                {isDivisionalAdmin && (
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{store.getDivisionName(assignedDivId)} Roster</span>
                  </span>
                )}
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {cabinetList.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs italic bg-slate-50 dark:bg-slate-950 rounded-2xl">
                    No cabinet members found in this view.
                  </div>
                ) : (
                  cabinetList.map((m) => (
                    <div key={m.id} className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-4 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={m.photoUrl}
                          alt={m.fullName}
                          className="w-12 h-14 object-cover rounded-xl border border-emerald-600 bg-white shrink-0 shadow-sm"
                        />
                        <div>
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            {m.cabinetLevel} {m.divisionId ? `• ${store.getDivisionName(m.divisionId)}` : ''}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 font-heading">{m.fullName}</h4>
                          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">{m.designation}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteCabinet(m.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Remove Cabinet Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 2: ANNOUNCEMENTS & NEWS TICKER --- */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Announcement Form */}
          <div className="lg:col-span-5">
            {!isSuperAdmin ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 p-8 rounded-3xl text-center space-y-4">
                <Lock className="w-10 h-10 text-amber-700 dark:text-amber-400 mx-auto" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">Super Admin Central Access Required</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Website main announcements, news ticker bulletins, and banners can only be published by Super Admin central authority.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddAnnouncement} className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-5 shadow-md rounded-3xl backdrop-blur-md">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center space-x-2 font-heading">
                  <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Publish News Bulletin / Announcement</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Announcement Title *</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Schedule for Sindh Youth Assembly Summit 2026"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Banner Image *</label>
                  <div className="space-y-2">
                    <img
                      src={annBannerUrl}
                      alt="Banner Preview"
                      className="w-full h-32 object-cover rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                    />
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors border border-slate-300 dark:border-slate-700">
                      {isUploadingBanner ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                      <span>Upload Banner Image</span>
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Announcement Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="Detailed press release or notification description..."
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full ui-btn-primary py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>PUBLISH ANNOUNCEMENT TO WEBSITE</span>
                </button>
              </form>
            )}
          </div>

          {/* Published Announcements List */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-4 shadow-md rounded-3xl backdrop-blur-md">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 font-heading">
                Published News Bulletins ({announcementsList.length})
              </h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {announcementsList.map((ann) => (
                  <div key={ann.id} className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-4 rounded-2xl space-y-2 relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block">{ann.publishedAt}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm font-heading">{ann.title}</h4>
                      </div>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                          title="Delete Announcement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 3: LEADERSHIP MESSAGES --- */}
      {activeTab === 'LEADERSHIP' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Leadership Message Form */}
          <div className="lg:col-span-5">
            {!isSuperAdmin ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 p-8 rounded-3xl text-center space-y-4">
                <Lock className="w-10 h-10 text-amber-700 dark:text-amber-400 mx-auto" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">Super Admin Central Access Required</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Executive leadership messages (Patron/President statements) are managed centrally by Super Admin.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddLeadershipMessage} className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-5 shadow-md rounded-3xl backdrop-blur-md">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center space-x-2 font-heading">
                  <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Publish Executive Leadership Message</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message Header Title *</label>
                  <input
                    type="text"
                    required
                    value={leadTitle}
                    onChange={(e) => setLeadTitle(e.target.value)}
                    placeholder="e.g. President's Message / Chairman's Message"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Leader Full Name *</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Abdul Rehman Halepoto"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Leader Title / Designation *</label>
                  <input
                    type="text"
                    required
                    value={leadRoleTitle}
                    onChange={(e) => setLeadRoleTitle(e.target.value)}
                    placeholder="e.g. President, National Youth Parliament (NYP) Sindh"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Leader Portrait Photograph *</label>
                  <div className="flex items-center space-x-3">
                    <img
                      src={leadPhotoUrl}
                      alt="Preview"
                      className="w-12 h-14 object-cover rounded-lg border border-slate-300 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                    />
                    <label className="flex-1 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors border border-slate-300 dark:border-slate-700">
                      {isUploadingLeadPhoto ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                      <span>Upload Portrait Photo</span>
                      <input type="file" accept="image/*" onChange={handleLeadPhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Statement / Quote *</label>
                  <textarea
                    rows={4}
                    required
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    placeholder="Full executive message to youth of Sindh..."
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full ui-btn-primary py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>PUBLISH LEADERSHIP MESSAGE</span>
                </button>
              </form>
            )}
          </div>

          {/* Active Leadership Messages */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-4 shadow-md rounded-3xl backdrop-blur-md">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 font-heading">
                Active Leadership Messages ({leadershipList.length})
              </h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {leadershipList.map((msg) => (
                  <div key={msg.id} className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-5 rounded-2xl space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={msg.photoUrl}
                          alt={msg.leaderName}
                          className="w-12 h-14 object-cover rounded-xl border-2 border-emerald-600 bg-white shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block">{msg.title}</span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm font-heading">{msg.leaderName}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">{msg.leaderTitle}</span>
                        </div>
                      </div>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDeleteLeadershipMessage(msg.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <blockquote className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-emerald-600 pl-3 py-1">
                      "{msg.messageText}"
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 4: WORKING GOALS --- */}
      {activeTab === 'GOALS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Goal Form */}
          <div className="lg:col-span-5">
            {!isSuperAdmin ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 p-8 rounded-3xl text-center space-y-4">
                <Lock className="w-10 h-10 text-amber-700 dark:text-amber-400 mx-auto" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">Super Admin Central Access Required</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Provincial working goals and strategic pillars can only be edited by Super Admin central authority.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddWorkingGoal} className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-5 shadow-md rounded-3xl backdrop-blur-md">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center space-x-2 font-heading">
                  <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Add Strategic Working Goal</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Goal Category *</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs font-bold outline-none"
                  >
                    <option value="Parliamentary Education">Parliamentary Education</option>
                    <option value="Civic Governance">Civic Governance</option>
                    <option value="Youth Empowerment">Youth Empowerment</option>
                    <option value="Legal & Human Rights">Legal & Human Rights</option>
                    <option value="Digital Innovation">Digital Innovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Goal Title *</label>
                  <input
                    type="text"
                    required
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="e.g. Constitutional & Legislative Literacy"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                    placeholder="Describe how this working goal empowers youth in Sindh..."
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full ui-btn-primary py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>PUBLISH WORKING GOAL</span>
                </button>
              </form>
            )}
          </div>

          {/* Active Goals List */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-4 shadow-md rounded-3xl backdrop-blur-md">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 font-heading">
                Active Strategic Working Goals ({goalsList.length})
              </h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {goalsList.map((g) => (
                  <div key={g.id} className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-5 rounded-2xl space-y-2 relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60 px-2.5 py-0.5 rounded-full uppercase inline-block mb-1">
                          {g.category}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm font-heading">{g.title}</h4>
                      </div>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDeleteWorkingGoal(g.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{g.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
