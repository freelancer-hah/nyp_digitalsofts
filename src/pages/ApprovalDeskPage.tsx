import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { MemberProfile } from '../types';
import { Award, Search, UserCheck, Shield } from 'lucide-react';

export const ApprovalDeskPage: React.FC = () => {
  const [profiles, setProfiles] = useState<MemberProfile[]>(store.getAllProfiles());
  const [selectedProfile, setSelectedProfile] = useState<MemberProfile | null>(null);
  const [designation, setDesignation] = useState('Youth MPA (Member of Provincial Assembly)');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    store.fetchFromSupabase().then(() => {
      setProfiles([...store.getAllProfiles()]);
    });
  }, []);

  const refreshProfiles = () => {
    setProfiles([...store.getAllProfiles()]);
  };

  const verifiedList = profiles.filter((p) => p.status === 'VERIFIED');
  const filteredList = verifiedList.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cnicNumber.includes(searchQuery)
  );

  const handleApprove = (profile: MemberProfile) => {
    store.updateProfileStatus(profile.id, 'APPROVED', {
      designation: designation || 'Executive Member',
    });
    setSelectedProfile(null);
    refreshProfiles();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left space-y-8 bg-slate-50">
      
      {/* Header Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-2xl bg-white p-0.5 border-2 border-amber-300 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Approval Authority Desk</h1>
            <p className="text-xs text-emerald-100 font-medium">
              President NYP Sindh (Abdul Rehman Halepoto) & Central Management Portal
            </p>
          </div>
        </div>

        <span className="bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-bold px-4 py-2 rounded-full">
          {verifiedList.length} Awaiting Authorization
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="ui-card p-4 space-y-4 shadow-sm border-slate-200">
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search verified candidates..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>

            <div className="space-y-2 max-h-[550px] overflow-y-auto">
              {filteredList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No verified applications awaiting final authorization.
                </div>
              ) : (
                filteredList.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProfile(p);
                      setDesignation(p.preferredDepartment ? `Youth MPA (${p.preferredDepartment})` : 'Youth MPA');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedProfile?.id === p.id
                        ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.passportPhotoUrl}
                        alt={p.fullName}
                        className="w-10 h-12 object-cover rounded-lg border border-slate-300 bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{p.fullName}</h4>
                        <span className="text-[10px] font-mono text-emerald-700 block font-semibold">{p.cnicNumber}</span>
                        <span className="text-[9px] text-slate-500 block truncate">{store.getDivisionName(p.divisionId)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7">
          {selectedProfile ? (
            <div className="ui-card p-6 space-y-6 shadow-sm border-slate-200">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Final Authorization & Designation Assignment</h3>
                  <span className="text-xs text-slate-500">Candidate: {selectedProfile.fullName}</span>
                </div>
                <span className="ui-badge-green text-xs px-3 py-1 rounded-full font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={selectedProfile.passportPhotoUrl}
                  alt={selectedProfile.fullName}
                  className="w-20 h-24 object-cover rounded-xl border-2 border-emerald-600 bg-white shrink-0 shadow-sm"
                />
                <div className="space-y-1 text-xs text-slate-700">
                  <h4 className="font-bold text-slate-900 text-sm">{selectedProfile.fullName}</h4>
                  <p>CNIC: <strong className="font-mono text-amber-700">{selectedProfile.cnicNumber}</strong></p>
                  <p>Level Applied: <strong className="text-slate-900">{selectedProfile.levelApplied}</strong></p>
                  <p>Division: {store.getDivisionName(selectedProfile.divisionId)} • District: {store.getDistrictName(selectedProfile.districtId)}</p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Assign Official Designation / Office Bearer Role *
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-emerald-600 outline-none shadow-sm"
                >
                  <option value="Youth MPA (Member of Provincial Assembly)">Youth MPA (Member of Provincial Assembly)</option>
                  <option value="Youth Senator / Legislative Representative">Youth Senator / Legislative Representative</option>
                  <option value="Youth Judge / Judicial Committee Member">Youth Judge / Judicial Committee Member</option>
                  <option value="Divisional President / Secretary">Divisional President / Secretary</option>
                  <option value="District Coordinator">District Coordinator</option>
                  <option value="Executive Member - NYP Sindh">Executive Member - NYP Sindh</option>
                </select>

                <div className="text-[11px] text-slate-500 pt-1">
                  System will automatically generate unique Membership ID Number: <strong className="text-emerald-800 font-mono">NYP-SINDH-2026-{store.getDivisionName(selectedProfile.divisionId).slice(0,3).toUpperCase()}-XXXX</strong>
                </div>
              </div>

              <button
                onClick={() => handleApprove(selectedProfile)}
                className="w-full ui-btn-primary font-extrabold text-xs py-4 rounded-xl shadow-md flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-5 h-5 text-white" />
                <span>APPROVE & ISSUE DIGITAL MEMBERSHIP CARD</span>
              </button>

            </div>
          ) : (
            <div className="ui-card p-16 text-center space-y-3 border-slate-200">
              <Shield className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Select Verified Candidate</h3>
              <p className="text-xs text-slate-500">Select any candidate from the left list to issue official approval & designation.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
