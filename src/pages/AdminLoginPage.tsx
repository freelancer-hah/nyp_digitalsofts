import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { store } from '../services/store';
import { ShieldCheck, LogIn, AlertCircle, ArrowLeft, KeyRound, Lock, Layout } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!usernameInput) {
      setError('Please enter administrative username or CNIC');
      return;
    }

    const res = store.loginUserByCnic(usernameInput, passwordInput);
    if (res.success && res.user) {
      if (res.user.role === 'MEMBER' || res.user.role === 'APPLICANT') {
        setError('This portal is restricted for Administrative Officers. Please use Public Member Login.');
      } else if (res.user.role === 'VERIFICATION_DESK' || res.user.role === 'VERIFYING_OFFICER') {
        navigate('/admin/verification');
      } else if (res.user.role === 'AUTHORISATION_DESK' || res.user.role === 'APPROVAL_AUTHORITY') {
        navigate('/admin/approval');
      } else {
        navigate('/admin/master');
      }
    } else {
      setError(res.error || 'Invalid Administrative Credentials');
    }
  };

  const handleQuickDemoLogin = (demoUsername: string, demoPass: string) => {
    setError('');
    setUsernameInput(demoUsername);
    setPasswordInput(demoPass);
    const res = store.loginUserByCnic(demoUsername, demoPass);
    if (res.success && res.user) {
      if (res.user.role === 'VERIFICATION_DESK' || res.user.role === 'VERIFYING_OFFICER') {
        navigate('/admin/verification');
      } else if (res.user.role === 'AUTHORISATION_DESK' || res.user.role === 'APPROVAL_AUTHORITY') {
        navigate('/admin/approval');
      } else {
        navigate('/admin/master');
      }
    } else {
      setError(res.error || 'Invalid Administrative Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 flex flex-col justify-center items-center px-4 py-4 sm:py-6 relative overflow-hidden font-sans transition-colors duration-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-3 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-800/60 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-3 py-0.5 rounded-full shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Restricted Access • Verification, Authorisation & President</span>
          </div>

          <div className="w-14 h-14 rounded-xl bg-white border-2 border-amber-400 p-0.5 flex items-center justify-center mx-auto shadow-xl overflow-hidden my-1">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-lg" />
          </div>

          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
            NYP SINDH EXECUTIVE ADMIN PORTAL
          </h1>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-tight">
            Verification Desk, Authorisation Desk & President Executive Controls.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-slate-200 text-slate-900 shadow-xl dark:bg-slate-900/90 dark:border-slate-800 dark:text-white rounded-2xl p-5 backdrop-blur-xl space-y-4">
          
          {error && (
            <div className="bg-rose-100 border border-rose-300 text-rose-800 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-200 p-2.5 rounded-xl text-xs flex items-start space-x-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Admin Username or CNIC *</span>
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. president, verifier, authoriser"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Password *</span>
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl px-3 py-2 text-xs font-medium focus:border-emerald-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full ui-btn-gold text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
            >
              <LogIn className="w-4 h-4 text-slate-950" />
              <span>ACCESS EXECUTIVE DESK</span>
            </button>
          </form>

          {/* Quick Shortcuts for Testing/Demonstration */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block text-center">
              Quick Admin Desk Demo Shortcuts:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin', 'admin123')}
                className="bg-emerald-950 text-emerald-200 border border-emerald-700 p-2 rounded-lg text-[9.5px] font-black text-center transition-all cursor-pointer shadow-sm hover:scale-105"
              >
                ⚡ SUPER ADMIN
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('president', 'president123')}
                className="bg-purple-950 text-purple-200 border border-purple-700 p-2 rounded-lg text-[9.5px] font-black text-center transition-all cursor-pointer shadow-sm hover:scale-105"
              >
                👑 PRESIDENT
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('verifier', 'verifier123')}
                className="bg-blue-950 text-blue-200 border border-blue-700 p-2 rounded-lg text-[9.5px] font-black text-center transition-all cursor-pointer shadow-sm hover:scale-105"
              >
                🔎 VERIFICATION
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('authoriser', 'authoriser123')}
                className="bg-amber-950 text-amber-200 border border-amber-700 p-2 rounded-lg text-[9.5px] font-black text-center transition-all cursor-pointer shadow-sm hover:scale-105"
              >
                ✍️ AUTHORISATION
              </button>
            </div>
          </div>

          <div className="text-center pt-1">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1 text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Switch to Public Member Login</span>
            </Link>
          </div>

        </div>

        <div className="text-center text-[10px] text-slate-500 font-medium">
          National Youth Parliament Sindh • Executive Portal
        </div>

      </div>
    </div>
  );
};
