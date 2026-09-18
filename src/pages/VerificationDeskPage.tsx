import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { MemberProfile, RoleApplicationRequest } from '../types';
import { CheckCircle2, Search, User, ShieldCheck, XCircle } from 'lucide-react';

export const VerificationDeskPage: React.FC = () => {
  const [profiles, setProfiles] = useState<MemberProfile[]>(store.getAllProfiles());
  const [roleRequests, setRoleRequests] = useState<RoleApplicationRequest[]>(store.getRoleApplications());
  const [selectedRoleReq, setSelectedRoleReq] = useState<RoleApplicationRequest | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<MemberProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const refreshData = () => {
    setProfiles([...store.getAllProfiles()]);
    setRoleRequests([...store.getRoleApplications()]);
  };

  useEffect(() => {
    store.fetchFromSupabase().then(() => {
      refreshData();
    });
  }, []);

  const pendingRoleRequests = roleRequests.filter((r) => r.status === 'PENDING_VERIFICATION');
  const pendingMemberProfiles = profiles.filter((p) => p.status === 'PENDING_VERIFICATION');

  // Unified items list for verification desk
  const unifiedPendingList = [
    ...pendingMemberProfiles.map((p) => ({
      type: 'MEMBER_PROFILE' as const,
      id: p.id,
      title: 'General Membership Registration',
      cnicNumber: p.cnicNumber,
      fullName: p.fullName,
      feeAmount: 0,
      reason: `Division: ${store.getDivisionName(p.divisionId)}, District: ${store.getDistrictName(p.districtId)}, Profession: ${p.profession}`,
      rawProfile: p,
      rawRoleReq: null,
    })),
    ...pendingRoleRequests.map((r) => {
      const prof = profiles.find((p) => p.userId === r.userId || p.cnicNumber === r.cnicNumber);
      return {
        type: 'ROLE_REQUEST' as const,
        id: r.id,
        title: r.targetRoleTitle,
        cnicNumber: r.cnicNumber,
        fullName: prof?.fullName || 'Applicant',
        feeAmount: r.feeAmount,
        reason: r.reason,
        rawProfile: prof || null,
        rawRoleReq: r,
      };
    }),
  ];

  const filteredItems = unifiedPendingList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cnicNumber.includes(searchQuery)
  );

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = unifiedPendingList.find((i) => i.id === selectedItemId) || (unifiedPendingList.length > 0 ? unifiedPendingList[0] : null);

  const handleVerifyItem = (item: typeof unifiedPendingList[0]) => {
    if (item.type === 'MEMBER_PROFILE') {
      store.updateProfileStatus(item.id, 'VERIFIED');
    } else {
      store.verifyRoleApplication(item.id);
    }
    setSelectedItemId(null);
    refreshData();
  };

  const handleRejectItem = (item: typeof unifiedPendingList[0]) => {
    if (!rejectionReason) {
      alert('Please enter a rejection reason.');
      return;
    }
    if (item.type === 'MEMBER_PROFILE') {
      store.updateProfileStatus(item.id, 'REJECTED', { rejectionReason });
    } else {
      store.rejectRoleApplication(item.id, rejectionReason);
    }
    setSelectedItemId(null);
    setRejectionReason('');
    refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left space-y-8 bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 shrink-0 flex items-center justify-center overflow-hidden">
            <img src="/nyp-logo.png" alt="NYP Sindh Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-heading">Verification Desk</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Scrutinize incoming Youth MPA, Youth MNA, Divisional & District Role requests before enabling fee payment.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/60 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
            {unifiedPendingList.length} Pending Verification Requests
          </span>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Queue List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-4 space-y-4 shadow-md rounded-3xl backdrop-blur-md">
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Title, Name, CNIC..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:border-emerald-600 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No applications currently pending verification.
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-400 shadow-sm dark:bg-amber-950/40 dark:border-amber-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                          {item.type === 'MEMBER_PROFILE' ? '👤' : 'NYP'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-xs text-slate-900 dark:text-white truncate font-heading">{item.title}</h4>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">{item.cnicNumber}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            {item.feeAmount > 0 ? (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                                Fee: PKR {item.feeAmount}
                              </span>
                            ) : (
                              <span className="text-[9px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">
                                New Member Registration
                              </span>
                            )}
                            <span className="text-[9px] text-slate-600 dark:text-slate-400 truncate">{item.fullName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-6 shadow-md rounded-3xl backdrop-blur-md">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">Application Verification</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">CNIC: {selectedItem.cnicNumber}</span>
                </div>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/60 text-xs px-3 py-1 rounded-full font-bold">
                  Pending Verification
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 text-xs">
                <span className="text-slate-500 block text-[10px]">Application Type / Title</span>
                <h4 className="font-black text-slate-900 dark:text-white text-base font-heading">{selectedItem.title}</h4>
                {selectedItem.feeAmount > 0 && (
                  <p className="text-amber-500 font-bold font-mono text-sm">Role Fee: PKR {selectedItem.feeAmount}</p>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px] font-bold">Details:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">"{selectedItem.reason}"</p>
                </div>
              </div>

              {selectedItem.rawProfile && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-3.5 rounded-xl">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Applicant Name</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedItem.rawProfile.fullName}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-3.5 rounded-xl">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Division / District</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {store.getDivisionName(selectedItem.rawProfile.divisionId)} • {store.getDistrictName(selectedItem.rawProfile.districtId)}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <button
                  onClick={() => handleVerifyItem(selectedItem)}
                  className="w-full ui-btn-gold text-slate-950 py-3.5 rounded-xl font-black text-xs shadow-md flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>VERIFY APPLICATION RECORD</span>
                </button>

                <div className="bg-rose-50 border border-rose-200 text-rose-900 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-200 p-4 rounded-xl space-y-2">
                  <label className="block text-[11px] font-bold text-rose-800 dark:text-rose-300">If Rejecting, enter reason:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Ineligible or incomplete information"
                      className="flex-1 bg-white border border-slate-300 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white rounded-lg px-3 py-2 text-xs focus:border-rose-500 outline-none"
                    />
                    <button
                      onClick={() => handleRejectItem(selectedItem)}
                      className="bg-rose-700 hover:bg-rose-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Reject Request
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-16 text-center space-y-3 rounded-3xl shadow-sm">
              <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Select Application</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click on any pending request from the left queue to perform verification.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
