import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { store, formatCnic } from '../services/store';
import { LogIn, AlertCircle, Shield } from 'lucide-react';

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
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cnicNumber) {
      setError('Please enter your 13-digit CNIC number');
      return;
    }

    const res = store.loginUserByCnic(cnicNumber);
    if (res.success && res.user) {
      if (res.user.role === 'APPLICANT') {
        navigate('/member/dashboard');
      } else {
        // If an administrative user logs in here, seamlessly direct to their admin desk or notify them
        if (res.user.role === 'VERIFYING_OFFICER') navigate('/admin/verification');
        else if (res.user.role === 'APPROVAL_AUTHORITY') navigate('/admin/approval');
        else navigate('/admin/master');
      }
    } else {
      setError(res.error || 'Login failed');
    }
  };

  const handleQuickDemoLogin = (demoCnic: string) => {
    const res = store.loginUserByCnic(demoCnic);
    if (res.success && res.user) {
      navigate('/member/dashboard');
    }
  };

  const handleCnicChange = (val: string) => {
    setCnicNumber(formatCnic(val));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-left space-y-6">
      
      <div className="ui-card p-8 space-y-6 shadow-sm border-slate-200 bg-white rounded-3xl">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-600/30 p-1 flex items-center justify-center mx-auto shadow-md overflow-hidden">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Member Portal Sign In</h1>
          <p className="text-xs text-slate-500">Enter your 13-digit CNIC number to access your Youth Member dashboard.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">CNIC Number (Username) <span className="text-red-500 font-bold ml-0.5">*</span></label>
            <input
              type="text"
              required
              value={cnicNumber}
              onChange={(e) => handleCnicChange(e.target.value)}
              placeholder="41304-1234567-1"
              maxLength={15}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-mono text-sm font-bold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full ui-btn-primary font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span>LOG IN TO MEMBER DASHBOARD</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block text-center">
            Demo Access Shortcut:
          </span>

          <div>
            <button
              onClick={() => handleQuickDemoLogin('41304-1234567-1')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl border border-slate-200 text-xs font-bold text-center transition-all flex items-center justify-center space-x-2"
            >
              <span>👤 Click for Sample Member Account</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 space-y-3">
          <div>
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-700 font-bold hover:underline">
              Register Here
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/admin/login"
              className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500 hover:text-emerald-800 transition-colors"
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
