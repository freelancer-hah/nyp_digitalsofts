import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { DigitalIdCard } from '../components/DigitalIdCard';
import { 
  CheckCircle2, Clock, XCircle, FileText, UserCheck, 
  Sparkles, Award, CreditCard, ChevronRight, X, ShieldCheck 
} from 'lucide-react';
import { MemberProfile, RoleApplicationRequest, RoleTier } from '../types';

export const MemberDashboard: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [profile, setProfile] = useState<MemberProfile | undefined>(
    store.getProfileByUserId(currentUser?.id || currentUser?.cnicNumber || '')
  );
  const [roleApplications, setRoleApplications] = useState<RoleApplicationRequest[]>([]);

  // Modal State for Role Application
  const [selectedRoleModal, setSelectedRoleModal] = useState<{
    tier: RoleTier;
    title: string;
    fee: number;
  } | null>(null);

  const [targetRoleTitle, setTargetRoleTitle] = useState('');
  const [roleReason, setRoleReason] = useState('');

  // Payment Form State
  const [paymentModalReq, setPaymentModalReq] = useState<RoleApplicationRequest | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('JazzCash');
  const [transactionId, setTransactionId] = useState('');

  // Membership Fee Payment Modal State
  const [membershipFeeModalOpen, setMembershipFeeModalOpen] = useState(false);
  const [memPaymentMethod, setMemPaymentMethod] = useState('JazzCash');
  const [memTransactionId, setMemTransactionId] = useState('');

  const refreshData = () => {
    const user = store.getCurrentUser();
    if (user) {
      setProfile(store.getProfileByUserId(user.id || user.cnicNumber));
      setRoleApplications(store.getRoleApplicationsByUserId(user.id || user.cnicNumber));
    }
  };

  const handleMembershipFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !memTransactionId) return;

    await store.submitMembershipPayment(profile.id, memPaymentMethod, memTransactionId, 1000);
    setMembershipFeeModalOpen(false);
    setMemTransactionId('');
    refreshData();
  };

  useEffect(() => {
    refreshData();
    store.fetchFromSupabase().then(() => {
      refreshData();
    });
  }, [currentUser?.id, currentUser?.cnicNumber]);

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6 bg-slate-50 dark:bg-[#090e17]">
        <div className="ui-card p-8 space-y-4 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
          <FileText className="w-12 h-12 text-emerald-700 dark:text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">No Application Found</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {currentUser?.cnicNumber ? (
              <>You have logged in with CNIC <strong className="text-slate-900 dark:text-white font-mono">{currentUser.cnicNumber}</strong>, but no NYP Sindh Membership Application was found for this CNIC.</>
            ) : (
              <>Please log in with your registered CNIC and password, or submit the membership application form.</>
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/signup"
              className="inline-block ui-btn-gold text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all uppercase tracking-wider shadow-lg"
            >
              FILL MEMBERSHIP REGISTRATION FORM NOW
            </Link>
            <Link
              to="/login"
              className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all uppercase tracking-wider"
            >
              MEMBER SIGN IN
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenRoleModal = (tier: RoleTier, title: string, fee: number) => {
    setSelectedRoleModal({ tier, title, fee });
    setTargetRoleTitle(title);
    setRoleReason('');
  };

  const handleCreateRoleApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleModal || !roleReason) return;

    store.createRoleApplication({
      userId: profile.userId,
      cnicNumber: profile.cnicNumber,
      profileId: profile.id,
      roleTier: selectedRoleModal.tier,
      targetRoleTitle: targetRoleTitle || selectedRoleModal.title,
      reason: roleReason,
      feeAmount: selectedRoleModal.fee,
    });

    setSelectedRoleModal(null);
    refreshData();
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalReq || !transactionId) return;

    store.submitRoleApplicationPayment(paymentModalReq.id, paymentMethod, transactionId);
    setPaymentModalReq(null);
    setTransactionId('');
    refreshData();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-left space-y-8 bg-slate-50 dark:bg-[#090e17] transition-colors">
      
      {/* Welcome & Account Summary Header */}
      <div className="ui-card p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-black text-amber-500 uppercase tracking-widest block mb-1">
              NATIONAL YOUTH PARLIAMENT SINDH • MEMBER PORTAL
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading">
              Welcome, {profile.fullName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              CNIC: <span className="font-mono text-slate-900 dark:text-white font-bold">{profile.cnicNumber}</span> | Division: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{store.getDivisionName(profile.divisionId)}</span> | District: <span className="text-slate-800 dark:text-slate-200 font-bold">{store.getDistrictName(profile.districtId)}</span>
            </p>
          </div>

          {/* Membership Designation Badge */}
          {profile.status === 'APPROVED' ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 p-4 rounded-2xl flex items-center space-x-3 text-emerald-900 dark:text-emerald-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-black text-emerald-800 dark:text-emerald-400 block tracking-wider">
                  Official Membership Status
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  APPROVED • {profile.assignedDesignation || 'General Member'}
                </span>
              </div>
            </div>
          ) : profile.status === 'PAYMENT_SUBMITTED' ? (
            <div className="bg-purple-50 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700/60 p-4 rounded-2xl flex items-center space-x-3 text-purple-900 dark:text-purple-300">
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400 shrink-0 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-black text-purple-800 dark:text-purple-400 block tracking-wider">
                  Official Membership Status
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  FEE PAID • PENDING FINAL AUTHORISATION
                </span>
              </div>
            </div>
          ) : profile.status === 'VERIFIED' ? (
            <div className="bg-blue-50 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700/60 p-4 rounded-2xl flex items-center space-x-3 text-blue-900 dark:text-blue-300">
              <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-black text-blue-800 dark:text-blue-400 block tracking-wider">
                  Official Membership Status
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  VERIFIED • MEMBERSHIP FEE REQUIRED
                </span>
              </div>
            </div>
          ) : profile.status === 'REJECTED' ? (
            <div className="bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700/60 p-4 rounded-2xl flex items-center space-x-3 text-rose-900 dark:text-rose-300">
              <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-black text-rose-800 dark:text-rose-400 block tracking-wider">
                  Official Membership Status
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  APPLICATION REJECTED
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 p-4 rounded-2xl flex items-center space-x-3 text-amber-900 dark:text-amber-300">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-black text-amber-800 dark:text-amber-400 block tracking-wider">
                  Official Membership Status
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  PENDING VERIFICATION
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-emerald-900/10 border border-emerald-500/30 p-4 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>
              Member ID: <strong className="text-emerald-800 dark:text-emerald-300 font-mono text-sm">{profile.membershipIdNumber || 'Pending Issuance'}</strong> | Status: <strong className="text-slate-900 dark:text-white font-bold uppercase">{profile.status}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: UPGRADE YOUR ROLE / APPLY FOR ASSEMBLY ROLES (ONLY FOR APPROVED MEMBERS) */}
      {profile.status === 'APPROVED' && (() => {
        const hasActiveRoleApp = (tier: RoleTier) => roleApplications.some((r) => r.roleTier === tier && r.status !== 'REJECTED');
        const showYouthMpa = !hasActiveRoleApp('YOUTH_MPA');
        const showYouthMna = !hasActiveRoleApp('YOUTH_MNA');
        const showDivisional = !hasActiveRoleApp('DIVISIONAL_ROLE');
        const showDistrict = !hasActiveRoleApp('DISTRICT_ROLE');
        const showTaluka = !hasActiveRoleApp('TALUKA_ROLE');
        const showPhysicalCard = !hasActiveRoleApp('PHYSICAL_CARD');

        const availableCardsCount = [showYouthMpa, showYouthMna, showDivisional, showDistrict, showTaluka, showPhysicalCard].filter(Boolean).length;

        return (
          <div className="ui-card p-6 sm:p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1 text-xs font-black text-amber-500 uppercase tracking-widest mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>APPLY FOR HIGHER PARLIAMENTARY & DIVISIONAL ROLES</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                  Youth Representative Role Tier Applications
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Select a role to apply. Requests are reviewed by Verification Desk, followed by fee payment & final Authorisation.
              </p>
            </div>

            {availableCardsCount === 0 ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 p-6 rounded-2xl text-center text-xs text-emerald-900 dark:text-emerald-200 font-bold space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <p className="text-sm font-black font-heading text-slate-900 dark:text-white">All Specialized Role Applications Submitted</p>
                <p className="text-slate-600 dark:text-slate-400 font-normal">You have submitted application requests for all available role tiers. Track your live desk verification & fee payment statuses below.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* 1. APPLY FOR YOUTH MPA */}
                {showYouthMpa && (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                          Provincial Assembly
                        </span>
                        <span className="text-sm font-black text-amber-500 font-mono">PKR 4,000</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">APPLY FOR YOUTH MPA</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Represent your constituency in the Youth Provincial Assembly of Sindh with legislative debate privileges.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenRoleModal('YOUTH_MPA', 'Youth Member of Provincial Assembly (Youth MPA)', 4000)}
                      className="w-full ui-btn-gold text-slate-950 font-black text-xs py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Apply for Youth MPA</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 2. APPLY FOR YOUTH MNA */}
                {showYouthMna && (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                          National Assembly
                        </span>
                        <span className="text-sm font-black text-amber-500 font-mono">PKR 5,000</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">APPLY FOR YOUTH MNA</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        National Youth Parliament Representative for federal youth parliamentary caucuses and bill drafting.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenRoleModal('YOUTH_MNA', 'Youth Member of National Assembly (Youth MNA)', 5000)}
                      className="w-full ui-btn-gold text-slate-950 font-black text-xs py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Apply for Youth MNA</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 3. APPLY FOR DIVISIONAL ROLE */}
                {showDivisional && (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                          Divisional Level
                        </span>
                        <span className="text-sm font-black text-amber-500 font-mono">PKR 3,000</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">APPLY FOR DIVISIONAL ROLE</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Divisional Coordinator / Executive Member across Karachi, Sukkur, Hyderabad, Larkana, Mirpurkhas, or SBA.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenRoleModal('DIVISIONAL_ROLE', 'Divisional Youth Coordinator / Executive', 3000)}
                      className="w-full ui-btn-gold text-slate-950 font-black text-xs py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Apply for Divisional Role</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 4. APPLY FOR DISTRICT ROLE */}
                {showDistrict && (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                          District Level
                        </span>
                        <span className="text-sm font-black text-amber-500 font-mono">PKR 2,000</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">APPLY FOR DISTRICT ROLE</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        District President / Coordinator across 30 administrative districts of Sindh.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenRoleModal('DISTRICT_ROLE', 'District Youth Coordinator', 2000)}
                      className="w-full ui-btn-gold text-slate-950 font-black text-xs py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Apply for District Role</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 5. APPLY FOR CITY OR TALUKA ROLE */}
                {showTaluka && (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                          Taluka / City Level
                        </span>
                        <span className="text-sm font-black text-amber-500 font-mono">PKR 1,500</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">APPLY FOR CITY / TALUKA ROLE</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Grassroots Taluka Organiser & Youth City Representative.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenRoleModal('TALUKA_ROLE', 'Taluka / City Youth Representative', 1500)}
                      className="w-full ui-btn-gold text-slate-950 font-black text-xs py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Apply for Taluka Role</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 6. PHYSICAL MEMBERSHIP CARD */}
                {showPhysicalCard && (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                          Physical Printed Card
                        </span>
                        <span className="text-sm font-black text-amber-500 font-mono">PKR 1,000</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">PHYSICAL MEMBERSHIP CARD</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Order plastic laminated official membership pass delivered to your residential address.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenRoleModal('PHYSICAL_CARD', 'Physical Printed Plastic ID Card Pass', 1000)}
                      className="w-full ui-btn-gold text-slate-950 font-black text-xs py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Order Physical Card</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        );
      })()}

      {/* TRACK SUBMITTED ROLE APPLICATIONS */}
      {roleApplications.length > 0 && (
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-slate-800 pb-4">
            My Submitted Role Applications & Fee Payment Status
          </h2>

          <div className="space-y-4">
            {roleApplications.map((req) => (
              <div key={req.id} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-slate-900 dark:text-white text-sm">{req.targetRoleTitle}</span>
                    <span className="font-mono text-amber-500 font-bold">PKR {req.feeAmount}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 italic">"{req.reason}"</p>
                  <p className="text-[10px] text-slate-400">Submitted: {new Date(req.submittedAt).toLocaleDateString()}</p>
                </div>

                <div>
                  {req.status === 'PENDING_VERIFICATION' && (
                    <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-3.5 py-1.5 rounded-xl font-extrabold flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Pending Verification Desk</span>
                    </span>
                  )}

                  {req.status === 'VERIFIED_PENDING_PAYMENT' && (
                    <button
                      onClick={() => setPaymentModalReq(req)}
                      className="ui-btn-gold text-slate-950 px-4 py-2 rounded-xl font-black flex items-center space-x-2 shadow-lg cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-slate-950" />
                      <span>VERIFIED! PAY PKR {req.feeAmount} NOW</span>
                    </button>
                  )}

                  {req.status === 'PAYMENT_SUBMITTED_PENDING_AUTHORISATION' && (
                    <span className="bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700 px-3.5 py-1.5 rounded-xl font-extrabold flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Payment Submitted (Pending Authorisation Desk)</span>
                    </span>
                  )}

                  {req.status === 'AUTHORISED' && (
                    <span className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-3.5 py-1.5 rounded-xl font-extrabold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>AUTHORISED & ROLE CONFERRED</span>
                    </span>
                  )}

                  {req.status === 'REJECTED' && (
                    <span className="bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700 px-3.5 py-1.5 rounded-xl font-extrabold flex items-center space-x-1">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>REJECTED BY DESK</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Width Official Membership Card Section */}
      <div className="w-full space-y-6">
        <div className="ui-card p-4 sm:p-6 lg:p-8 space-y-4 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">OFFICIAL VERIFIED DELEGATE PASS</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                NYP Sindh Digital &amp; Printable Membership Card
              </h3>
            </div>
            {profile.status === 'APPROVED' ? (
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center space-x-1.5 bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-700/60 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>VERIFIED &amp; AUTHORISED</span>
              </span>
            ) : profile.status === 'VERIFIED' ? (
              <span className="text-xs text-blue-700 dark:text-blue-400 font-extrabold flex items-center space-x-1.5 bg-blue-100 dark:bg-blue-950 px-3 py-1.5 rounded-full border border-blue-300 dark:border-blue-700/60 shrink-0">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>VERIFIED - PENDING FINAL APPROVAL</span>
              </span>
            ) : profile.status === 'REJECTED' ? (
              <span className="text-xs text-rose-700 dark:text-rose-400 font-extrabold flex items-center space-x-1.5 bg-rose-100 dark:bg-rose-950 px-3 py-1.5 rounded-full border border-rose-300 dark:border-rose-700/60 shrink-0">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>REJECTED</span>
              </span>
            ) : (
              <span className="text-xs text-amber-700 dark:text-amber-400 font-extrabold flex items-center space-x-1.5 bg-amber-100 dark:bg-amber-950 px-3 py-1.5 rounded-full border border-amber-300 dark:border-amber-700/60 shrink-0">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>PENDING VERIFICATION</span>
              </span>
            )}
          </div>

          {profile.status === 'APPROVED' ? (
            <DigitalIdCard profile={profile} />
          ) : profile.status === 'PAYMENT_SUBMITTED' ? (
            <div className="bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 p-8 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-700 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h4 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                  Membership Fee Payment Submitted (Txn ID: {profile.paymentDetails?.transactionId || 'Submitted'})
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your Membership Fee payment of PKR 1,000 via {profile.paymentDetails?.paymentMethod || 'Online'} has been received. It is currently undergoing final verification at the Authorisation Desk. Once confirmed by the Authoriser, your official Digital &amp; Printable Membership Card will be automatically conferred &amp; displayed here.
                </p>
              </div>
              <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-950 px-4 py-2 rounded-xl text-xs font-mono text-purple-900 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-800">
                <span>Payment Method: {profile.paymentDetails?.paymentMethod}</span>
                <span>•</span>
                <span>Txn ID: {profile.paymentDetails?.transactionId}</span>
              </div>
            </div>
          ) : profile.status === 'VERIFIED' ? (
            <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 p-8 rounded-2xl text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-300 dark:border-blue-700 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                <CreditCard className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h4 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                  Profile Verified! Membership Fee Payment Required
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your membership profile details have passed Desk Verification! Please submit your official Membership Fee (PKR 1,000) below to send your record to the Authorisation Desk and receive your Official Digital &amp; Printable Card.
                </p>
              </div>
              <div>
                <button
                  onClick={() => setMembershipFeeModalOpen(true)}
                  className="ui-btn-gold text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-xl flex items-center justify-center space-x-2 mx-auto cursor-pointer hover:scale-105 transition-all"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>PAY MEMBERSHIP FEE NOW (PKR 1,000)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
                <Clock className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h4 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                  {profile.status === 'REJECTED'
                    ? 'Application Rejected'
                    : 'Membership Card Generation Pending Verification'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {profile.status === 'REJECTED'
                    ? `Your membership application was not approved. Reason: ${profile.rejectionReason || 'Please contact Secretariat for details.'}`
                    : 'Your membership application details have been submitted successfully. Your request is currently under scrutiny at the Verification Desk. Once verified, fee payment option will be unlocked to issue your Official Membership Card.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Member Credentials Overview */}
      <div className="w-full">
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 font-heading">
            Member Credentials Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[10px]">Father / Guardian Name</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.fatherGuardianName}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[10px]">Mobile / WhatsApp</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.mobileNumber}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[10px]">Division</span>
              <span className="font-semibold text-amber-500">{store.getDivisionName(profile.divisionId)}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[10px]">Preferred Responsibility</span>
              <span className="font-semibold text-emerald-500">{profile.preferredDepartment}</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <span className="text-slate-500 text-[10px] block font-bold">Why join NYP Sindh:</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">"{profile.statementOfPurpose || 'N/A'}"</p>
          </div>

          {/* Skills Selected */}
          <div className="space-y-2 text-xs">
            <span className="text-slate-500 text-[10px] font-bold uppercase block">Skills Selected:</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span key={skill} className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ROLE APPLICATION MODAL */}
      {selectedRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">ROLE APPLICATION FORM</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">{selectedRoleModal.title}</h3>
              </div>
              <button onClick={() => setSelectedRoleModal(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleApplication} className="space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">Pre-filled Applicant Data</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{profile.fullName} ({profile.cnicNumber})</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">{store.getDivisionName(profile.divisionId)} • {store.getDistrictName(profile.districtId)}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Specific Role / Position Title *</label>
                <input
                  type="text"
                  required
                  value={targetRoleTitle}
                  onChange={(e) => setTargetRoleTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Why do you want this role? (Justification) *</label>
                <textarea
                  required
                  rows={3}
                  value={roleReason}
                  onChange={(e) => setRoleReason(e.target.value)}
                  placeholder="Explain why you are qualified for this specific role..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
                ></textarea>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 p-3.5 rounded-xl text-amber-900 dark:text-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold block">Required Role Fee</span>
                  <span className="text-sm font-black font-mono">PKR {selectedRoleModal.fee}</span>
                </div>
                <span className="text-[10px] font-semibold">Payable upon verification</span>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedRoleModal(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ui-btn-gold text-slate-950 font-black px-6 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  SUBMIT ROLE APPLICATION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEE PAYMENT MODAL */}
      {paymentModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">VERIFIED ROLE FEE PAYMENT</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">{paymentModalReq.targetRoleTitle}</h3>
              </div>
              <button onClick={() => setPaymentModalReq(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-emerald-200 block uppercase font-bold">Total Fee Amount</span>
                <p className="text-2xl font-black font-mono">PKR {paymentModalReq.feeAmount}</p>
                <p className="text-[11px] text-emerald-100">Send fee to NYP Sindh Official Account (JazzCash / EasyPaisa: 0331 9226110)</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold"
                >
                  <option value="JazzCash">JazzCash (0331 9226110)</option>
                  <option value="EasyPaisa">EasyPaisa (0331 9226110)</option>
                  <option value="Bank Transfer">Bank Transfer (Meezan Bank NYP Sindh)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Transaction ID / Reference Number *</label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. 09823746152"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalReq(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ui-btn-gold text-slate-950 font-black px-6 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  SUBMIT PAYMENT PROOF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBERSHIP FEE PAYMENT MODAL */}
      {membershipFeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">OFFICIAL MEMBERSHIP FEE</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">Pay PKR 1,000 to Unlock Card</h3>
              </div>
              <button onClick={() => setMembershipFeeModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMembershipFeeSubmit} className="space-y-4 text-xs">
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 text-white p-5 rounded-2xl space-y-2 border border-amber-400/40">
                <span className="text-[10px] text-amber-300 block uppercase font-bold">Total Membership Fee</span>
                <p className="text-3xl font-black font-mono text-amber-400">PKR 1,000</p>
                <div className="pt-2 text-[11px] text-emerald-100 space-y-1 border-t border-emerald-800/80">
                  <p>• <strong>JazzCash / EasyPaisa:</strong> 0331 9226110 (NYP Sindh Secretariat)</p>
                  <p>• <strong>Meezan Bank:</strong> 01020304050607 (National Youth Parliament Sindh)</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method *</label>
                <select
                  value={memPaymentMethod}
                  onChange={(e) => setMemPaymentMethod(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold"
                >
                  <option value="JazzCash">JazzCash (0331 9226110)</option>
                  <option value="EasyPaisa">EasyPaisa (0331 9226110)</option>
                  <option value="Bank Transfer">Bank Transfer (Meezan Bank NYP Sindh)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Transaction ID / Reference Number *</label>
                <input
                  type="text"
                  required
                  value={memTransactionId}
                  onChange={(e) => setMemTransactionId(e.target.value)}
                  placeholder="Enter 10-12 digit Transaction ID (e.g. 09823746152)"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setMembershipFeeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ui-btn-gold text-slate-950 font-black px-6 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  SUBMIT PAYMENT PROOF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
