import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, Users, ArrowRight, ShieldCheck, MapPin, Megaphone, 
  CheckCircle2, ChevronRight, Landmark, Sparkles, Building2, 
  Layers, BookOpen, Scale, FileText, BadgeCheck, Compass
} from 'lucide-react';
import { store } from '../services/store';
import { SINDH_DIVISIONS } from '../data/sindhHierarchy';

export const HomePage: React.FC = () => {
  const stats = store.getStats();
  const leadershipMessages = store.getLeadershipMessages();
  const announcements = store.getAnnouncements();

  const currentUser = store.getCurrentUser();
  const profile = currentUser ? store.getProfileByUserId(currentUser.id) : undefined;
  const hasApplied = Boolean(profile);

  const divisionImages: Record<string, string> = {
    'div-karachi': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=600',
    'div-hyderabad': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600',
    'div-sukkur': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80&w=600',
    'div-larkana': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=600',
    'div-mirpurkhas': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
    'div-sba': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600'
  };

  return (
    <div className="space-y-24 pb-24 overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* 1. HERO SECTION WITH RICH AMBIENT GLOW & FLOATING ANIMATIONS */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] flex items-center bg-gradient-to-b from-emerald-100/70 via-slate-50 to-slate-100 dark:from-[#062016] dark:via-[#091522] dark:to-[#090e17] border-b border-slate-200/60 dark:border-slate-800/80 transition-colors duration-300">
        
        {/* Soft Ambient Light Glow Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Hero Main Content Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          
          {/* Hero Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-left animate-fade-in">
            
            <div className="inline-flex items-center space-x-3 bg-white/90 border border-emerald-300 text-emerald-800 dark:bg-slate-900/80 dark:border-emerald-500/30 dark:text-emerald-300 px-4 py-2 rounded-full text-xs font-extrabold shadow-md backdrop-blur-md animate-float">
              <div className="w-6 h-6 rounded-full border border-amber-400 bg-white p-0.5 overflow-hidden shrink-0 shadow-sm">
                <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="tracking-wider">OFFICIAL DIGITAL PORTAL • NATIONAL YOUTH PARLIAMENT SINDH</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] font-heading text-slate-900 dark:text-white">
              Empowering Tomorrow's <br />
              <span className="text-gradient-emerald">
                Leaders of Sindh
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
              Official digital governance & membership platform for Provincial Youth MPAs, Legal Advocates, and Civic Leaders across all 6 administrative divisions of Sindh.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {hasApplied ? (
                <Link
                  to="/member/dashboard"
                  className="ui-btn-primary text-white font-black text-xs sm:text-sm px-8 py-4 rounded-2xl uppercase tracking-wider flex items-center space-x-3 shadow-xl group"
                >
                  <span>GO TO MY ACCOUNT DASHBOARD</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-white" />
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="ui-btn-gold text-slate-950 font-black text-xs sm:text-sm px-8 py-4 rounded-2xl uppercase tracking-wider flex items-center space-x-3 shadow-xl group"
                >
                  <span>APPLY FOR MEMBERSHIP 2026</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-slate-950" />
                </Link>
              )}

              <Link
                to="/cabinets"
                className="bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-emerald-600 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm px-7 py-4 rounded-2xl flex items-center space-x-2.5 shadow-md transition-colors"
              >
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>View Provincial Cabinet</span>
              </Link>
            </div>

            {/* Key Platform Highlights Cards */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-300/80 dark:border-slate-800/80 text-left">
              <div className="bg-white border border-slate-200 text-slate-900 shadow-md hover:border-emerald-500/50 dark:bg-slate-900/60 dark:border-slate-800 dark:text-white p-4 rounded-2xl backdrop-blur-md transition-all duration-300">
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">6 Divisions</div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">Karachi to Kashmore</div>
              </div>
              <div className="bg-white border border-slate-200 text-slate-900 shadow-md hover:border-emerald-500/50 dark:bg-slate-900/60 dark:border-slate-800 dark:text-white p-4 rounded-2xl backdrop-blur-md transition-all duration-300">
                <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-heading">CNIC Verified</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">13-Digit Database Security</div>
              </div>
              <div className="bg-white border border-slate-200 text-slate-900 shadow-md hover:border-amber-500/50 dark:bg-slate-900/60 dark:border-slate-800 dark:text-white p-4 rounded-2xl backdrop-blur-md transition-all duration-300">
                <div className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400 font-heading">Digital Badge</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Verified Plastic Printing</div>
              </div>
            </div>

          </div>

          {/* Hero Right Widget: Live Dashboard Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200/90 shadow-2xl text-slate-900 dark:bg-slate-900/80 dark:border-emerald-500/30 dark:text-white p-8 space-y-6 rounded-3xl relative overflow-hidden backdrop-blur-xl glow-card">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center space-x-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl border-2 border-amber-400/80 bg-white p-1 shadow-lg shrink-0 overflow-hidden">
                  <img src="/nyp-logo.jpg" alt="NYP Sindh Emblem" className="w-full h-full object-contain rounded-xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-slate-900 dark:text-white text-lg font-heading leading-tight">
                    NYP Sindh Membership Portal
                  </h3>
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mt-1 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>Join • Engage • Lead • Serve</span>
                  </p>
                </div>
              </div>

              {/* Registration Stats Widget */}
              <div className="space-y-4 text-left">
                <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-900 dark:from-emerald-950 dark:via-emerald-900 dark:to-teal-950 text-white p-5 rounded-2xl border border-emerald-600/50 flex items-center justify-between shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md text-amber-300 shadow-sm border border-white/10">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs text-emerald-100 block font-bold">Registered Youth Members</span>
                      <span className="text-3xl font-black text-white tracking-tight font-heading">{stats.total} +</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500/30 text-amber-300 border border-amber-400/40 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                    LIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950/70 dark:border-slate-800 dark:text-white p-4 rounded-2xl">
                    <span className="text-slate-600 dark:text-slate-400 block text-[11px] font-bold">Approved Members</span>
                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-heading">{stats.approved}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950/70 dark:border-slate-800 dark:text-white p-4 rounded-2xl">
                    <span className="text-slate-600 dark:text-slate-400 block text-[11px] font-bold">Under Scrutiny</span>
                    <span className="text-2xl font-black text-amber-700 dark:text-amber-400 font-heading">{stats.pending + stats.verified}</span>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="w-full block text-center ui-btn-primary py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl"
                >
                  MEMBER PORTAL LOGIN
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. CORE PILLARS & FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 dark:text-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-500/30 px-4 py-1.5 rounded-full shadow-sm">
            WHY NYP SINDH?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white pt-2 font-heading">
            Pillars of Democratic & Youth Governance
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Providing a structured, constitutional, and policy-oriented platform for passionate youth across Sindh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200/90 text-slate-900 shadow-lg dark:bg-slate-900/60 dark:border-slate-800 dark:text-white p-7 rounded-3xl space-y-4 text-left hover:border-emerald-500/60 hover:shadow-2xl transition-all duration-300 group backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 dark:bg-emerald-950 dark:border-emerald-500/40 p-3.5 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Landmark className="w-7 h-7 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Parliamentary Debates</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Hands-on training in parliamentary assembly procedures, resolution drafting, and legislative motions.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 text-slate-900 shadow-lg dark:bg-slate-900/60 dark:border-slate-800 dark:text-white p-7 rounded-3xl space-y-4 text-left hover:border-amber-500/60 hover:shadow-2xl transition-all duration-300 group backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 dark:bg-amber-950/60 dark:border-amber-500/40 p-3.5 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Scale className="w-7 h-7 text-amber-700 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Constitutional Literacy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Empowering law graduates and young advocates across 30 districts of Sindh with legal education.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 text-slate-900 shadow-lg dark:bg-slate-900/60 dark:border-slate-800 dark:text-white p-7 rounded-3xl space-y-4 text-left hover:border-teal-500/60 hover:shadow-2xl transition-all duration-300 group backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 border border-teal-300 dark:bg-teal-950/60 dark:border-teal-500/40 p-3.5 text-teal-700 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Building2 className="w-7 h-7 text-teal-700 dark:text-teal-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Divisional Assemblies</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Active youth caucuses across Karachi, Hyderabad, Sukkur, Larkana, Mirpurkhas, & Shaheed Benazirabad.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 text-slate-900 shadow-lg dark:bg-slate-900/60 dark:border-slate-800 dark:text-white p-7 rounded-3xl space-y-4 text-left hover:border-purple-500/60 hover:shadow-2xl transition-all duration-300 group backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-300 dark:bg-purple-950/60 dark:border-purple-500/40 p-3.5 text-purple-700 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <BadgeCheck className="w-7 h-7 text-purple-700 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">CNIC Verified Cards</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Official membership credentials with verified CNIC authentication and plastic ID badge printing.
            </p>
          </div>
        </div>
      </section>

      {/* 3. YOUTH SUMMIT FEATURE BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-emerald-500/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-950/90 border border-amber-400/50 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Annual Youth Parliamentary Summit 2026</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight font-heading">
                Building Next Generation <br />
                <span className="text-amber-400">Provincial Parliamentarians</span>
              </h2>

              <p className="text-sm text-emerald-100 leading-relaxed">
                Join hundreds of passionate delegates from across Sindh for policy debates, youth assembly resolutions, SDG advocacy, and leadership summits in Karachi.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/signup"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-7 py-4 rounded-xl uppercase tracking-wider flex items-center space-x-2 shadow-xl transition-all"
                >
                  <span>REGISTER DELEGATE PASS</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>
                <Link
                  to="/announcements"
                  className="bg-emerald-950/80 text-white font-bold text-xs px-7 py-4 rounded-xl border border-emerald-600 hover:border-amber-400 transition-colors"
                >
                  Read Summit Bulletin
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl group">
                <img 
                  src="/nyp-youth-summit.jpg" 
                  alt="NYP Sindh Leadership Summit" 
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 text-left">
                  <p className="text-xs font-bold text-white">Sindh Youth Leadership Assembly Delegation</p>
                  <p className="text-[11px] text-amber-400 font-semibold">Provincial Delegate Pass & ID Badge Verification System</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3.5 YOUTH LEADERSHIP & ASSEMBLY ACTION GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/90 text-slate-900 shadow-xl dark:bg-slate-900/70 dark:border-slate-800 dark:text-white p-8 sm:p-12 space-y-8 rounded-3xl text-left backdrop-blur-md">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>YOUTH MOVEMENT IN ACTION</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading">
                Assembly Sessions & Leadership Gallery
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
              Highlights from parliamentary bill caucuses, delegate pass distributions, and regional youth conventions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200 text-slate-900 shadow-md hover:border-amber-500/60 dark:bg-slate-950 dark:border-slate-800 dark:text-white rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800" 
                  alt="Provincial Youth Assembly Session" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <span className="absolute top-3 left-3 bg-emerald-900/90 border border-emerald-500/60 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider backdrop-blur-md">
                  PARLIAMENTARY SESSION
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">Youth MPA House Debates</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Provincial assembly resolution drafting & youth legislative caucuses.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 text-slate-900 shadow-md hover:border-emerald-500/60 dark:bg-slate-950 dark:border-slate-800 dark:text-white rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" 
                  alt="Bill Drafting Workshop" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <span className="absolute top-3 left-3 bg-amber-900/90 border border-amber-500/60 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider backdrop-blur-md">
                  LEGAL LITERACY
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">Constitutional Bill Drafting</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Empowering law advocates across 30 districts with policy training.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 text-slate-900 shadow-md hover:border-teal-500/60 dark:bg-slate-950 dark:border-slate-800 dark:text-white rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800" 
                  alt="Delegate Credentials" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <span className="absolute top-3 left-3 bg-teal-900/90 border border-teal-500/60 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider backdrop-blur-md">
                  VERIFIED DELEGATE CARDS
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">CNIC Pass Distribution</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Verified membership cards & delegate badge printing for summit entry.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 text-slate-900 shadow-md hover:border-purple-500/60 dark:bg-slate-950 dark:border-slate-800 dark:text-white rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800" 
                  alt="Divisional Assemblies" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <span className="absolute top-3 left-3 bg-purple-900/90 border border-purple-500/60 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider backdrop-blur-md">
                  6 DIVISIONS
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">Regional Youth Conventions</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Karachi, Sukkur, Hyderabad, Larkana, Mirpurkhas & SBA assemblies.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. REGIONAL DIVISIONS LIVE COUNTER WITH IMAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/90 text-slate-900 shadow-xl dark:bg-slate-900/70 dark:border-slate-800 dark:text-white p-8 sm:p-12 space-y-8 rounded-3xl text-left backdrop-blur-md">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 dark:text-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Regional Administrative Distribution</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading">
                6 Administrative Divisions of Sindh
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
              Live registration tallies categorized across all 6 administrative divisions of Sindh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SINDH_DIVISIONS.map((division) => {
              const count = stats.divisionCounts[division.name] || 0;
              const imgUrl = divisionImages[division.id] || 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=600';
              
              return (
                <div
                  key={division.id}
                  className="bg-slate-50 border border-slate-200 text-slate-900 shadow-md hover:border-emerald-500/60 dark:bg-slate-950 dark:border-slate-800 dark:text-white rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={imgUrl} 
                      alt={division.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    
                    <span className="absolute top-3 left-3 bg-white/90 border border-slate-300 text-emerald-800 dark:bg-slate-900/90 dark:border-slate-700 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider backdrop-blur-md shadow-md">
                      {division.code} DIVISION
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                      {division.name}
                    </h4>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold block">Active Registrations</span>
                        <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-heading">{count}</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60 text-[10px] font-black px-2.5 py-1 rounded-md">
                        OPERATIONAL
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. EXECUTIVE LEADERSHIP MESSAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 dark:text-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-500/30 px-4 py-1.5 rounded-full shadow-sm">
            EXECUTIVE LEADERSHIP
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white pt-2 font-heading">
            Messages from Provincial Leadership
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Guiding vision for youth policy, legislative education, and civic governance in Sindh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {leadershipMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white border border-slate-200/90 text-slate-900 shadow-xl dark:bg-slate-900/70 dark:border-slate-800 dark:text-white p-8 flex flex-col justify-between text-left space-y-6 rounded-3xl backdrop-blur-md hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={msg.photoUrl}
                    alt={msg.leaderName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-lg shrink-0 bg-slate-100 dark:bg-slate-800"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">{msg.leaderName}</h3>
                    <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">{msg.leaderTitle}</p>
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-3 border-amber-400 pl-4 py-1">
                  "{msg.messageText}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">National Youth Parliament Sindh</span>
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ANNOUNCEMENTS & NEWS BULLETINS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/90 text-slate-900 shadow-xl dark:bg-slate-900/70 dark:border-slate-800 dark:text-white p-8 sm:p-12 space-y-8 rounded-3xl text-left backdrop-blur-md">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
            <div className="flex items-center space-x-3 text-slate-900 dark:text-white font-bold text-xl font-heading">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950 rounded-xl text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700">
                <Megaphone className="w-5 h-5" />
              </div>
              <span>Latest Bulletins & Announcements</span>
            </div>
            <Link to="/announcements" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center space-x-1 group">
              <span>View All Bulletins</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white rounded-2xl overflow-hidden text-left flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 group">
                <div>
                  <div className="relative overflow-hidden h-44">
                    <img 
                      src={ann.bannerUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800'} 
                      alt={ann.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 border border-slate-300 text-emerald-800 dark:bg-slate-900/90 dark:border-slate-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md backdrop-blur-md">
                      {ann.publishedAt}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-2 font-heading">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <Link to="/announcements" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center space-x-1">
                    <span>Read Full Bulletin</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CALL TO ACTION (CTA) BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center space-y-6 bg-gradient-to-r from-[#032417] via-[#053d27] to-[#04281f] border border-emerald-500/50 shadow-2xl text-white">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-600 text-emerald-200 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest relative z-10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>JOIN THE LEGISLATIVE MOVEMENT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight relative z-10 font-heading">
            Ready to Represent Your Division in NYP Sindh?
          </h2>

          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto relative z-10">
            Submit your CNIC-based membership application online. Join youth members from Karachi to Kashmore shaping public policy and civic leadership.
          </p>

          <div className="pt-4 relative z-10 flex flex-wrap items-center justify-center gap-4">
            {hasApplied ? (
              <Link
                to="/member/dashboard"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-9 py-4 rounded-2xl uppercase tracking-wider flex items-center space-x-2.5 shadow-2xl transition-all"
              >
                <span>GO TO MEMBER DASHBOARD</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-9 py-4 rounded-2xl uppercase tracking-wider flex items-center space-x-2.5 shadow-2xl transition-all"
              >
                <span>APPLY FOR MEMBERSHIP ONLINE</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};

