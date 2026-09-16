import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { store, formatCnic } from '../services/store';
import { LogIn, AlertCircle, Shield, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'SUPER_ADMIN' || roleParam === 'ADMIN' || roleParam === 'VERIFYING_OFFICER' || roleParam === 'APPROVAL_AUTHORITY' || searchParams.get('admin') === 'true') {
      navigate('/admin/login', { replace: true });
    }
  }, [searchParams, navigate]);

  const [cnicNumber, setCnicNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cnicNumber) {
      setError('Please enter your 13-digit CNIC number');
      return;
    }

    const res = store.loginUserByCnic(cnicNumber, password);
    if (res.success && res.user) {
      if (res.user.role === 'APPLICANT' || res.user.role === 'MEMBER') {
        navigate('/member/dashboard');
      } else {
        if (res.user.role === 'VERIFICATION_DESK' || res.user.role === 'VERIFYING_OFFICER') navigate('/admin/verification');
        else if (res.user.role === 'AUTHORISATION_DESK' || res.user.role === 'APPROVAL_AUTHORITY') navigate('/admin/approval');
        else navigate('/admin/master');
      }
    } else {
      setError(res.error || 'Login failed');
    }
  };

  const handleQuickDemoLogin = (demoCnic: string) => {
    const res = store.loginUserByCnic(demoCnic, 'pass123');
    if (res.success && res.user) {
      navigate('/member/dashboard');
    }
  };

  const handleCnicChange = (val: string) => {
    setCnicNumber(formatCnic(val));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-left space-y-6">
      
      <div className="ui-card p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-amber-400 p-1 flex items-center justify-center mx-auto shadow-md overflow-hidden">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-heading">Member Sign In</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enter your CNIC (Username) and Password to secure your identity and access your dashboard.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-800 text-xs flex items-center space-x-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              CNIC Number (Username) *
            </label>
            <input
              type="text"
              required
              value={cnicNumber}
              onChange={(e) => handleCnicChange(e.target.value)}
              placeholder="33105-7853093-7"
              maxLength={15}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono text-sm font-bold focus:border-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white text-sm font-medium focus:border-emerald-600 outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full ui-btn-gold text-slate-950 font-black text-xs py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
          >
            <LogIn className="w-4 h-4 text-slate-950" />
            <span>LOG IN TO MEMBER DASHBOARD</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block text-center">
            Demo Access Shortcut:
          </span>

          <div>
            <button
              onClick={() => handleQuickDemoLogin('33105-7853093-7')}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-center transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>👤 Click for Demo Member Account</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 space-y-3">
          <div>
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
              Register Here
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/admin/login"
              className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Administrative Official? Login to Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};
