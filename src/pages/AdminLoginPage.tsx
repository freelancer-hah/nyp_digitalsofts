import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { store, formatCnic } from '../services/store';
import { ShieldCheck, LogIn, AlertCircle, ArrowLeft, KeyRound, Building2, UserCheck, Layout, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [cnicNumber, setCnicNumber] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cnicNumber) {
      setError('Please enter administrative officer CNIC');
      return;
    }

    const res = store.loginUserByCnic(cnicNumber);
    if (res.success && res.user) {
      if (res.user.role === 'APPLICANT') {
        setError('This login portal is restricted for Administrative Officers. Please use the Member Login.');
      } else if (res.user.role === 'VERIFYING_OFFICER') {
        navigate('/admin/verification');
      } else if (res.user.role === 'APPROVAL_AUTHORITY') {
        navigate('/admin/approval');
      } else {
        navigate('/admin/master');
      }
    } else {
      setError(res.error || 'Invalid Admin Credentials');
    }
  };

  const handleQuickDemoLogin = (demoCnic: string) => {
    const res = store.loginUserByCnic(demoCnic);
    if (res.success && res.user) {
      if (res.user.role === 'VERIFYING_OFFICER') navigate('/admin/verification');
      else if (res.user.role === 'APPROVAL_AUTHORITY') navigate('/admin/approval');
      else navigate('/admin/master');
    }
  };

  const handleCnicChange = (val: string) => {
    setCnicNumber(formatCnic(val));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Top Right Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-lg backdrop-blur-md flex items-center space-x-2 text-xs font-extrabold cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Top Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-3.5 py-1 rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Restricted Access • Executive Officials & Super Admins</span>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-white border-2 border-emerald-500/30 p-1 flex items-center justify-center mx-auto shadow-xl overflow-hidden my-2">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-xl" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
            NYP SINDH EXECUTIVE ADMIN PORTAL
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
            Scrutiny Desk, Verification, Approval & Super Admin Executive Infrastructure.
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 p-3.5 rounded-2xl text-rose-800 dark:text-rose-200 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Officer CNIC Number <span className="text-red-500 font-bold ml-0.5">*</span></span>
              </label>
              <input
                type="text"
                required
                value={cnicNumber}
                onChange={(e) => handleCnicChange(e.target.value)}
                placeholder="41304-1111111-1"
                maxLength={15}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono text-sm font-bold focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>ACCESS ADMIN DASHBOARD</span>
            </button>
          </form>

          {/* Quick Shortcuts for Testing/Demonstration */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block text-center">
              Quick Admin Desk Access (Demo):
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickDemoLogin('41304-1111111-1')}
                className="bg-amber-50 hover:bg-amber-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-amber-800 dark:text-amber-300 p-2.5 rounded-xl border border-amber-200 dark:border-amber-500/20 text-[11px] font-bold text-left transition-colors truncate shadow-sm"
              >
                🔎 Verifier Desk
              </button>

              <button
                onClick={() => handleQuickDemoLogin('41304-2222222-2')}
                className="bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-300 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-bold text-left transition-colors truncate shadow-sm"
              >
                ✍️ President Desk
              </button>

              <button
                onClick={() => handleQuickDemoLogin('41304-0000000-0')}
                className="bg-purple-50 hover:bg-purple-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-purple-800 dark:text-purple-300 p-2.5 rounded-xl border border-purple-200 dark:border-purple-500/20 text-[11px] font-bold text-left transition-colors truncate shadow-sm"
              >
                👑 Super Admin
              </button>

              <button
                onClick={() => navigate('/admin/cms')}
                className="bg-teal-50 hover:bg-teal-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-teal-800 dark:text-teal-300 p-2.5 rounded-xl border border-teal-200 dark:border-teal-500/20 text-[11px] font-bold text-left transition-colors truncate flex items-center space-x-1 shadow-sm"
              >
                <Layout className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" />
                <span>CMS Manager</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-white transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Switch to Public Member Login</span>
            </Link>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          National Youth Parliament Sindh • Internal Administrative Infrastructure
        </div>

      </div>
    </div>
  );
};
