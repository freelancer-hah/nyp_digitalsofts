import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserCheck, LogIn, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { store } from '../services/store';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = store.getCurrentUser();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    store.logoutUser();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-nav text-slate-900 dark:text-slate-100 shadow-xl transition-all duration-300">

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title with Balanced Proportions */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0 py-2">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden border-2 border-amber-400/90 bg-white p-0.5 shadow-md group-hover:scale-105 transition-all duration-300 shrink-0 flex items-center justify-center">
              <img src="/nyp-logo.jpg" alt="NYP Sindh Emblem" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="text-left flex flex-col justify-center">
              <div className="text-xs sm:text-base font-black tracking-tight text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-amber-400 transition-colors uppercase font-heading">
                NATIONAL YOUTH PARLIAMENT
              </div>
              <div className="text-[10px] sm:text-xs font-black text-amber-600 dark:text-amber-400 tracking-[0.35em] uppercase font-heading">
                S I N D H
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links: HOME -> Cabinets -> Youth Parliamentarians -> Announcements -> Contact Us */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-100/90 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 p-1.5 rounded-2xl backdrop-blur-md">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/30' 
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              HOME
            </Link>
            <Link 
              to="/cabinets" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/cabinets') && !location.search.includes('parliamentarians')
                  ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/30' 
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              Cabinets
            </Link>
            <Link 
              to="/cabinets?view=parliamentarians" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/cabinets') && location.search.includes('parliamentarians')
                  ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/30' 
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              Youth Parliamentarians
            </Link>
            <Link 
              to="/announcements" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/announcements') 
                  ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/30' 
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              Announcements
            </Link>
            <Link 
              to="/contact" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/contact') 
                  ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/30' 
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Action Buttons & Auth State */}
          <div className="hidden md:flex items-center space-x-3.5">
            
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:border-emerald-500 dark:bg-slate-900/90 dark:border-slate-700 dark:text-amber-400 transition-all shadow-md flex items-center justify-center cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-emerald-600" />}
            </button>

            {currentUser && currentUser.role === 'APPLICANT' ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/member/dashboard"
                  className="flex items-center space-x-2 bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60 dark:hover:bg-emerald-900 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 shadow-md"
                >
                  <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Dashboard ({currentUser.fullName.split(' ')[0]})</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="ui-btn-primary text-xs font-black px-6 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>Member Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 dark:bg-slate-800 dark:text-amber-400 dark:border-slate-700"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-emerald-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 pt-3 pb-6 space-y-3 text-left animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 py-2 text-sm font-semibold hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            Home
          </Link>
          <Link
            to="/cabinets"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 py-2 text-sm font-semibold hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            Cabinet & MPAs
          </Link>
          <Link
            to="/announcements"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 py-2 text-sm font-semibold hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            News Bulletins
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 py-2 text-sm font-semibold hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            Contact Us
          </Link>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2.5">
            {currentUser && currentUser.role === 'APPLICANT' ? (
              <div className="space-y-2">
                <Link
                  to="/member/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 py-3 rounded-xl font-bold text-xs"
                >
                  My Member Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center text-rose-600 dark:text-rose-400 py-2 text-xs font-bold"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center ui-btn-primary text-white py-3 rounded-xl font-bold text-xs tracking-wider"
              >
                Member Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
