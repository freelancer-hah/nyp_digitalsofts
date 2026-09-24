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

  const handleCnicChange = (val: string) => {
    if (/[a-zA-Z]/.test(val)) {
      setCnicNumber(val.trim());
    } else {
      setCnicNumber(formatCnic(val));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 text-left">
      <div className="ui-card p-6 sm:p-8 space-y-5 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto overflow-hidden">
            <img src="/nyp-logo.png" alt="NYP Sindh Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">Sign In Portal</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enter your CNIC or Username and Password to access your portal.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-rose-800 text-xs flex items-center space-x-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              CNIC Number or Username *
            </label>
            <input
              type="text"
              required
              value={cnicNumber}
              onChange={(e) => handleCnicChange(e.target.value)}
              placeholder="e.g. 41101-1234567-1 or admin"
              maxLength={30}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-xs font-bold focus:border-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-600 outline-none"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#052818] hover:bg-[#073822] text-amber-300 font-black text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider mt-1 hover:scale-[1.01]"
          >
            <LogIn className="w-4 h-4 text-amber-300" />
            <span>LOG IN TO MEMBER DASHBOARD</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs space-y-2">
          <div>
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
              Register Here
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
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
