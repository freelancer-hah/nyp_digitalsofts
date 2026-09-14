import React from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  Heart, 
  Shield, 
  ArrowUp, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Users, 
  ExternalLink,
  Globe,
  Clock,
  UserCheck
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const profile = currentUser ? store.getProfileByUserId(currentUser.id) : undefined;
  const hasApplied = Boolean(profile);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-900 text-slate-300 text-sm overflow-hidden border-t border-slate-800">
      {/* Top Ambient Glow & Decorative Gradient Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/80 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
      
      {/* Pre-Footer Action Banner (Hidden for members who have already submitted an application) */}
      {!hasApplied && (
        <div className="relative border-b border-slate-800 bg-[#070d17]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group backdrop-blur-xl">
              {/* Ambient inner shine */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none transition-all duration-700" />
              
              <div className="space-y-2 text-center md:text-left z-10">
                <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-600/50 px-3 py-1 rounded-full text-xs text-emerald-300 font-extrabold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Empowering Youth Governance in Sindh</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight font-heading">
                  Ready to Join National Youth Parliament Sindh?
                </h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Be a part of 6 Divisional Cabinets representing Karachi, Hyderabad, Sukkur, Larkana, Shaheed Benazirabad, & Mirpurkhas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full md:w-auto">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto text-center ui-btn-gold font-black px-6 py-3.5 rounded-xl text-xs transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-slate-950" />
                  <span>Apply For Membership</span>
                </Link>
                <Link
                  to="/cabinets"
                  className="w-full sm:w-auto text-center ui-btn-secondary font-bold px-5 py-3 rounded-xl text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>View Cabinets</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Col 1: About & Branding */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-amber-400/80 flex items-center justify-center shadow-lg shadow-emerald-950 overflow-hidden shrink-0">
                <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-xl" />
              </div>
              <div>
                <span className="font-black text-white text-xl tracking-tight block font-heading">
                  NYP SINDH
                </span>
                <span className="text-[10px] gold-gradient-text font-black uppercase tracking-widest block -mt-1">
                  nypsindh.org.pk
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Official Membership & Legislative Portal for the National Youth Parliament Sindh. Empowering next-generation provincial leaders through structured parliamentary training and civic advocacy.
            </p>

            {/* Badges / Values */}
            <div className="pt-1 flex flex-wrap gap-2">
              <span className="inline-flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-[11px] text-emerald-300 font-medium">
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Verified Portal</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-[11px] text-amber-300 font-medium">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Sindh Province</span>
              </span>
            </div>

            <div className="text-[11px] gold-gradient-text font-black tracking-wider uppercase pt-1">
              Sindh • Our Identity • Our Pride
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-900/60 pb-3 font-heading flex items-center justify-between">
              <span>Quick Links</span>
              <span className="w-2 h-2 rounded-full bg-amber-400/60"></span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              {[
                { to: '/', label: 'Home Page' },
                hasApplied 
                  ? { to: '/member/dashboard', label: 'My Account Dashboard' }
                  : { to: '/signup', label: 'Membership Application Form' },
                { to: '/cabinets', label: 'Sindh Provincial Cabinet Roster' },
                { to: '/cabinets?div=div-karachi', label: 'Divisional Cabinets (6 Divisions)' },
                { to: '/announcements', label: 'Official Announcements' },
                { to: '/contact', label: 'Secretariat Contact' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={item.to} 
                    className="group inline-flex items-center space-x-2 text-slate-300 hover:text-emerald-300 transition-colors py-0.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Official Helpline Contacts */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-900/60 pb-3 font-heading flex items-center justify-between">
              <span>Secretariat & Helpline</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400/60"></span>
            </h3>
            
            <div className="space-y-3 text-xs">
              <a 
                href="tel:03319226110" 
                className="group flex items-start space-x-3 p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-900/40 hover:border-emerald-500/30 transition-all"
              >
                <div className="p-2 rounded-lg bg-emerald-900/60 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-bold block text-xs">Shakir Chandio</span>
                  <span className="text-amber-300/90 font-mono text-[11px]">NYP Sindh: 0331 9226110</span>
                </div>
              </a>

              <a 
                href="tel:+923337612564" 
                className="group flex items-start space-x-3 p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-900/40 hover:border-emerald-500/30 transition-all"
              >
                <div className="p-2 rounded-lg bg-emerald-900/60 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-bold block text-xs">President Office</span>
                  <span className="text-amber-300/90 font-mono text-[11px]">+92 333 7612564</span>
                </div>
              </a>

              <a 
                href="mailto:abdulrehman_h4@live.com" 
                className="group flex items-center space-x-3 p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-900/40 hover:border-emerald-500/30 transition-all"
              >
                <div className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-300 truncate text-[11px]">abdulrehman_h4@live.com</span>
              </a>

              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/30">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-[11px] leading-relaxed">
                  Provincial Secretariat, Karachi / Hyderabad, Sindh, Pakistan
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Administrative Portal Access */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-900/60 pb-3 font-heading flex items-center justify-between">
              <span>Admin Access</span>
              <Lock className="w-3.5 h-3.5 text-amber-400/80" />
            </h3>
            
            <div className="bg-gradient-to-b from-emerald-950/60 to-[#02140c] border border-emerald-500/25 rounded-2xl p-4 space-y-3.5 shadow-xl relative">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Staff Verification Portal</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Authorized verification officers, approval authorities, and divisional admins login here to manage applications.
              </p>

              <Link
                to="/admin/login"
                className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-900 to-emerald-950 hover:from-emerald-800 hover:to-emerald-900 text-slate-100 hover:text-amber-300 border border-amber-400/40 hover:border-amber-400 px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-md group"
              >
                <Lock className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Official / Staff Portal Login</span>
              </Link>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-emerald-900/50">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                  <span>Role-Based Access</span>
                </span>
                <span className="text-amber-400/80 font-mono">v2.4 Live</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & back to top bar */}
        <div className="mt-12 pt-6 border-t border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center md:text-left">
            <span>© 2026 National Youth Parliament (NYP) Sindh (<strong className="text-slate-300">nypsindh.org.pk</strong>).</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-slate-400">
              <span>Built for Sindh Youth Empowerment</span>
              <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500 inline ml-1 animate-pulse" />
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 hover:border-amber-400 text-slate-300 hover:text-amber-400 transition-all shadow-md group"
              title="Back to Top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

