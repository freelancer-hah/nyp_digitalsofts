import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { store, formatCnic } from '../services/store';
import { ShieldCheck, LogIn, AlertCircle, ArrowLeft, KeyRound, Building2, UserCheck, Layout } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#090e17] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Top Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-3.5 py-1 rounded-full shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Restricted Access • Executive Officials & Super Admins</span>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-white border-2 border-emerald-500/30 p-1 flex items-center justify-center mx-auto shadow-2xl overflow-hidden my-2">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-xl" />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight font-heading">
            NYP SINDH EXECUTIVE ADMIN PORTAL
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Scrutiny Desk, Verification, Approval & Super Admin Executive Infrastructure.
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {error && (
            <div className="bg-rose-950/80 border border-rose-800 p-3.5 rounded-2xl text-rose-200 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Officer CNIC Number <span className="text-red-500 font-bold ml-0.5">*</span></span>
              </label>
              <input
                type="text"
                required
                value={cnicNumber}
                onChange={(e) => handleCnicChange(e.target.value)}
                placeholder="41304-1111111-1"
                maxLength={15}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-sm font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>ACCESS ADMIN DASHBOARD</span>
            </button>
          </form>

          {/* Quick Shortcuts for Testing/Demonstration */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block text-center">
              Quick Admin Desk Access (Demo):
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickDemoLogin('41304-1111111-1')}
                className="bg-slate-800/80 hover:bg-slate-800 text-amber-300 p-2.5 rounded-xl border border-amber-500/20 text-[11px] font-bold text-left transition-colors truncate cursor-pointer"
              >
                🔎 Verifier Desk
              </button>

              <button
                onClick={() => handleQuickDemoLogin('41304-2222222-2')}
                className="bg-slate-800/80 hover:bg-slate-800 text-emerald-300 p-2.5 rounded-xl border border-emerald-500/20 text-[11px] font-bold text-left transition-colors truncate cursor-pointer"
              >
                ✍️ President Desk
              </button>

              <button
                onClick={() => handleQuickDemoLogin('41304-0000000-0')}
                className="bg-slate-800/80 hover:bg-slate-800 text-purple-300 p-2.5 rounded-xl border border-purple-500/20 text-[11px] font-bold text-left transition-colors truncate cursor-pointer"
              >
                👑 Super Admin
              </button>

              <button
                onClick={() => navigate('/admin/cms')}
                className="bg-slate-800/80 hover:bg-slate-800 text-teal-300 p-2.5 rounded-xl border border-teal-500/20 text-[11px] font-bold text-left transition-colors truncate flex items-center space-x-1 cursor-pointer"
              >
                <Layout className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>CMS Manager</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Switch to Public Member Login</span>
            </Link>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 font-medium">
          National Youth Parliament Sindh • Internal Administrative Infrastructure
        </div>

      </div>
    </div>
  );
};
