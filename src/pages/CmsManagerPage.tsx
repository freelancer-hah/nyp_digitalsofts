import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { uploadToCloudinary } from '../services/cloudinary';
import { SINDH_DIVISIONS } from '../data/sindhHierarchy';
import { CabinetMember, Announcement, LeadershipMessage, MediaItem } from '../types';
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
  Sparkles,
  Film,
  Image as ImageIcon,
  Video,
  Calendar,
  Eye
} from 'lucide-react';

export const CmsManagerPage: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || !currentUser?.role || currentUser?.role === 'APPROVAL_AUTHORITY';
  const isDivisionalAdmin = currentUser?.role === 'DIVISIONAL_ADMIN';
  const assignedDivId = currentUser?.assignedDivisionId || SINDH_DIVISIONS[0].id;

  const [activeTab, setActiveTab] = useState<'ANNOUNCEMENTS' | 'LEADERSHIP' | 'GALLERY'>('ANNOUNCEMENTS');

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
  const [annPublishedAt, setAnnPublishedAt] = useState(new Date().toISOString().split('T')[0]);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // --- 3. Leadership Message Form State ---
  const [leadTitle, setLeadTitle] = useState("President's Message");
  const [leadName, setLeadName] = useState('');
  const [leadRoleTitle, setLeadRoleTitle] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [leadPhotoUrl, setLeadPhotoUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400');
  const [isUploadingLeadPhoto, setIsUploadingLeadPhoto] = useState(false);

  // --- 4. Media Gallery Form State ---
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState('Youth Summit');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1000');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaEventDate, setMediaEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [mediaLocation, setMediaLocation] = useState('Karachi, Sindh');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);


  // Re-render tick for store mutations
  const [, setTick] = useState(0);

  useEffect(() => {
    store.fetchFromSupabase().then(() => {
      setTick((t) => t + 1);
    });
  }, []);

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

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMedia(true);
    try {
      const url = await uploadToCloudinary(file);
      setMediaUrl(url);
    } catch (e) {
      alert('Media upload failed.');
    } finally {
      setIsUploadingMedia(false);
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
      publishedAt: annPublishedAt || new Date().toISOString().split('T')[0],
      bannerUrl: annBannerUrl,
      isActive: true,
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnPublishedAt(new Date().toISOString().split('T')[0]);
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

  const handleAddMediaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle || !mediaUrl || !mediaDescription) {
      alert('Please fill Media Title, Media URL, and Description.');
      return;
    }
    store.addMediaItem({
      title: mediaTitle,
      category: mediaCategory,
      mediaType,
      mediaUrl,
      description: mediaDescription,
      eventDate: mediaEventDate,
      location: mediaLocation,
    });

    setMediaTitle('');
    setMediaDescription('');
    setTick((t) => t + 1);
  };

  const handleDeleteMediaItem = (id: string) => {
    if (confirm('Delete this item from Media Gallery?')) {
      store.deleteMediaItem(id);
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
  const mediaList = store.getMediaItems();


  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left space-y-8 bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 transition-colors duration-300">
      
      {/* CMS Header Banner */}
      <div className="bg-white border border-slate-200/90 text-slate-900 dark:bg-slate-900/90 dark:border-slate-800 dark:text-white p-6 sm:p-7 rounded-3xl space-y-6 shadow-xl backdrop-blur-md">
        
        {/* Top Header Row: Logo, Title, Subtext & Role Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
          
          {/* Logo & Title Block */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-emerald-600/40 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
              <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight leading-tight">
                Website Content Management System (CMS)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Manage website announcements, news ticker bulletins, leadership messages, and program media gallery.
              </p>
            </div>
          </div>

          {/* Access Role Pill Badge */}
          <div className="shrink-0 self-start md:self-center">
            <span className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm border ${
              isSuperAdmin 
                ? 'bg-[#052818] text-amber-300 border-amber-400/40' 
                : 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/60'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSuperAdmin ? 'Super Admin Central Access' : `Divisional Sub-Admin (${store.getDivisionName(assignedDivId)})`}</span>
            </span>
          </div>

        </div>

        {/* Bottom Tab Bar Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
            SELECT CMS MANAGEMENT MODULE:
          </div>

          {/* Tab Button Pills */}
          <div className="inline-flex items-center space-x-1.5 p-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-2xl w-full sm:w-auto overflow-x-auto shadow-inner">
            <button
              onClick={() => setActiveTab('ANNOUNCEMENTS')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'ANNOUNCEMENTS' 
                  ? 'bg-[#052818] text-amber-300 shadow-md font-extrabold border border-amber-400/40' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <Megaphone className={`w-4 h-4 ${activeTab === 'ANNOUNCEMENTS' ? 'text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span>Announcements &amp; News</span>
            </button>

            <button
              onClick={() => setActiveTab('LEADERSHIP')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'LEADERSHIP' 
                  ? 'bg-[#052818] text-amber-300 shadow-md font-extrabold border border-amber-400/40' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <Award className={`w-4 h-4 ${activeTab === 'LEADERSHIP' ? 'text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span>Leadership Messages</span>
            </button>

            <button
              onClick={() => setActiveTab('GALLERY')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'GALLERY' 
                  ? 'bg-[#052818] text-amber-300 shadow-md font-extrabold border border-amber-400/40' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <Film className={`w-4 h-4 ${activeTab === 'GALLERY' ? 'text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span>Media &amp; Event Gallery</span>
            </button>
          </div>

        </div>

      </div>

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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Publication Date * (Select Date for Current or Past Missed Bulletin)</label>
                  <input
                    type="date"
                    required
                    value={annPublishedAt}
                    onChange={(e) => setAnnPublishedAt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-emerald-600"
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

      {/* --- TAB 3: MEDIA & PROGRAM GALLERY --- */}
      {activeTab === 'GALLERY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Media Item Form */}
          <div className="lg:col-span-5">
            {!isSuperAdmin ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 p-8 rounded-3xl text-center space-y-4">
                <Lock className="w-10 h-10 text-amber-700 dark:text-amber-400 mx-auto" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">Super Admin Central Access Required</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Website media and event gallery items are published and managed by Super Admin central authority.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddMediaItem} className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-5 shadow-md rounded-3xl backdrop-blur-md">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center space-x-2 font-heading">
                  <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Publish Media / Program Gallery Item</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Program / Event Title *</label>
                  <input
                    type="text"
                    required
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    placeholder="e.g. Sindh Youth Leadership Convention 2026"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                    <select
                      value={mediaCategory}
                      onChange={(e) => setMediaCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs font-bold outline-none"
                    >
                      <option value="Youth Summit">Youth Summit</option>
                      <option value="Assembly Session">Assembly Session</option>
                      <option value="Divisional Meetup">Divisional Meetup</option>
                      <option value="Community Outreach">Community Outreach</option>
                      <option value="Policy Workshop">Policy Workshop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Media Format *</label>
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value as 'IMAGE' | 'VIDEO')}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs font-bold outline-none"
                    >
                      <option value="IMAGE">Photo Image</option>
                      <option value="VIDEO">Video Coverage</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Date</label>
                    <input
                      type="date"
                      value={mediaEventDate}
                      onChange={(e) => setMediaEventDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / Venue</label>
                    <input
                      type="text"
                      value={mediaLocation}
                      onChange={(e) => setMediaLocation(e.target.value)}
                      placeholder="e.g. Karachi Assembly Hall"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Media URL / Upload Image *</label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      required
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or video link"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                    />
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors border border-slate-300 dark:border-slate-700">
                      {isUploadingMedia ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                      <span>Upload High-Res Photo</span>
                      <input type="file" accept="image/*" onChange={handleMediaUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Program Details &amp; Summary *</label>
                  <textarea
                    rows={4}
                    required
                    value={mediaDescription}
                    onChange={(e) => setMediaDescription(e.target.value)}
                    placeholder="Describe program highlights, attendance, resolutions passed..."
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl p-2.5 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full ui-btn-primary py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>PUBLISH TO MEDIA GALLERY</span>
                </button>
              </form>
            )}
          </div>

          {/* Published Media Gallery Items List */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-4 shadow-md rounded-3xl backdrop-blur-md">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 font-heading">
                Published Media &amp; Program Gallery ({mediaList.length})
              </h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {mediaList.map((m) => (
                  <div key={m.id} className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-4 rounded-2xl space-y-3 relative flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    
                    {/* Thumbnail */}
                    <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                      <img src={m.mediaUrl} alt={m.title} className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-md text-amber-300 p-1 rounded-md text-[10px] font-bold flex items-center space-x-1">
                        {m.mediaType === 'VIDEO' ? <Video className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                        <span>{m.mediaType}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1.5 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-md uppercase">
                          {m.category}
                        </span>
                        {m.eventDate && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{m.eventDate}</span>
                          </span>
                        )}
                        {m.location && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{m.location}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-sm font-heading">{m.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{m.description}</p>
                    </div>

                    {/* Delete button */}
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleDeleteMediaItem(m.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-center"
                        title="Delete Media Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

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
