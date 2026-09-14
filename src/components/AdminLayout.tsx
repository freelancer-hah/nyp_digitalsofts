import React from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { store } from '../services/store';
import { ShieldCheck, LogOut, Layout, CheckSquare, Layers, Globe, Building2 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = store.getCurrentUser();

  // Protect Admin Routes: If not logged in or role is APPLICANT, redirect to Admin Login
  if (!currentUser || currentUser.role === 'APPLICANT') {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    store.logoutUser();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">Super Admin</span>;
      case 'APPROVAL_AUTHORITY':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">President Desk</span>;
      case 'VERIFYING_OFFICER':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Scrutiny Desk</span>;
      case 'DIVISIONAL_ADMIN':
        return <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">Regional Admin</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">Officer</span>;
    }
  };

  return (
    <div className="dark min-h-screen bg-[#090e17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Executive Admin Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Admin Brand */}
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 bg-white p-0.5 shadow-lg shrink-0">
                <img src="/nyp-logo.jpg" alt="NYP Sindh Emblem" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-black tracking-tight text-white flex items-center space-x-2 font-heading">
                  <span>NYP SINDH</span>
                  <span className="text-[10px] uppercase bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full font-bold">
                    ADMIN PORTAL
                  </span>
                </div>
                <div className="text-[10px] font-medium text-slate-400">
                  {currentUser.role === 'SUPER_ADMIN' && 'Super Admin Master Control'}
                  {currentUser.role === 'VERIFYING_OFFICER' && 'Verification & Scrutiny Portal'}
                  {currentUser.role === 'APPROVAL_AUTHORITY' && 'President Approval Desk'}
                  {currentUser.role === 'DIVISIONAL_ADMIN' && 'Divisional & Regional Portal'}
                </div>
              </div>
            </div>

            {/* Middle: Role-Specific Navigation Links ONLY */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
              
              {/* VERIFYING_OFFICER ONLY LINKS */}
              {currentUser.role === 'VERIFYING_OFFICER' && (
                <Link
                  to="/admin/verification"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isActive('/admin/verification')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-amber-400" />
                  <span>Verification & Scrutiny Desk</span>
                </Link>
              )}

              {/* APPROVAL_AUTHORITY ONLY LINKS */}
              {currentUser.role === 'APPROVAL_AUTHORITY' && (
                <Link
                  to="/admin/approval"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isActive('/admin/approval')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>President Approval Desk</span>
                </Link>
              )}

              {/* DIVISIONAL_ADMIN ONLY LINKS */}
              {currentUser.role === 'DIVISIONAL_ADMIN' && (
                <Link
                  to="/admin/regional"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isActive('/admin/regional') || isActive('/admin/master')
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Regional Admin Desk</span>
                </Link>
              )}

              {/* SUPER_ADMIN ONLY LINKS */}
              {currentUser.role === 'SUPER_ADMIN' && (
                <>
                  <Link
                    to="/admin/master"
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/master') || isActive('/admin/regional')
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Master Control Desk</span>
                  </Link>

                  <Link
                    to="/admin/cms"
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/cms')
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Layout className="w-3.5 h-3.5 text-teal-400" />
                    <span>CMS Content Manager</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Right: User Profile & Actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-200 flex items-center space-x-1">
                  <span>{currentUser.fullName}</span>
                </span>
                <div>{getRoleBadge(currentUser.role)}</div>
              </div>

              <Link
                to="/"
                title="View Main Public Website"
                className="p-2 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all flex items-center space-x-1 text-xs font-semibold"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Main Website</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950 hover:bg-rose-950/40 rounded-xl border border-slate-800 hover:border-rose-900 transition-all flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                title="Sign Out of Admin Portal"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>

          {/* Mobile Role-Specific Nav Strip */}
          <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-800/80 text-[11px] font-bold">
            {currentUser.role === 'VERIFYING_OFFICER' && (
              <span className="text-amber-400 font-extrabold flex items-center space-x-1">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Verification Desk</span>
              </span>
            )}
            {currentUser.role === 'APPROVAL_AUTHORITY' && (
              <span className="text-emerald-400 font-extrabold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Approval Desk</span>
              </span>
            )}
            {currentUser.role === 'DIVISIONAL_ADMIN' && (
              <span className="text-blue-400 font-extrabold flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Regional Desk</span>
              </span>
            )}
            {currentUser.role === 'SUPER_ADMIN' && (
              <>
                <Link
                  to="/admin/master"
                  className={`px-2 py-1 rounded-lg ${isActive('/admin/master') ? 'text-purple-400 font-extrabold' : 'text-slate-400'}`}
                >
                  Master Desk
                </Link>
                <Link
                  to="/admin/cms"
                  className={`px-2 py-1 rounded-lg ${isActive('/admin/cms') ? 'text-teal-400 font-extrabold' : 'text-slate-400'}`}
                >
                  CMS Manager
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 bg-[#090e17]">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-slate-900 bg-[#090e17] py-4 px-4 text-center text-xs text-slate-500">
        NYP Sindh Executive Portal • Logged in as <span className="text-slate-300 font-bold">{currentUser.fullName}</span> ({currentUser.role})
      </footer>

    </div>
  );
};
