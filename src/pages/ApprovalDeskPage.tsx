import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { MemberProfile, RoleApplicationRequest } from '../types';
import { ShieldCheck, UserCheck, Search, Layout, CreditCard } from 'lucide-react';

export const ApprovalDeskPage: React.FC = () => {
  const [profiles, setProfiles] = useState<MemberProfile[]>(store.getAllProfiles());
  const [roleRequests, setRoleRequests] = useState<RoleApplicationRequest[]>(store.getRoleApplications());
  const [selectedRoleReq, setSelectedRoleReq] = useState<RoleApplicationRequest | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<MemberProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = () => {
    setProfiles([...store.getAllProfiles()]);
    setRoleRequests([...store.getRoleApplications()]);
  };

  useEffect(() => {
    store.fetchFromSupabase().then(() => {
      refreshData();
    });
  }, []);

  const pendingAuthorisationList = roleRequests.filter((r) => r.status === 'PAYMENT_SUBMITTED_PENDING_AUTHORISATION');

  const filteredList = pendingAuthorisationList.filter(
    (r) =>
      r.targetRoleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cnicNumber.includes(searchQuery)
  );

  const handleAuthorize = (req: RoleApplicationRequest) => {
    store.authorizeRoleApplication(req.id);
    setSelectedRoleReq(null);
    refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left space-y-8 bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 transition-colors duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl border border-amber-400/50">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white p-0.5 border-2 border-amber-400 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-heading">Authorisation Desk</h1>
            <p className="text-xs text-amber-300 font-medium">
              Review Paid Role Applications & Grant Official Designation Pass
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/cms"
            className="bg-teal-900/80 hover:bg-teal-800 border border-teal-500 text-teal-100 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md transition-colors"
          >
            <Layout className="w-4 h-4 text-teal-300" />
            <span>Manage CMS Announcements & Gallery</span>
          </Link>

          <span className="bg-amber-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl shadow-md">
            {pendingAuthorisationList.length} Pending Authorisation
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-4 space-y-4 shadow-md rounded-3xl backdrop-blur-md">
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search paid applications by Role or CNIC..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:border-emerald-600 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 max-h-[550px] overflow-y-auto">
              {filteredList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No paid role applications awaiting final authorisation.
                </div>
              ) : (
                filteredList.map((r) => {
                  const prof = profiles.find((p) => p.userId === r.userId || p.cnicNumber === r.cnicNumber);
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedRoleReq(r);
                        setSelectedProfile(prof || null);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedRoleReq?.id === r.id
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm dark:bg-emerald-950/60 dark:border-emerald-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
                          💳
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-xs text-slate-900 dark:text-white truncate font-heading">{r.targetRoleTitle}</h4>
                          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 block font-semibold">{r.cnicNumber}</span>
                          <span className="text-[9px] text-amber-500 font-bold block truncate">Fee Paid: PKR {r.feeAmount} ({r.paymentDetails?.paymentMethod})</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7">
          {selectedRoleReq ? (
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-6 shadow-md rounded-3xl backdrop-blur-md">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">Final Role Authorisation</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">CNIC: {selectedRoleReq.cnicNumber}</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60 text-xs px-3 py-1 rounded-full font-bold">
                  PAYMENT VERIFIED
                </span>
              </div>

              <div className="bg-gradient-to-r from-emerald-900 to-slate-950 text-white p-5 rounded-2xl space-y-2 border border-emerald-500/50">
                <span className="text-[10px] text-amber-300 uppercase font-bold block">Target Role & Fee Verification</span>
                <h4 className="font-black text-white text-lg font-heading">{selectedRoleReq.targetRoleTitle}</h4>
                <div className="flex items-center space-x-4 text-xs pt-1 font-mono text-emerald-200">
                  <span>Fee: PKR {selectedRoleReq.feeAmount}</span>
                  <span>Method: {selectedRoleReq.paymentDetails?.paymentMethod}</span>
                  <span>Txn ID: {selectedRoleReq.paymentDetails?.transactionId}</span>
                </div>
              </div>

              {selectedProfile && (
                <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-4 rounded-2xl text-xs">
                  <img
                    src={selectedProfile.passportPhotoUrl}
                    alt={selectedProfile.fullName}
                    className="w-16 h-20 object-cover rounded-xl border-2 border-amber-400 bg-white shrink-0 shadow-sm"
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm font-heading">{selectedProfile.fullName}</h4>
                    <p>CNIC: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{selectedProfile.cnicNumber}</strong></p>
                    <p>Division: {store.getDivisionName(selectedProfile.divisionId)} • District: {store.getDistrictName(selectedProfile.districtId)}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => handleAuthorize(selectedRoleReq)}
                className="w-full ui-btn-gold text-slate-950 font-black text-xs py-4 rounded-2xl shadow-xl flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
              >
                <UserCheck className="w-5 h-5 text-slate-950" />
                <span>AUTHORIZE ROLE & ISSUE OFFICIAL DESIGNATION CARD</span>
              </button>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-16 text-center space-y-3 rounded-3xl shadow-sm">
              <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Select Paid Application</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click on any paid role application from the left queue to grant final authorisation.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
