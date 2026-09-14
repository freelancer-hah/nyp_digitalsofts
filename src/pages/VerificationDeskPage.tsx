import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { MemberProfile } from '../types';
import { ShieldCheck, CheckCircle2, Search, User } from 'lucide-react';

export const VerificationDeskPage: React.FC = () => {
  const [profiles, setProfiles] = useState<MemberProfile[]>(store.getAllProfiles());
  const [selectedProfile, setSelectedProfile] = useState<MemberProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    store.fetchFromSupabase().then(() => {
      setProfiles([...store.getAllProfiles()]);
    });
  }, []);

  const refreshProfiles = () => {
    setProfiles([...store.getAllProfiles()]);
  };

  const pendingList = profiles.filter((p) => p.status === 'PENDING_VERIFICATION');

  const filteredList = pendingList.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cnicNumber.includes(searchQuery) ||
      store.getDivisionName(p.divisionId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = (profileId: string) => {
    store.updateProfileStatus(profileId, 'VERIFIED');
    setSelectedProfile(null);
    refreshProfiles();
  };

  const handleReject = (profileId: string) => {
    if (!rejectionReason) {
      alert('Please enter a rejection reason.');
      return;
    }
    store.updateProfileStatus(profileId, 'REJECTED', { rejectionReason });
    setSelectedProfile(null);
    setRejectionReason('');
    refreshProfiles();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left space-y-8 bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-2xl bg-white p-0.5 border-2 border-emerald-600/30 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Verifying Officer Desk</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Scrutinize incoming CNIC applications, photo quality, and credentials before forwarding to Approval Authority.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/60 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
            {pendingList.length} Pending Scrutiny
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
                placeholder="Search by Name, CNIC or Division..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:border-emerald-600 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No pending verification forms found.
                </div>
              ) : (
                filteredList.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProfile(p)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedProfile?.id === p.id
                        ? 'bg-amber-50/80 border-amber-400 shadow-sm dark:bg-amber-950/40 dark:border-amber-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.passportPhotoUrl}
                        alt={p.fullName}
                        className="w-10 h-12 object-cover rounded-lg border border-slate-300 bg-slate-100 dark:bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate font-heading">{p.fullName}</h4>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">{p.cnicNumber}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                            {store.getDivisionName(p.divisionId)}
                          </span>
                          <span className="text-[9px] text-slate-600 dark:text-slate-400 truncate">{p.levelApplied}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-7">
          {selectedProfile ? (
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-6 space-y-6 shadow-md rounded-3xl backdrop-blur-md">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">Application Document Scrutiny</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">CNIC: {selectedProfile.cnicNumber}</span>
                </div>
                <span className="bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/60 text-xs px-3 py-1 rounded-full font-bold">
                  Pending Verification
                </span>
              </div>

              <div className="flex items-start space-x-6 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-4 rounded-2xl">
                <img
                  src={selectedProfile.passportPhotoUrl}
                  alt={selectedProfile.fullName}
                  className="w-24 h-32 object-cover rounded-xl border-2 border-emerald-600 bg-white shrink-0 shadow-sm"
                />
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm font-heading">{selectedProfile.fullName}</h4>
                  <p>S/D/W of: <strong className="text-slate-900 dark:text-white">{selectedProfile.fatherGuardianName}</strong></p>
                  <p>DOB: {selectedProfile.dob} | Gender: {selectedProfile.gender}</p>
                  <p>Mobile: <strong className="text-emerald-700 dark:text-emerald-400">{selectedProfile.mobileNumber}</strong></p>
                  <p>Email: {selectedProfile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-3.5 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Division / District</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {store.getDivisionName(selectedProfile.divisionId)} • {store.getDistrictName(selectedProfile.districtId)}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-3.5 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Education & Profession</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {selectedProfile.qualification} ({selectedProfile.profession})
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white p-4 rounded-xl text-xs space-y-1">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold block">Statement of Purpose:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">"{selectedProfile.statementOfPurpose || 'N/A'}"</p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <button
                  onClick={() => handleVerify(selectedProfile.id)}
                  className="w-full ui-btn-primary py-3.5 rounded-xl font-extrabold text-xs shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>MARK VERIFIED (Forward to President Desk)</span>
                </button>

                <div className="bg-rose-50 border border-rose-200 text-rose-900 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-200 p-4 rounded-xl space-y-2">
                  <label className="block text-[11px] font-bold text-rose-800 dark:text-rose-300">If Rejecting, enter reason:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Invalid CNIC or poor quality passport photograph"
                      className="flex-1 bg-white border border-slate-300 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white rounded-lg px-3 py-2 text-xs focus:border-rose-500 outline-none"
                    />
                    <button
                      onClick={() => handleReject(selectedProfile.id)}
                      className="bg-rose-700 hover:bg-rose-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Reject Form
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-16 text-center space-y-3 rounded-3xl shadow-sm">
              <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Select Application Form</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click on any pending profile from the left queue to perform scrutiny.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
