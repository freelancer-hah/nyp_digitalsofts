import React from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { store } from '../services/store';
import { ShieldCheck, LogOut, Layout, CheckSquare, Layers, Globe, Building2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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
        return <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">PRESIDENT</span>;
      case 'AUTHORISATION_DESK':
      case 'APPROVAL_AUTHORITY':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Authorisation Desk</span>;
      case 'VERIFICATION_DESK':
      case 'VERIFYING_OFFICER':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Verification Desk</span>;
      case 'DIVISIONAL_ADMIN':
        return <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">Regional Admin</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">Officer</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      
      {/* Executive Admin Navigation Header */}
      <header className="admin-header sticky top-0 z-50 bg-white/90 border-b border-slate-200 shadow-md text-slate-900 dark:bg-[#0b1320] dark:border-emerald-500/20 dark:shadow-2xl dark:text-white backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Admin Brand */}
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400 bg-white p-0.5 shadow-lg shrink-0">
                <img src="/nyp-logo.jpg" alt="NYP Sindh Emblem" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2 font-heading">
                  <span className="admin-brand-title text-slate-900 dark:text-white">NYP SINDH</span>
                  <span className="text-[10px] uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-600/60 px-2 py-0.5 rounded-full font-extrabold shadow-sm">
                    EXECUTIVE DESK
                  </span>
                </div>
                <div className="admin-brand-sub text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  {(currentUser.role === 'PRESIDENT' || currentUser.role === 'SUPER_ADMIN') && 'PRESIDENT EXECUTIVE PORTAL'}
                  {(currentUser.role === 'VERIFICATION_DESK' || currentUser.role === 'VERIFYING_OFFICER') && 'Verification Desk Portal'}
                  {(currentUser.role === 'AUTHORISATION_DESK' || currentUser.role === 'APPROVAL_AUTHORITY') && 'Authorisation Desk Portal'}
                  {currentUser.role === 'DIVISIONAL_ADMIN' && 'Divisional Admin Desk'}
                </div>
              </div>
            </div>

            {/* Middle: Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-100 border border-slate-200 dark:bg-[#030914] dark:border-slate-800 p-1.5 rounded-2xl">
              
              {/* VERIFICATION DESK LINKS */}
              {(currentUser.role === 'VERIFICATION_DESK' || currentUser.role === 'VERIFYING_OFFICER') && (
                <Link
                  to="/admin/verification"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isActive('/admin/verification')
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/50 shadow-md'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Verification Desk</span>
                </Link>
              )}

              {/* AUTHORISATION DESK LINKS (HAS CMS PRIVILEGES) */}
              {(currentUser.role === 'AUTHORISATION_DESK' || currentUser.role === 'APPROVAL_AUTHORITY') && (
                <>
                  <Link
                    to="/admin/approval"
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/approval')
                        ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/50 shadow-md'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Authorisation Desk</span>
                  </Link>

                  <Link
                    to="/admin/cms"
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/cms')
                        ? 'bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/50 shadow-md'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Layout className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>CMS Content Manager</span>
                  </Link>
                </>
              )}

              {/* PRESIDENT (SUPER_ADMIN) LINKS */}
              {(currentUser.role === 'PRESIDENT' || currentUser.role === 'SUPER_ADMIN') && (
                <>
                  <Link
                    to="/admin/master"
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/master') || isActive('/admin/regional')
                        ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-500/50 shadow-md'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>PRESIDENT Executive Portal</span>
                  </Link>

                  <Link
                    to="/admin/cms"
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/cms')
                        ? 'bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/50 shadow-md'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Layout className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>CMS Content Manager</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Right: User Profile & Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 hover:border-emerald-500 dark:bg-slate-900 dark:border-slate-700 dark:text-amber-400 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-emerald-600" />}
              </button>

              <div className="hidden sm:flex flex-col items-end">
                <span className="admin-user-name text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-1">
                  <span>{currentUser.fullName}</span>
                </span>
                <div>{getRoleBadge(currentUser.role)}</div>
              </div>

              <Link
                to="/"
                title="View Main Public Website"
                className="admin-btn-action px-3 py-2 text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 dark:text-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex items-center space-x-1.5 text-xs font-bold shadow-sm"
              >
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Main Website</span>
              </Link>

              <button
                onClick={handleLogout}
                className="admin-btn-logout px-3 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 dark:text-rose-300 dark:bg-slate-950 dark:hover:bg-rose-950/60 dark:border-slate-800 hover:border-rose-700 transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer shadow-sm"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>
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
