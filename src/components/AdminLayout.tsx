import React from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { store } from '../services/store';
import { ShieldCheck, LogOut, Layout, CheckSquare, Layers, Globe, Building2, Sun, Moon, Menu, X, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = store.getCurrentUser();
  const { theme, toggleTheme } = useTheme();

  // Protect Admin Routes
  if (!currentUser || currentUser.role === 'APPLICANT' || currentUser.role === 'MEMBER') {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    store.logoutUser();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'PRESIDENT':
      case 'SUPER_ADMIN':
        return <span className="bg-purple-950 text-purple-200 border border-purple-800/90 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">PRESIDENT</span>;
      case 'WEB_COORDINATOR':
        return <span className="bg-teal-950 text-teal-200 border border-teal-800/90 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Web Coordinator</span>;
      case 'AUTHORISATION_DESK':
      case 'APPROVAL_AUTHORITY':
        return <span className="bg-emerald-950 text-emerald-200 border border-emerald-800/90 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Authorisation Desk</span>;
      case 'VERIFICATION_DESK':
      case 'VERIFYING_OFFICER':
        return <span className="bg-amber-950 text-amber-200 border border-amber-800/90 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Verification Desk</span>;
      case 'DIVISIONAL_ADMIN':
        return <span className="bg-blue-950 text-blue-200 border border-blue-800/90 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Regional Admin</span>;
      default:
        return <span className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Officer</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      
      {/* Executive Admin Navigation Header */}
      <header className="admin-header sticky top-0 z-50 bg-white/95 border-b border-slate-200 shadow-sm text-slate-900 dark:bg-[#0b1320] dark:border-emerald-500/20 dark:shadow-2xl dark:text-white backdrop-blur-md transition-colors duration-300">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-20 sm:h-22 gap-4">
            
            {/* Left: Admin Brand with Prominent Logo */}
            <Link to="/admin/master" className="flex items-center space-x-3 sm:space-x-3.5 group shrink-0 py-1">
              <img 
                src="/nyp-logo.png" 
                alt="NYP Sindh Emblem" 
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="text-left flex flex-col justify-center">
                <div className="flex items-center space-x-2">
                  <span className="admin-brand-title text-base sm:lg font-black tracking-tight text-slate-900 dark:text-white font-heading">
                    NYP SINDH
                  </span>
                  <span className="text-[10px] uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-600/60 px-2.5 py-0.5 rounded-full font-extrabold shadow-2xs tracking-wider">
                    EXECUTIVE DESK
                  </span>
                </div>
                <div className="admin-brand-sub text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase font-heading tracking-wide mt-0.5">
                  {(currentUser.role === 'PRESIDENT' || currentUser.role === 'SUPER_ADMIN') && 'PRESIDENT EXECUTIVE PORTAL'}
                  {currentUser.role === 'WEB_COORDINATOR' && 'Web Coordinator Portal (CMS, Content & Members)'}
                  {(currentUser.role === 'VERIFICATION_DESK' || currentUser.role === 'VERIFYING_OFFICER') && 'Verification Desk Portal'}
                  {(currentUser.role === 'AUTHORISATION_DESK' || currentUser.role === 'APPROVAL_AUTHORITY') && 'Authorisation Desk Portal'}
                  {currentUser.role === 'DIVISIONAL_ADMIN' && 'Divisional Admin Desk'}
                </div>
              </div>
            </Link>

            {/* Middle: Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1.5 bg-slate-100/90 border border-slate-200/90 dark:bg-[#030914] dark:border-slate-800/90 p-1.5 rounded-2xl shadow-2xs">
              
              {/* VERIFICATION DESK LINKS */}
              {(currentUser.role === 'VERIFICATION_DESK' || currentUser.role === 'VERIFYING_OFFICER') && (
                <>
                  <Link
                    to="/admin/verification"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/verification')
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/25 dark:text-amber-200 dark:border-amber-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Verification Desk</span>
                  </Link>
                  <Link
                    to="/admin/members"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/members')
                        ? 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-500/25 dark:text-teal-200 dark:border-teal-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Members Directory</span>
                  </Link>
                </>
              )}

              {/* AUTHORISATION DESK LINKS */}
              {(currentUser.role === 'AUTHORISATION_DESK' || currentUser.role === 'APPROVAL_AUTHORITY') && (
                <>
                  <Link
                    to="/admin/approval"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/approval')
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/25 dark:text-emerald-200 dark:border-emerald-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Authorisation Desk</span>
                  </Link>

                  <Link
                    to="/admin/members"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/members')
                        ? 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-500/25 dark:text-teal-200 dark:border-teal-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Members Directory</span>
                  </Link>

                  <Link
                    to="/admin/cms"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/cms')
                        ? 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-500/25 dark:text-teal-200 dark:border-teal-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Layout className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>CMS Content Manager</span>
                  </Link>
                </>
              )}

              {/* WEB COORDINATOR LINKS */}
              {currentUser.role === 'WEB_COORDINATOR' && (
                <>
                  <Link
                    to="/admin/members"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/members')
                        ? 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-500/25 dark:text-teal-200 dark:border-teal-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Members Directory</span>
                  </Link>

                  <Link
                    to="/admin/cms"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/cms')
                        ? 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-500/25 dark:text-teal-200 dark:border-teal-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Layout className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>CMS Content Manager</span>
                  </Link>

                  <Link
                    to="/cabinets"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/cabinets')
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/25 dark:text-emerald-200 dark:border-emerald-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Cabinets & Parliament</span>
                  </Link>
                </>
              )}

              {/* PRESIDENT (FULL CONTROLS) LINKS */}
              {(currentUser.role === 'PRESIDENT' || currentUser.role === 'SUPER_ADMIN') && (
                <>
                  <Link
                    to="/admin/master"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/master') || isActive('/admin/regional')
                        ? 'bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-500/25 dark:text-purple-200 dark:border-purple-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>President Portal</span>
                  </Link>

                  <Link
                    to="/admin/members"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/members')
                        ? 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-500/25 dark:text-teal-200 dark:border-teal-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Members Directory</span>
                  </Link>

                  <Link
                    to="/admin/cms"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/cms')
                        ? 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-500/25 dark:text-teal-200 dark:border-teal-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Layout className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>CMS Manager</span>
                  </Link>

                  <Link
                    to="/admin/verification"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/verification')
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/25 dark:text-amber-200 dark:border-amber-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Verification</span>
                  </Link>

                  <Link
                    to="/admin/approval"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive('/admin/approval')
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/25 dark:text-emerald-200 dark:border-emerald-500/50 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Authorisation</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Right: Actions (Theme Toggle, Main Website, Logout) */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 hover:border-emerald-500 dark:bg-slate-900 dark:border-slate-700 dark:text-amber-400 transition-all shadow-2xs flex items-center justify-center cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-emerald-600" />}
              </button>

              <Link
                to="/"
                title="View Main Public Website"
                className="admin-btn-action px-3.5 py-2 text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 dark:text-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex items-center space-x-1.5 text-xs font-bold shadow-2xs shrink-0"
              >
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="inline">Main Website</span>
              </Link>

              <button
                onClick={handleLogout}
                className="admin-btn-logout px-3.5 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 dark:text-rose-300 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:border-rose-900/60 hover:border-rose-700 transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer shadow-2xs shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span className="inline">Logout</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 hover:text-emerald-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 transition-all shadow-2xs"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile / Tablet Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white dark:bg-[#0b1320] border-t border-slate-200 dark:border-slate-800/80 px-4 py-4 space-y-2 animate-fade-in shadow-lg">
            {(currentUser.role === 'PRESIDENT' || currentUser.role === 'SUPER_ADMIN') && (
              <>
                <Link
                  to="/admin/master"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/master') || isActive('/admin/regional')
                      ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>President Portal</span>
                </Link>
                <Link
                  to="/admin/members"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/members')
                      ? 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Members Directory</span>
                </Link>
                <Link
                  to="/admin/cms"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/cms')
                      ? 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layout className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>CMS Manager</span>
                </Link>
                <Link
                  to="/admin/verification"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/verification')
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Verification</span>
                </Link>
                <Link
                  to="/admin/approval"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/approval')
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Authorisation</span>
                </Link>
              </>
            )}

            {(currentUser.role === 'VERIFICATION_DESK' || currentUser.role === 'VERIFYING_OFFICER') && (
              <>
                <Link
                  to="/admin/verification"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/verification')
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Verification Desk</span>
                </Link>
                <Link
                  to="/admin/members"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/members')
                      ? 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Members Directory</span>
                </Link>
              </>
            )}

            {(currentUser.role === 'AUTHORISATION_DESK' || currentUser.role === 'APPROVAL_AUTHORITY') && (
              <>
                <Link
                  to="/admin/approval"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/approval')
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Authorisation Desk</span>
                </Link>
                <Link
                  to="/admin/members"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/members')
                      ? 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Members Directory</span>
                </Link>
                <Link
                  to="/admin/cms"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/cms')
                      ? 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layout className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>CMS Content Manager</span>
                </Link>
              </>
            )}

            {currentUser.role === 'WEB_COORDINATOR' && (
              <>
                <Link
                  to="/admin/members"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/members')
                      ? 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Members Directory</span>
                </Link>
                <Link
                  to="/admin/cms"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/admin/cms')
                      ? 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layout className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>CMS Content Manager</span>
                </Link>
                <Link
                  to="/cabinets"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive('/cabinets')
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Cabinets & Parliament</span>
                </Link>
              </>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold">{currentUser.fullName}</span>
              <div>{getRoleBadge(currentUser.role)}</div>
            </div>
          </div>
        )}
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 transition-colors duration-300">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-900 dark:bg-[#090e17] dark:text-slate-500 py-4 px-4 text-center text-xs transition-colors duration-300">
        National Youth Parliament Sindh • Logged in as <span className="text-slate-900 dark:text-slate-300 font-bold">{currentUser.fullName}</span> ({currentUser.role})
      </footer>

    </div>
  );
};
