import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { store } from '../services/store';
import { ShieldCheck, LogIn, AlertCircle, ArrowLeft, KeyRound, Lock, Crown, Search, CheckSquare } from 'lucide-react';

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
      } else if (res.user.role === 'WEB_COORDINATOR') {
        navigate('/admin/cms');
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
      } else if (res.user.role === 'WEB_COORDINATOR') {
        navigate('/admin/cms');
      } else {
        navigate('/admin/master');
      }
    } else {
      setError(res.error || 'Invalid Administrative Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Smooth Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-5 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/70 dark:border-emerald-800/60 dark:text-emerald-300 text-[10px] uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>EXECUTIVE ADMIN ACCESS PORTAL</span>
          </div>

          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mx-auto overflow-hidden my-1">
            <img src="/nyp-logo.png" alt="NYP Sindh Logo" className="w-full h-full object-contain drop-shadow-lg" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
            NYP Sindh Executive Portal
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            President Executive Controls, Web Coordinator, Verification & Authorisation.
          </p>
        </div>

        {/* Smooth Card Form */}
        <div className="bg-white border border-slate-200 text-slate-900 shadow-xl dark:bg-slate-900/90 dark:border-slate-800 dark:text-white rounded-3xl p-6 sm:p-7 backdrop-blur-xl space-y-5">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-200 p-3 rounded-xl text-xs flex items-start space-x-2.5 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Admin Username or CNIC *</span>
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. president, coordinator, verifier, authoriser"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl px-3.5 py-2.5 text-xs font-bold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Password *</span>
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white rounded-xl px-3.5 py-2.5 text-xs font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#052818] hover:bg-[#073822] text-amber-300 font-black text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider hover:scale-[1.01]"
            >
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>ACCESS EXECUTIVE DESK</span>
            </button>
          </form>

          {/* Smooth Quick Admin Desk Demo Shortcuts */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-extrabold tracking-wider block text-center">
              Quick Admin Desk Demo Shortcuts:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('president', 'president123')}
                className="bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800/70 p-2.5 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer shadow-xs hover:bg-purple-100 dark:hover:bg-purple-900/80 hover:scale-105 flex items-center justify-center space-x-1"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>President</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('coordinator', 'coordinator123')}
                className="bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-800/70 p-2.5 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer shadow-xs hover:bg-teal-100 dark:hover:bg-teal-900/80 hover:scale-105 flex items-center justify-center space-x-1"
              >
                <span>Web Coordinator</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('verifier', 'verifier123')}
                className="bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800/70 p-2.5 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer shadow-xs hover:bg-blue-100 dark:hover:bg-blue-900/80 hover:scale-105 flex items-center justify-center space-x-1"
              >
                <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Verifier</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('authoriser', 'authoriser123')}
                className="bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/70 p-2.5 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer shadow-xs hover:bg-amber-100 dark:hover:bg-amber-900/80 hover:scale-105 flex items-center justify-center space-x-1"
              >
                <CheckSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Authoriser</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-1">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Switch to Public Member Login</span>
            </Link>
          </div>

        </div>

        <div className="text-center text-[11px] text-slate-500 font-medium">
          National Youth Parliament Sindh • Executive Portal
        </div>

      </div>
    </div>
  );
};
