import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { SINDH_DIVISIONS, SINDH_DISTRICTS } from '../data/sindhHierarchy';
import { MemberProfile, User, UserRole } from '../types';
import { Printer, Filter, Shield, FileSpreadsheet, Layout, Users, Trash2, X, Plus, UserPlus, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DigitalIdCard } from '../components/DigitalIdCard';

export const AdminMasterPage: React.FC = () => {
  const profiles = store.getAllProfiles();
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCardProfile, setSelectedCardProfile] = useState<MemberProfile | null>(null);

  // Officer Accounts State
  const [officers, setOfficers] = useState<User[]>(store.getOfficerUsers());
  const [showOfficerModal, setShowOfficerModal] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newCnic, setNewCnic] = useState<string>('');
  const [newRole, setNewRole] = useState<UserRole>('VERIFYING_OFFICER');
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
        'Level Applied': m.levelApplied,
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
      // 1. Convert workbook to array buffer
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // 2. Create Blob with official Excel MIME type
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      // 3. Trigger direct browser download
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

  const handleDeleteOfficer = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove officer access for ${name}?`)) {
      store.deleteOfficerUser(id);
      setOfficers(store.getOfficerUsers());
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'APPROVAL_AUTHORITY':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'VERIFYING_OFFICER':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'APPROVAL_AUTHORITY':
        return 'Approval Desk (President)';
      case 'VERIFYING_OFFICER':
        return 'Verifying Officer Desk';
      case 'DIVISIONAL_ADMIN':
        return 'Divisional Admin Desk';
      default:
        return 'Youth Member';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left space-y-8 bg-slate-50">
      
      {/* Master Top Header */}
      <div className="ui-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm border-slate-200">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl border-2 border-emerald-600/30 bg-white p-0.5 shadow-md shrink-0 overflow-hidden">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Emblem" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Central Super Admin Master Portal</h1>
            <p className="text-xs text-slate-500">
              Sindh-wide registration metrics, staff role management, and plastic ID card batch data export.
            </p>
          </div>
        </div>

        {/* ONE-PRINT SINGLE CLICK EXPORT FEATURE, CMS LINK & OFFICER MANAGEMENT */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowOfficerModal(true)}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-sm flex items-center space-x-2 transition-colors"
          >
            <Users className="w-4 h-4 text-amber-300" />
            <span>Manage Officers & Roles</span>
          </button>

          <Link
            to="/admin/cms"
            className="bg-slate-900 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-sm flex items-center space-x-2 hover:bg-slate-800 transition-colors"
          >
            <Layout className="w-4 h-4 text-emerald-400" />
            <span>Website CMS</span>
          </Link>

          <button
            onClick={handleSingleClickBatchExport}
            className="ui-btn-primary font-bold text-xs px-5 py-3 rounded-xl shadow-sm flex items-center space-x-2"
            title="Export clean formatted Excel data for plastic card printer vendors"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>BATCH EXPORT ("ONE PRINT")</span>
          </button>

          <button
            onClick={handlePrintBatchBadges}
            className="ui-btn-secondary font-semibold text-xs px-4 py-3 rounded-xl border border-slate-300 transition-colors flex items-center space-x-2"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Grid</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="ui-card p-5 border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Total Registrations</span>
          <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{stats.total}</span>
        </div>
        <div className="ui-card p-5 border-slate-200 shadow-sm">
          <span className="text-xs text-emerald-700 font-medium block">Approved & Issued</span>
          <span className="text-3xl font-extrabold text-emerald-700 mt-1 block">{stats.approved}</span>
        </div>
        <div className="ui-card p-5 border-slate-200 shadow-sm">
          <span className="text-xs text-amber-700 font-medium block">Under Scrutiny</span>
          <span className="text-3xl font-extrabold text-amber-700 mt-1 block">{stats.pending + stats.verified}</span>
        </div>
        <div className="ui-card p-5 border-slate-200 shadow-sm">
          <span className="text-xs text-rose-700 font-medium block">Rejected Forms</span>
          <span className="text-3xl font-extrabold text-rose-700 mt-1 block">{stats.rejected}</span>
        </div>
      </div>

      {/* Administrative Filter Bar */}
      <div className="ui-card p-6 space-y-4 border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filter Registered Member Records by Division & District</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Division Filter</label>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedDistrict('ALL');
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 outline-none"
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
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">District Filter</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 outline-none"
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
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Application Status Filter</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 outline-none"
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
      <div className="ui-card overflow-hidden shadow-sm border-slate-200">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Displaying {filteredMembers.length} Filtered Records
          </span>
          <span className="text-xs text-emerald-700 font-bold">
            Ready for Batch Card Export
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Photo</th>
                <th className="p-4">Membership ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">CNIC Number</th>
                <th className="p-4">Designation / Role</th>
                <th className="p-4">Division & District</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Card Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No member records found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <img
                        src={m.passportPhotoUrl}
                        alt={m.fullName}
                        className="w-8 h-10 object-cover rounded-md border border-slate-300 bg-slate-100"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-800">
                      {m.membershipIdNumber || '—'}
                    </td>
                    <td className="p-4 font-bold text-slate-900">{m.fullName}</td>
                    <td className="p-4 font-mono text-slate-700">{m.cnicNumber}</td>
                    <td className="p-4 font-semibold text-emerald-700">
                      {m.assignedDesignation || m.preferredDepartment || 'Executive Member'}
                    </td>
                    <td className="p-4">
                      <span className="block font-medium text-slate-900">{store.getDivisionName(m.divisionId)}</span>
                      <span className="text-[10px] text-slate-500">{store.getDistrictName(m.districtId)}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          m.status === 'APPROVED'
                            ? 'ui-badge-green'
                            : m.status === 'VERIFIED'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200 font-bold'
                            : m.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200 font-bold'
                            : 'ui-badge-amber'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {m.status === 'APPROVED' ? (
                        <button
                          onClick={() => setSelectedCardProfile(m)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] inline-flex items-center space-x-1 shadow-sm transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Card</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Not Issued</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICER & STAFF MANAGEMENT MODAL */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Officer & Staff Access Management</h2>
                  <p className="text-xs text-slate-400">Super Admin desk to create and manage authorized staff roles & credentials.</p>
                </div>
              </div>
              <button
                onClick={() => setShowOfficerModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-left">
              
              {officerSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center space-x-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{officerSuccessMsg}</span>
                </div>
              )}

              {/* Form: Create New Officer */}
              <div className="ui-card p-5 bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span>Create Authorized Staff / Officer Credentials</span>
                </div>

                <form onSubmit={handleCreateOfficer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Officer Name *</label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      placeholder="e.g. Syed Ali Shah"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">CNIC Number (Username) *</label>
                    <input
                      type="text"
                      required
                      value={newCnic}
                      onChange={(e) => setNewCnic(e.target.value)}
                      placeholder="41304-9999999-9"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Assigned Role *</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none focus:border-indigo-600"
                    >
                      <option value="VERIFYING_OFFICER">Verifying Officer Desk</option>
                      <option value="APPROVAL_AUTHORITY">Approval Authority (President)</option>
                      <option value="SUPER_ADMIN">Super Admin (Master Access)</option>
                      <option value="DIVISIONAL_ADMIN">Divisional Admin Desk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="officer@nypsindh.org.pk"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Mobile Contact</label>
                    <input
                      type="text"
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Create Account</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Table: Active Officers */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Active Authorized Staff Accounts ({officers.length})</h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3">Officer Name</th>
                        <th className="p-3">CNIC Number</th>
                        <th className="p-3">Assigned Role</th>
                        <th className="p-3">Contact Email</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {officers.map((off) => (
                        <tr key={off.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{off.fullName}</td>
                          <td className="p-3 font-mono font-bold text-indigo-900">{off.cnicNumber}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(off.role)}`}>
                              {getRoleLabel(off.role)}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">{off.email || 'N/A'}</td>
                          <td className="p-3 text-right">
                            {off.id === 'usr-super-admin' ? (
                              <span className="text-[10px] text-slate-400 italic">Master Primary Account</span>
                            ) : (
                              <button
                                onClick={() => handleDeleteOfficer(off.id, off.fullName)}
                                className="text-rose-600 hover:text-rose-800 font-bold p-1 rounded hover:bg-rose-50 transition-colors inline-flex items-center space-x-1"
                                title="Revoke Officer Access"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
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
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowOfficerModal(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SINGLE MEMBER CARD PRINTING MODAL */}
      {selectedCardProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 overflow-y-auto no-print-bg">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 no-print">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Official Member Pass</span>
                <h3 className="text-white font-black text-lg font-heading">{selectedCardProfile.fullName}</h3>
                <p className="text-xs text-slate-400 font-mono">CNIC: {selectedCardProfile.cnicNumber}</p>
              </div>
              <button
                onClick={() => setSelectedCardProfile(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center space-x-1 border border-slate-700"
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
