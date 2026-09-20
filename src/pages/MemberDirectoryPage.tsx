import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Users, 
  Droplet, 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Filter, 
  X, 
  Download, 
  Copy, 
  Check, 
  Grid, 
  List, 
  RefreshCw, 
  Eye, 
  MessageCircle, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { store } from '../services/store';
import { MemberProfile } from '../types';
import { SINDH_DIVISIONS, SINDH_DISTRICTS, SINDH_TALUKAS } from '../data/sindhHierarchy';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const MemberDirectoryPage: React.FC = () => {
  const [profiles, setProfiles] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal / Detailed Drawer State
  const [selectedProfile, setSelectedProfile] = useState<MemberProfile | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [copiedAllPhones, setCopiedAllPhones] = useState(false);

  // Load profiles from store / remote
  const loadData = async () => {
    setLoading(true);
    try {
      await store.fetchFromSupabase();
      setProfiles([...store.getAllProfiles()]);
    } catch (e) {
      console.error('Failed to load profiles:', e);
      setProfiles([...store.getAllProfiles()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered districts based on chosen division
  const availableDistricts = useMemo(() => {
    if (selectedDivision === 'ALL') {
      return SINDH_DISTRICTS;
    }
    return SINDH_DISTRICTS.filter((d) => d.divisionId === selectedDivision);
  }, [selectedDivision]);

  // Main Filtering Logic
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // 1. Blood Group Filter
      if (selectedBloodGroup !== 'ALL') {
        const bg = (p.bloodGroup || '').trim().toUpperCase();
        if (bg !== selectedBloodGroup.toUpperCase()) return false;
      }

      // 2. Division Filter
      if (selectedDivision !== 'ALL') {
        if (p.divisionId !== selectedDivision) return false;
      }

      // 3. District Filter
      if (selectedDistrict !== 'ALL') {
        if (p.districtId !== selectedDistrict) return false;
      }

      // 4. Status Filter
      if (selectedStatus !== 'ALL') {
        if (p.status !== selectedStatus) return false;
      }

      // 5. Gender Filter
      if (selectedGender !== 'ALL') {
        if (p.gender !== selectedGender) return false;
      }

      // 6. Universal Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const rawQueryCnic = query.replace(/[^0-9]/g, '');
        const memberRawCnic = (p.cnicNumber || '').replace(/[^0-9]/g, '');

        const matchesName = (p.fullName || '').toLowerCase().includes(query);
        const matchesFather = (p.fatherGuardianName || '').toLowerCase().includes(query);
        const matchesEmail = (p.email || '').toLowerCase().includes(query);
        const matchesPhone = (p.mobileNumber || '').includes(query);
        const matchesCnic = (p.cnicNumber || '').toLowerCase().includes(query) || 
                            (rawQueryCnic && memberRawCnic.includes(rawQueryCnic));
        const matchesMemId = (p.membershipIdNumber || '').toLowerCase().includes(query);
        const matchesCity = (p.cityTown || '').toLowerCase().includes(query);
        const matchesProfession = (p.profession || '').toLowerCase().includes(query);
        const matchesDesignation = (p.assignedDesignation || '').toLowerCase().includes(query);
        const matchesDept = (p.preferredDepartment || '').toLowerCase().includes(query);

        if (!matchesName && !matchesFather && !matchesEmail && !matchesPhone && 
            !matchesCnic && !matchesMemId && !matchesCity && !matchesProfession && 
            !matchesDesignation && !matchesDept) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, selectedBloodGroup, selectedDivision, selectedDistrict, selectedStatus, selectedGender, searchQuery]);

  // Quick Reset
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBloodGroup('ALL');
    setSelectedDivision('ALL');
    setSelectedDistrict('ALL');
    setSelectedStatus('ALL');
    setSelectedGender('ALL');
  };

  // Copy Single Phone
  const handleCopyPhone = (phone: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Copy All Filtered Phone Numbers for WhatsApp/SMS broadcast
  const handleCopyAllPhones = () => {
    const numbers = filteredProfiles
      .map((p) => p.mobileNumber)
      .filter((num) => Boolean(num))
      .join(', ');
    
    if (numbers) {
      navigator.clipboard.writeText(numbers);
      setCopiedAllPhones(true);
      setTimeout(() => setCopiedAllPhones(false), 2500);
    }
  };

  // Export Filtered Members to CSV (Excel format)
  const handleExportCSV = () => {
    if (filteredProfiles.length === 0) return;

    const headers = [
      'Membership ID',
      'Full Name',
      'Father Name',
      'CNIC Number',
      'Blood Group',
      'Mobile Number',
      'Email',
      'Gender',
      'Division',
      'District',
      'Taluka',
      'City / Town',
      'Residential Address',
      'Profession',
      'Qualification',
      'Status',
      'Assigned Designation',
      'Registration Date'
    ];

    const rows = filteredProfiles.map((p) => [
      `"${p.membershipIdNumber || 'N/A'}"`,
      `"${p.fullName || ''}"`,
      `"${p.fatherGuardianName || ''}"`,
      `"${p.cnicNumber || ''}"`,
      `"${p.bloodGroup || 'N/A'}"`,
      `"${p.mobileNumber || ''}"`,
      `"${p.email || ''}"`,
      `"${p.gender || ''}"`,
      `"${store.getDivisionName(p.divisionId)}"`,
      `"${store.getDistrictName(p.districtId)}"`,
      `"${store.getTalukaName(p.talukaId)}"`,
      `"${p.cityTown || ''}"`,
      `"${(p.residentialAddress || '').replace(/"/g, '""')}"`,
      `"${p.profession || ''}"`,
      `"${p.qualification || ''}"`,
      `"${p.status || ''}"`,
      `"${p.assignedDesignation || 'Applicant'}"`,
      `"${p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NYP_Sindh_Members_${selectedDivision}_${selectedBloodGroup}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>APPROVED</span>
          </span>
        );
      case 'PAYMENT_SUBMITTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-700/60 shadow-2xs">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>FEE SUBMITTED</span>
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/60 shadow-2xs">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            <span>VERIFIED</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700/60 shadow-2xs">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>REJECTED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shadow-2xs">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>PENDING</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* ================= HEADER & STATS ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0b1320] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 flex items-center justify-center text-teal-800 dark:text-teal-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                Members Directory &amp; Blood Donor Search
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Web Coordinator Central Portal • Real-time search across all registered youth, divisional profiles &amp; blood groups
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-2xs"
            title="Refresh from Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleCopyAllPhones}
            disabled={filteredProfiles.length === 0}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 dark:text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border border-emerald-300 dark:border-emerald-700/60 cursor-pointer shadow-2xs disabled:opacity-50"
            title="Copy all filtered phone numbers for WhatsApp / Broadcast"
          >
            {copiedAllPhones ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{copiedAllPhones ? 'Phones Copied!' : `Copy ${filteredProfiles.length} Numbers`}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filteredProfiles.length === 0}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            title="Export filtered records to Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ================= STAT SUMMARY TILES ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#0b1320] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-2">
            {profiles.length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0b1320] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <span>Approved Members</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-heading mt-2">
            {profiles.filter((p) => p.status === 'APPROVED').length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0b1320] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-xs font-bold">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 font-heading mt-2">
            {profiles.filter((p) => p.status === 'PENDING_VERIFICATION' || p.status === 'PAYMENT_SUBMITTED').length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0b1320] p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/10 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 text-xs font-bold">
            <span>Blood Donors</span>
            <Droplet className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 font-heading mt-2">
            {profiles.filter((p) => Boolean(p.bloodGroup)).length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0b1320] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 text-xs font-bold">
            <span>Divisions Active</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-700 dark:text-purple-400 font-heading mt-2">
            {SINDH_DIVISIONS.length}
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-[#042013] p-4 rounded-2xl border border-emerald-300 dark:border-emerald-700/60 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <span>Filtered Results</span>
            <Filter className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 dark:text-emerald-300 font-heading mt-2">
            {filteredProfiles.length}
          </div>
        </div>
      </div>

      {/* ================= ADVANCED FILTER CONTROLS ================= */}
      <div className="bg-white dark:bg-[#0b1320] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        
        {/* Top Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Full Name, CNIC (e.g. 41304...), Mobile, Membership ID, Email, City or Profession..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-11 pr-10 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          
          {/* 1. Blood Group Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-rose-700 dark:text-rose-400 flex items-center space-x-1">
              <Droplet className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span>Blood Group</span>
            </label>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-bold focus:border-rose-500 outline-none transition-all"
            >
              <option value="ALL">🩸 All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg} Positive / Negative
                </option>
              ))}
            </select>
          </div>

          {/* 2. Division Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Division (Sindh)</span>
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedDistrict('ALL'); // Reset district when division changes
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:border-teal-500 outline-none transition-all"
            >
              <option value="ALL">🏛️ All 6 Divisions</option>
              {SINDH_DIVISIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. District Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>District</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={selectedDivision === 'ALL' && availableDistricts.length > 20}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:border-teal-500 outline-none transition-all disabled:opacity-60"
            >
              <option value="ALL">📍 All Districts</option>
              {availableDistricts.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Application Status Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:border-teal-500 outline-none transition-all"
            >
              <option value="ALL">🌟 All Statuses</option>
              <option value="APPROVED">✅ Approved Members</option>
              <option value="PENDING_VERIFICATION">⏳ Pending Verification</option>
              <option value="VERIFIED">🛡️ Verified by Officer</option>
              <option value="PAYMENT_SUBMITTED">💳 Fee Submitted</option>
              <option value="REJECTED">❌ Rejected</option>
            </select>
          </div>

          {/* 5. Gender Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Gender</span>
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:border-teal-500 outline-none transition-all"
            >
              <option value="ALL">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

        </div>

        {/* Filter Badges & View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-bold">Active Filters:</span>
            
            {selectedBloodGroup !== 'ALL' && (
              <span className="bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border border-rose-300 dark:border-rose-800 px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1">
                <Droplet className="w-3 h-3 fill-current" />
                <span>Blood: {selectedBloodGroup}</span>
                <button onClick={() => setSelectedBloodGroup('ALL')} className="hover:text-rose-950 ml-1">×</button>
              </span>
            )}

            {selectedDivision !== 'ALL' && (
              <span className="bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200 border border-teal-300 dark:border-teal-800 px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1">
                <span>Division: {store.getDivisionName(selectedDivision)}</span>
                <button onClick={() => setSelectedDivision('ALL')} className="hover:text-teal-950 ml-1">×</button>
              </span>
            )}

            {selectedDistrict !== 'ALL' && (
              <span className="bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border border-blue-300 dark:border-blue-800 px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1">
                <span>District: {store.getDistrictName(selectedDistrict)}</span>
                <button onClick={() => setSelectedDistrict('ALL')} className="hover:text-blue-950 ml-1">×</button>
              </span>
            )}

            {selectedStatus !== 'ALL' && (
              <span className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1">
                <span>Status: {selectedStatus}</span>
                <button onClick={() => setSelectedStatus('ALL')} className="hover:text-emerald-950 ml-1">×</button>
              </span>
            )}

            {searchQuery && (
              <span className="bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-800 px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1">
                <span>Search: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-purple-950 ml-1">×</button>
              </span>
            )}

            {(selectedBloodGroup !== 'ALL' || selectedDivision !== 'ALL' || selectedDistrict !== 'ALL' || selectedStatus !== 'ALL' || selectedGender !== 'ALL' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-rose-600 dark:text-rose-400 hover:underline font-bold px-2 py-1"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Grid / Table View Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-teal-800 dark:bg-teal-950 dark:text-teal-200 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-teal-800 dark:bg-teal-950 dark:text-teal-200 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

        </div>

      </div>

      {/* ================= RESULTS DISPLAY ================= */}
      {loading ? (
        <div className="bg-white dark:bg-[#0b1320] p-16 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <RefreshCw className="w-10 h-10 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Loading Members Directory...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="bg-white dark:bg-[#0b1320] p-16 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">No Members Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              No registered members match your search criteria or selected blood group / division filter.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ================= GRID / CARDS VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfiles.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedProfile(member)}
              className="bg-white dark:bg-[#0b1320] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500/80 p-5 space-y-4 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-amber-400 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Profile Card Header */}
              <div className="flex items-start justify-between gap-3 pt-1">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs relative">
                    <img
                      src={member.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                      alt={member.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base font-heading group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {member.fullName}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      S/o {member.fatherGuardianName || 'N/A'}
                    </p>
                    <div className="mt-1">
                      {renderStatusBadge(member.status)}
                    </div>
                  </div>
                </div>

                {/* Blood Group Highlight Badge */}
                {member.bloodGroup ? (
                  <div className="bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700/80 px-2.5 py-1.5 rounded-xl text-center shadow-2xs shrink-0">
                    <div className="flex items-center justify-center space-x-1 text-rose-700 dark:text-rose-300 font-black text-xs sm:text-sm font-heading">
                      <Droplet className="w-3 h-3 fill-current text-rose-600" />
                      <span>{member.bloodGroup}</span>
                    </div>
                    <span className="text-[9px] uppercase font-extrabold text-rose-600 dark:text-rose-400 block tracking-tighter">
                      Blood
                    </span>
                  </div>
                ) : (
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold">
                    No BG
                  </div>
                )}
              </div>

              {/* Key Details Grid */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 font-medium flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Designation:</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                    {member.assignedDesignation || 'Member'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 font-medium flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-500" />
                    <span>Division:</span>
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {store.getDivisionName(member.divisionId)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 font-medium flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>District / City:</span>
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {store.getDistrictName(member.districtId)} {member.cityTown ? `(${member.cityTown})` : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-mono">
                  <span className="text-slate-400 font-sans font-medium flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-purple-500" />
                    <span>CNIC:</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {member.cnicNumber || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <a
                  href={`tel:${member.mobileNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 dark:bg-slate-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 dark:text-slate-300 transition-colors flex items-center space-x-1.5 text-xs font-bold"
                  title="Call Direct"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono text-[11px]">{member.mobileNumber}</span>
                </a>

                <div className="flex items-center space-x-1.5">
                  <a
                    href={`https://wa.me/${(member.mobileNumber || '').replace(/[^0-9]/g, '').replace(/^0/, '92')}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 transition-colors"
                    title="WhatsApp Chat"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={(e) => handleCopyPhone(member.mobileNumber, e)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                    title="Copy Phone Number"
                  >
                    {copiedPhone === member.mobileNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setSelectedProfile(member)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* ================= TABLE VIEW ================= */
        <div className="bg-white dark:bg-[#0b1320] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 font-heading font-extrabold uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Member Info</th>
                  <th className="py-3.5 px-4">CNIC Number</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Division / District</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredProfiles.map((member) => (
                  <tr 
                    key={member.id} 
                    onClick={() => setSelectedProfile(member)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                          alt={member.fullName}
                          className="w-9 h-9 rounded-xl object-cover bg-slate-100 border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {member.fullName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {member.assignedDesignation || 'Member'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {member.cnicNumber || 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      {member.bloodGroup ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl font-black text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800">
                          <Droplet className="w-3 h-3 fill-rose-600 text-rose-600" />
                          <span>{member.bloodGroup}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {store.getDivisionName(member.divisionId)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {store.getDistrictName(member.districtId)}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <a 
                        href={`tel:${member.mobileNumber}`} 
                        onClick={(e) => e.stopPropagation()} 
                        className="font-mono font-bold text-teal-700 dark:text-teal-400 hover:underline block"
                      >
                        {member.mobileNumber}
                      </a>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                        {member.email}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {renderStatusBadge(member.status)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProfile(member);
                        }}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= COMPLETE PROFILE DETAILS MODAL ================= */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#0b1320] w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 space-y-6 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#03140e] via-[#062419] to-[#041a12] text-white flex items-start justify-between relative shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-800 shadow-md shrink-0">
                  <img
                    src={selectedProfile.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                    alt={selectedProfile.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black font-heading text-white">
                      {selectedProfile.fullName}
                    </h2>
                    {selectedProfile.bloodGroup && (
                      <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-2xs">
                        <Droplet className="w-3 h-3 fill-current" />
                        <span>{selectedProfile.bloodGroup}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-amber-300 font-semibold">
                    {selectedProfile.assignedDesignation || 'Member Applicant'} • {selectedProfile.membershipIdNumber || 'ID Pending'}
                  </p>
                  <p className="text-[11px] text-emerald-300 font-medium">
                    Father/Guardian: {selectedProfile.fatherGuardianName || 'N/A'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProfile(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="px-6 pb-6 overflow-y-auto space-y-6 text-xs flex-1">
              
              {/* Quick Contact & Blood Alert Banner */}
              <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                    <Droplet className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="font-bold text-rose-900 dark:text-rose-200 block text-xs sm:text-sm">
                      Blood Group: <strong>{selectedProfile.bloodGroup || 'Not Specified'}</strong>
                    </span>
                    <span className="text-rose-700 dark:text-rose-400 text-[11px]">
                      Available for divisional youth blood donation emergencies &amp; coordination
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`tel:${selectedProfile.mobileNumber}`}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>

                  <a
                    href={`https://wa.me/${(selectedProfile.mobileNumber || '').replace(/[^0-9]/g, '').replace(/^0/, '92')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center space-x-1.5 shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Section 1: Personal & Location Details */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 dark:text-white text-sm font-heading border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Personal, Contact &amp; Residential Info</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block font-medium">CNIC / B-Form</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedProfile.cnicNumber || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Mobile Number</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedProfile.mobileNumber || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Email Address</span>
                    <span className="font-semibold text-slate-900 dark:text-white break-all">{selectedProfile.email || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Date of Birth</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedProfile.dob || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Gender</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedProfile.gender || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Application Status</span>
                    <div className="mt-0.5">{renderStatusBadge(selectedProfile.status)}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Division</span>
                    <span className="font-bold text-teal-700 dark:text-teal-400">{store.getDivisionName(selectedProfile.divisionId)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">District</span>
                    <span className="font-bold text-slate-900 dark:text-white">{store.getDistrictName(selectedProfile.districtId)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Taluka / Town</span>
                    <span className="font-bold text-slate-900 dark:text-white">{store.getTalukaName(selectedProfile.talukaId)} {selectedProfile.cityTown ? `(${selectedProfile.cityTown})` : ''}</span>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <span className="text-slate-400 block font-medium">Residential Address</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{selectedProfile.residentialAddress || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Academic & Professional Credentials */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 dark:text-white text-sm font-heading border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>Academic &amp; Professional Profile</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block font-medium">Highest Qualification</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedProfile.qualification || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Institution / University</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedProfile.institutionName || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Profession / Occupation</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedProfile.profession || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Applied Level</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedProfile.levelApplied || 'Provincial / Divisional'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Preferred Department</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedProfile.preferredDepartment || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Assigned Designation</span>
                    <span className="font-bold text-purple-700 dark:text-purple-400">{selectedProfile.assignedDesignation || 'General Member'}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Statement of Purpose & Experience */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 dark:text-white text-sm font-heading border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Statement of Purpose &amp; Motivation</span>
                </h4>

                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div>
                    <span className="text-slate-400 block font-medium mb-1">Statement of Purpose:</span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      {selectedProfile.statementOfPurpose || 'No statement provided.'}
                    </p>
                  </div>

                  {selectedProfile.previousExperience && (
                    <div>
                      <span className="text-slate-400 block font-medium mb-1">Previous Leadership &amp; Volunteer Experience:</span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        {selectedProfile.previousExperience}
                      </p>
                    </div>
                  )}

                  {/* Skills & Areas of Interest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-slate-400 block font-medium mb-1.5">Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedProfile.skills || []).length > 0 ? (
                          selectedProfile.skills.map((s, idx) => (
                            <span key={idx} className="bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 px-2 py-0.5 rounded-md font-bold text-[10px]">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">None specified</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium mb-1.5">Areas of Interest:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedProfile.areasOfInterest || []).length > 0 ? (
                          selectedProfile.areasOfInterest.map((a, idx) => (
                            <span key={idx} className="bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-md font-bold text-[10px]">
                              {a}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">None specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-slate-500 text-[11px] font-medium">
                Registered on {selectedProfile.submittedAt ? new Date(selectedProfile.submittedAt).toLocaleDateString() : 'N/A'}
              </span>

              <button
                onClick={() => setSelectedProfile(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
