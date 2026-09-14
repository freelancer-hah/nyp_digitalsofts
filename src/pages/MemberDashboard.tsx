import React from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { DigitalIdCard } from '../components/DigitalIdCard';
import { CheckCircle2, Clock, XCircle, FileText, UserCheck, AlertTriangle } from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const profile = store.getProfileByUserId(currentUser?.id || '');

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6 bg-slate-50">
        <div className="ui-card p-8 space-y-4 shadow-sm border-slate-200">
          <FileText className="w-12 h-12 text-emerald-700 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">No Application Found</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            You have logged in with CNIC <strong className="text-slate-900 font-mono">{currentUser?.cnicNumber || 'Registered Account'}</strong>, but haven't submitted your NYP Sindh Membership Application Form yet.
          </p>
          <Link
            to="/signup"
            className="inline-block ui-btn-primary font-bold text-xs px-6 py-3 rounded-xl transition-all"
          >
            FILL MEMBERSHIP APPLICATION FORM NOW
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = profile.status === 'APPROVED';
  const isPending = profile.status === 'PENDING_VERIFICATION';
  const isVerified = profile.status === 'VERIFIED';
  const isRejected = profile.status === 'REJECTED';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-left space-y-8 bg-slate-50">
      
      {/* Welcome & Application Status Header */}
      <div className="ui-card p-8 space-y-6 shadow-sm border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Member Portal • Account Dashboard
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Welcome, {profile.fullName}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              CNIC: <span className="font-mono text-slate-900 font-bold">{profile.cnicNumber}</span> | Division: <span className="text-emerald-800 font-bold">{store.getDivisionName(profile.divisionId)}</span>
            </p>
          </div>

          {/* Status Badge */}
          <div>
            {isApproved && (
              <div className="ui-badge-green p-4 rounded-2xl flex items-center space-x-3 text-emerald-900">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">
                    Application Status
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">APPROVED & ISSUED</span>
                </div>
              </div>
            )}

            {(isPending || isVerified) && (
              <div className="ui-badge-amber p-4 rounded-2xl flex items-center space-x-3 text-amber-900">
                <Clock className="w-8 h-8 text-amber-700 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block tracking-wider">
                    Application Status
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {isVerified ? 'VERIFIED (Awaiting Authorization)' : 'UNDER SCRUTINY (Pending Verification)'}
                  </span>
                </div>
              </div>
            )}

            {isRejected && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center space-x-3 text-rose-900">
                <XCircle className="w-8 h-8 text-rose-700 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-800 block tracking-wider">
                    Application Status
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">APPLICATION REJECTED</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status explanation alert */}
        {isApproved && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                Your application has been authorized by President NYP Sindh. Assigned Designation: <strong className="text-slate-900">{profile.assignedDesignation || 'Executive Member'}</strong> | ID: <strong className="text-emerald-800 font-mono">{profile.membershipIdNumber}</strong>
              </span>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-800 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Rejection Reason: {profile.rejectionReason || 'Incomplete or unverified documentation details.'}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Card vs Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Digital Card (Unlocked if Approved) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="ui-card p-6 space-y-4 shadow-sm border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Official Digital Membership Card</span>
              {isApproved && <span className="text-xs text-emerald-700 font-bold">UNLOCKED</span>}
            </h3>

            {isApproved ? (
              <DigitalIdCard profile={profile} />
            ) : (
              <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-200 space-y-3">
                <Clock className="w-10 h-10 text-amber-700 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Card Locked During Scrutiny</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your Digital Membership Card and unique Membership ID number will unlock automatically once your form is approved by the verification authority.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Read-only Profile Overview */}
        <div className="lg:col-span-7">
          <div className="ui-card p-6 space-y-6 shadow-sm border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
              Submitted Application Overview
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Father / Guardian Name</span>
                <span className="font-semibold text-slate-900">{profile.fatherGuardianName}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Mobile / WhatsApp</span>
                <span className="font-semibold text-slate-900">{profile.mobileNumber}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Level Applied</span>
                <span className="font-semibold text-amber-800">{profile.levelApplied}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Preferred Department</span>
                <span className="font-semibold text-emerald-800">{profile.preferredDepartment}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500 text-[10px] block font-bold">Statement of Purpose:</span>
              <p className="text-slate-700 leading-relaxed italic">"{profile.statementOfPurpose || 'N/A'}"</p>
            </div>

            {/* Skills & Interests */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-500 text-[10px] font-bold uppercase block">Skills Selected:</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <span key={skill} className="ui-badge-green px-2.5 py-1 rounded-md text-[11px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
