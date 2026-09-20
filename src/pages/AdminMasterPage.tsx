import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { SINDH_DIVISIONS, SINDH_DISTRICTS } from '../data/sindhHierarchy';
import { MemberProfile, User, UserRole } from '../types';
import { Printer, Filter, FileSpreadsheet, Layout, Users, Trash2, X, Plus, UserPlus, CheckCircle2, Lock, Unlock, ShieldAlert, Edit3, Award } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DigitalIdCard } from '../components/DigitalIdCard';

export const AdminMasterPage: React.FC = () => {
  const [profiles, setProfiles] = useState<MemberProfile[]>(store.getAllProfiles());
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCardProfile, setSelectedCardProfile] = useState<MemberProfile | null>(null);
  
  // Fast Designation / Role Assignment Modal State
  const [editingDesignationProfile, setEditingDesignationProfile] = useState<MemberProfile | null>(null);
  const [customDesignation, setCustomDesignation] = useState<string>('');

  useEffect(() => {
    store.fetchFromSupabase().then(() => {
      setProfiles([...store.getAllProfiles()]);
    });
  }, []);

  // Officer & Staff Users State
  const [officers, setOfficers] = useState<User[]>(store.getOfficerUsers());
  const [showOfficerModal, setShowOfficerModal] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newCnic, setNewCnic] = useState<string>('');
  const [newRole, setNewRole] = useState<UserRole>('VERIFICATION_DESK');
  const [newPassword, setNewPassword] = useState<string>('pass123');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newMobile, setNewMobile] = useState<string>('');
  const [officerSuccessMsg, setOfficerSuccessMsg] = useState<string>('');

  const stats = store.getStats();

  let filteredMembers = profiles;
  if (selectedStatus !== 'ALL') {
    filteredMembers = filteredMembers.filter((m) => m.status === selectedStatus);
  }
  if (selectedDivision !== 'ALL') {
    filteredMembers = filteredMembers.filter((m) => m.divisionId === selectedDivision);
  }
  if (selectedDistrict !== 'ALL') {
    filteredMembers = filteredMembers.filter((m) => m.districtId === selectedDistrict);
  }

  // SINGLE-CLICK BATCH DATA EXPORT ("ONE PRINT") FOR PLASTIC CARD PRINTING VENDORS
  const handleSingleClickBatchExport = () => {
    if (filteredMembers.length === 0) {
      alert('No members found for the selected division/district filter.');
      return;
    }

    const exportData = filteredMembers.map((m) => {
      let photoVal = m.passportPhotoUrl || '';
      if (photoVal.length > 30000) {
        photoVal = photoVal.startsWith('data:')
          ? '[Base64 Image Data - Exceeds Excel Cell Limit]'
          : photoVal.slice(0, 30000);
      }
      return {
        'Membership ID': m.membershipIdNumber || 'N/A',
        'Full Name': m.fullName,
        "Father/Guardian Name": m.fatherGuardianName,
        'CNIC Number': m.cnicNumber,
        'Designation / Role': m.assignedDesignation || 'Executive Member',
        'Division': store.getDivisionName(m.divisionId),
        'District': store.getDistrictName(m.districtId),
        'Taluka': store.getTalukaName(m.talukaId),
        'Mobile Number': m.mobileNumber,
        'Email': m.email,
        'Passport Photo URL': photoVal,
        'Approval Date': m.approvalDate || '',
        'Status': m.status,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ID Card Printing Data');

    const divName = selectedDivision === 'ALL' ? 'Sindh_Wide' : store.getDivisionName(selectedDivision).replace(' ', '_');
    const fileName = `NYP_Sindh_Card_Printing_Data_${divName}_2026.xlsx`;

    try {
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('Blob export fallback, trying XLSX.writeFile:', err);
      XLSX.writeFile(workbook, fileName);
    }
  };

  const handlePrintBatchBadges = () => {
    window.print();
  };

  const handleCreateOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newCnic) return;

    const created = store.addOfficerUser({
      fullName: newFullName,
      cnicNumber: newCnic,
      role: newRole,
      password: newPassword,
      email: newEmail,
      mobileNumber: newMobile,
    });

    setOfficers(store.getOfficerUsers());
    setOfficerSuccessMsg(`Officer account for "${created.fullName}" created successfully!`);
    setNewFullName('');
    setNewCnic('');
    setNewEmail('');
    setNewMobile('');

    setTimeout(() => setOfficerSuccessMsg(''), 4000);
  };

  const handleToggleBlock = (userId: string) => {
    store.toggleBlockUser(userId);
    setOfficers([...store.getOfficerUsers()]);
  };

  const handleDeleteOfficer = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove officer access for ${name}?`)) {
      store.deleteOfficerUser(id);
      setOfficers(store.getOfficerUsers());
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'PRESIDENT':
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
      case 'WEB_COORDINATOR':
        return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800';
      case 'AUTHORISATION_DESK':
      case 'APPROVAL_AUTHORITY':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
      case 'VERIFICATION_DESK':
      case 'VERIFYING_OFFICER':
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'PRESIDENT':
      case 'SUPER_ADMIN':
        return 'PRESIDENT (FULL AUTHORITY)';
      case 'WEB_COORDINATOR':
        return 'Web Coordinator';
      case 'AUTHORISATION_DESK':
      case 'APPROVAL_AUTHORITY':
        return 'Authorisation Desk';
      case 'VERIFICATION_DESK':
      case 'VERIFYING_OFFICER':
        return 'Verification Desk';
      case 'DIVISIONAL_ADMIN':
        return 'Divisional Admin';
      default:
        return 'Youth Member';
    }
  };

  const handleApproveMember = async (profileId: string) => {
    await store.updateProfileStatus(profileId, 'APPROVED');
    setProfiles([...store.getAllProfiles()]);
  };

  const handleOpenDesignationModal = (member: MemberProfile) => {
    setEditingDesignationProfile(member);
    setCustomDesignation(member.assignedDesignation || 'General Member');
  };

  const handleSaveDesignation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDesignationProfile || !customDesignation.trim()) return;

    await store.updateMemberDesignation(editingDesignationProfile.id, customDesignation.trim());
    setProfiles([...store.getAllProfiles()]);
    setEditingDesignationProfile(null);
  };

  const handleVerifyMember = async (profileId: string) => {
    await store.updateProfileStatus(profileId, 'VERIFIED');
    setProfiles([...store.getAllProfiles()]);
  };

  const handleRejectMember = async (profileId: string) => {
    const reason = prompt('Enter rejection reason for this member profile:');
    if (reason !== null) {
      await store.updateProfileStatus(profileId, 'REJECTED', { rejectionReason: reason || 'Application details incomplete' });
      setProfiles([...store.getAllProfiles()]);
    }
  };

  const handleClearAllMemberRecords = async () => {
    if (window.confirm('Are you sure you want to permanently clear ALL member records from the portal and Supabase database?')) {
      await store.clearAllMemberProfiles();
      setProfiles([]);
      alert('All member records have been cleared.');
    }
  };

  const handleDeleteSingleRecord = async (profileId: string) => {
    if (window.confirm('Are you sure you want to delete this member profile?')) {
      await store.deleteMemberProfile(profileId);
      setProfiles([...store.getAllProfiles()]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left space-y-8 bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 transition-colors duration-300">
      
      {/* Master Top Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-emerald-950 border-2 border-purple-500/50 text-white p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 shrink-0 flex items-center justify-center overflow-hidden">
            <img src="/nyp-logo.png" alt="NYP Sindh Emblem" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest block">EXECUTIVE CONTROL</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">PRESIDENT PORTAL & ACCESS CONTROL</h1>
            <p className="text-xs text-purple-200 mt-0.5">
              Full user role management, access blocking, officer creation, and batch data export.
            </p>
          </div>
        </div>

        {/* ONE-PRINT SINGLE CLICK EXPORT FEATURE, CMS LINK & OFFICER MANAGEMENT */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowOfficerModal(true)}
            className="bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md flex items-center space-x-2 transition-colors cursor-pointer border border-purple-600"
          >
            <Users className="w-4 h-4 text-amber-300" />
            <span>Manage Roles & User Access</span>
          </button>

          <Link
            to="/admin/cms"
            className="bg-teal-950 hover:bg-teal-900 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md flex items-center space-x-2 transition-colors border border-teal-700"
          >
            <Layout className="w-4 h-4 text-teal-300" />
            <span>CMS Content Manager</span>
          </Link>

          <button
            onClick={handleSingleClickBatchExport}
            className="ui-btn-gold text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-md flex items-center space-x-2 cursor-pointer uppercase tracking-wider"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-950" />
            <span>BATCH EXPORT ("ONE PRINT")</span>
          </button>

          <button
            onClick={handlePrintBatchBadges}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs px-4 py-3 rounded-xl transition-colors flex items-center space-x-2 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Print All Approved Cards</span>
          </button>
        </div>
      </div>

      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-5 rounded-2xl shadow-sm backdrop-blur-md">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Members</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-heading">{stats.total}</span>
        </div>
        <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-5 rounded-2xl shadow-sm backdrop-blur-md">
          <span className="text-[10px] text-amber-500 uppercase font-bold tracking-wider block">Pending Desk</span>
          <span className="text-2xl font-black text-amber-500 font-heading">{stats.pending}</span>
        </div>
        <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-5 rounded-2xl shadow-sm backdrop-blur-md">
          <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider block">Verified Desk</span>
          <span className="text-2xl font-black text-blue-400 font-heading">{stats.verified}</span>
        </div>
        <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-5 rounded-2xl shadow-sm backdrop-blur-md">
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Approved & Issued</span>
          <span className="text-2xl font-black text-emerald-400 font-heading">{stats.approved}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 rounded-3xl space-y-4 shadow-md backdrop-blur-md">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Filter className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-heading">Provincial Member Filter Controls</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Division Filter</label>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedDistrict('ALL');
              }}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:border-emerald-600 outline-none transition-colors"
            >
              <option value="ALL">All 6 Divisions of Sindh</option>
              {SINDH_DIVISIONS.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">District Filter</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:border-emerald-600 outline-none transition-colors"
            >
              <option value="ALL">All Districts</option>
              {SINDH_DISTRICTS.filter((d) => selectedDivision === 'ALL' || d.divisionId === selectedDivision).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Application Status Filter</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:border-emerald-600 outline-none transition-colors"
            >
              <option value="ALL">All Statuses (Pending + Approved + Rejected)</option>
              <option value="APPROVED">APPROVED (Ready for Card Printing)</option>
              <option value="VERIFIED">VERIFIED (Awaiting Final Approval)</option>
              <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Data Table */}
      <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white rounded-3xl overflow-hidden shadow-md backdrop-blur-md">
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Displaying {filteredMembers.length} Member Records
            </span>
            {filteredMembers.length > 0 && (
              <button
                onClick={handleClearAllMemberRecords}
                className="bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-200 border border-rose-300 dark:border-rose-800 px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                <span>Clear All Records</span>
              </button>
            )}
          </div>

          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
            Ready for Batch Card Export
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Photo</th>
                <th className="p-4">Membership ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">CNIC Number</th>
                <th className="p-4">Designation / Role</th>
                <th className="p-4">Division & District</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">
                    No member records found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="p-4">
                      <img
                        src={m.passportPhotoUrl}
                        alt={m.fullName}
                        className="w-8 h-10 object-cover rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {m.membershipIdNumber || '—'}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white font-heading">{m.fullName}</td>
                    <td className="p-4 font-mono text-slate-700 dark:text-slate-300">{m.cnicNumber}</td>
                    <td className="p-4 font-semibold text-emerald-700 dark:text-emerald-400">
                      {m.assignedDesignation || m.preferredDepartment || 'Executive Member'}
                    </td>
                    <td className="p-4">
                      <span className="block font-medium text-slate-900 dark:text-white">{store.getDivisionName(m.divisionId)}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{store.getDistrictName(m.districtId)}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          m.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60'
                            : m.status === 'PAYMENT_SUBMITTED'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-700/60'
                            : m.status === 'VERIFIED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700/60'
                            : m.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700/60'
                            : 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/60'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      {m.status === 'PENDING_VERIFICATION' && (
                        <>
                          <button
                            onClick={() => handleVerifyMember(m.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] inline-flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <span>Verify Profile</span>
                          </button>
                          <button
                            onClick={() => handleRejectMember(m.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] inline-flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {m.status === 'VERIFIED' && (
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold italic px-2">Awaiting Member Fee Payment</span>
                      )}
                      {m.status === 'PAYMENT_SUBMITTED' && (
                        <>
                          <button
                            onClick={() => handleApproveMember(m.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] inline-flex items-center space-x-1 transition-colors cursor-pointer shadow-sm"
                          >
                            <span>Authorize Payment &amp; Issue Card</span>
                          </button>
                          <button
                            onClick={() => handleRejectMember(m.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] inline-flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {m.status === 'APPROVED' && (
                        <button
                          onClick={() => setSelectedCardProfile(m)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] inline-flex items-center space-x-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Card</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSingleRecord(m.id)}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800 p-1.5 rounded-lg text-[10px] inline-flex items-center transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICER & USER ACCESS CONTROL MODAL */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-900 border border-amber-400 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-black font-heading">PRESIDENT User Access & Role Control</h2>
                  <p className="text-xs text-slate-400">Manage officer credentials, assign desks, and block or unblock system access.</p>
                </div>
              </div>
              <button
                onClick={() => setShowOfficerModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-left">
              
              {officerSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200 rounded-xl flex items-center space-x-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{officerSuccessMsg}</span>
                </div>
              )}

              {/* Form: Create New Officer */}
              <div className="p-5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white rounded-2xl space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm font-heading">
                  <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Create Authorized Staff Login & Password</span>
                </div>

                <form onSubmit={handleCreateOfficer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Officer Name *</label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      placeholder="e.g. Syed Ali Shah"
                      className="w-full bg-white border border-slate-300 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white rounded-xl px-3 py-2 font-medium outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">CNIC / Username *</label>
                    <input
                      type="text"
                      required
                      value={newCnic}
                      onChange={(e) => setNewCnic(e.target.value)}
                      placeholder="e.g. officer01"
                      className="w-full bg-white border border-slate-300 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white rounded-xl px-3 py-2 font-mono font-bold outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assigned Role Desk *</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="w-full bg-white border border-slate-300 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white rounded-xl px-3 py-2 font-bold outline-none focus:border-purple-600"
                    >
                      <option value="PRESIDENT">PRESIDENT (Full Executive Master Controls)</option>
                      <option value="WEB_COORDINATOR">WEB COORDINATOR (CMS, Uploads & Cabinets)</option>
                      <option value="VERIFICATION_DESK">Verification Desk Officer</option>
                      <option value="AUTHORISATION_DESK">Authorisation Desk Authority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Set Password *</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Set password"
                      className="w-full bg-white border border-slate-300 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white rounded-xl px-3 py-2 font-medium outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="officer@nypsindh.org.pk"
                      className="w-full bg-white border border-slate-300 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white rounded-xl px-3 py-2 font-medium outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full ui-btn-gold text-slate-950 font-black py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer uppercase tracking-wider"
                    >
                      <Plus className="w-4 h-4 text-slate-950" />
                      <span>CREATE OFFICER</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Table: Active Officers & Block/Unblock Access */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-heading">User Accounts & Access Control ({officers.length})</h3>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">User Name</th>
                        <th className="p-3">CNIC / Username</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Access Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {officers.map((off) => (
                        <tr key={off.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                          <td className="p-3 font-bold text-slate-900 dark:text-white font-heading">{off.fullName}</td>
                          <td className="p-3 font-mono font-bold text-indigo-700 dark:text-indigo-400">{off.cnicNumber}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(off.role)}`}>
                              {getRoleLabel(off.role)}
                            </span>
                          </td>
                          <td className="p-3">
                            {off.isBlocked ? (
                              <span className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded text-[10px] font-bold">
                                ACCESS BLOCKED
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                                ACTIVE
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {off.role !== 'PRESIDENT' && off.role !== 'SUPER_ADMIN' && (
                              <>
                                <button
                                  onClick={() => handleToggleBlock(off.id)}
                                  className={`p-1.5 rounded text-xs font-bold transition-colors cursor-pointer inline-flex items-center space-x-1 ${
                                    off.isBlocked
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300'
                                  }`}
                                >
                                  {off.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                  <span>{off.isBlocked ? 'Unblock Access' : 'Block Access'}</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteOfficer(off.id, off.fullName)}
                                  className="text-rose-600 hover:text-rose-800 font-bold p-1 rounded hover:bg-rose-50 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                                  title="Revoke Officer Access"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowOfficerModal(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FAST DESIGNATION / ROLE ASSIGNMENT MODAL */}
      {editingDesignationProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-500">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">ADMIN ROLE &amp; DESIGNATION MANAGER</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">{editingDesignationProfile.fullName}</h3>
                </div>
              </div>
              <button onClick={() => setEditingDesignationProfile(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDesignation} className="space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Current Card Role</span>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {editingDesignationProfile.assignedDesignation || 'General Member'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Saving an official designation here will automatically update their Digital ID Card &amp; PDF pass immediately.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Quick Role or Enter Custom Designation:
                </label>

                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    'Youth MPA',
                    'Youth MNA',
                    'Youth Chief Minister (CM)',
                    'Speaker Youth Assembly',
                    'Deputy Speaker Youth Assembly',
                    'Leader of Opposition',
                    'Youth Provincial Minister',
                    'President Karachi Division',
                    'President Hyderabad Division',
                    'Divisional Youth President',
                    'Divisional General Secretary',
                    'District Youth President',
                    'General Member',
                  ].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setCustomDesignation(role)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                        customDesignation.toLowerCase() === role.toLowerCase()
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  required
                  value={customDesignation}
                  onChange={(e) => setCustomDesignation(e.target.value)}
                  placeholder="e.g. Youth MPA or President Karachi Division"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDesignationProfile(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ui-btn-gold text-slate-950 font-black px-6 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  SAVE &amp; UPDATE CARD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SINGLE MEMBER CARD PRINTING MODAL */}
      {selectedCardProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto no-print-bg">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-4 sm:p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 no-print">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Official Member Pass</span>
                <h3 className="text-white font-black text-lg font-heading">{selectedCardProfile.fullName}</h3>
                <p className="text-xs text-slate-400 font-mono">CNIC: {selectedCardProfile.cnicNumber}</p>
              </div>
              <button
                onClick={() => setSelectedCardProfile(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center space-x-1 border border-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>

            <DigitalIdCard profile={selectedCardProfile} />
          </div>
        </div>
      )}

    </div>
  );
};
