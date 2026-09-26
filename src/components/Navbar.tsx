import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserCheck, LogIn, LogOut, Menu, X, Sun, Moon, Search } from 'lucide-react';
import { store } from '../services/store';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = store.getCurrentUser();
  const profile = currentUser ? store.getProfileByUserId(currentUser.id) : undefined;
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    store.logoutUser();
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/announcements?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const displayName = profile?.fullName || currentUser?.fullName || 'Member';

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0b1320]/95 backdrop-blur-md text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-300 font-sans navbar-header">
      
      {/* Main Top Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Left Side: Brand Logo & Desktop Navigation Links grouped together */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3.5 group shrink-0 py-1">
              <div style={{ backgroundColor: '#ffffff' }} className="p-1 sm:p-1.5 rounded-md shadow-sm shrink-0 flex items-center justify-center">
                <img 
                  src="/nyp-logo.png" 
                  alt="National Youth Parliament Sindh Logo" 
                  className="h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              <div className="flex flex-col justify-center select-none">
                <div className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-[#052818] dark:text-emerald-400 leading-tight font-heading group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors uppercase">
                  NATIONAL YOUTH PARLIAMENT
                </div>
                <div className="text-[10px] sm:text-xs font-black text-[#c59b27] dark:text-amber-400 tracking-[0.32em] sm:tracking-[0.38em] uppercase font-heading text-center w-full mt-0.5">
                  — S I N D H —
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 lg:space-x-7 text-sm font-bold text-slate-700 dark:text-slate-200 font-heading ml-8 lg:ml-12 xl:ml-16">
              <Link 
                to="/" 
                className={`hover:text-[#059669] dark:hover:text-emerald-400 transition-colors py-1 ${isActive('/') ? 'text-[#059669] dark:text-emerald-400 border-b-2 border-[#059669] dark:border-emerald-400' : ''}`}
              >
                Home
              </Link>

              <Link 
                to="/about" 
                className={`hover:text-[#059669] dark:hover:text-emerald-400 transition-colors py-1 ${isActive('/about') ? 'text-[#059669] dark:text-emerald-400 border-b-2 border-[#059669] dark:border-emerald-400' : ''}`}
              >
                About
              </Link>

              <Link 
                to="/cabinets" 
                className={`hover:text-[#059669] dark:hover:text-emerald-400 transition-colors py-1 ${isActive('/cabinets') && !location.search.includes('parliamentarians') ? 'text-[#059669] dark:text-emerald-400 border-b-2 border-[#059669] dark:border-emerald-400' : ''}`}
              >
                Cabinets
              </Link>

              <Link 
                to="/cabinets?view=parliamentarians" 
                className={`hover:text-[#059669] dark:hover:text-emerald-400 transition-colors py-1 ${isActive('/cabinets') && location.search.includes('parliamentarians') ? 'text-[#059669] dark:text-emerald-400 border-b-2 border-[#059669] dark:border-emerald-400' : ''}`}
              >
                Youth Parliamentarians
              </Link>

              <Link 
                to="/contact" 
                className={`hover:text-[#059669] dark:hover:text-emerald-400 transition-colors py-1 ${isActive('/contact') ? 'text-[#059669] dark:text-emerald-400 border-b-2 border-[#059669] dark:border-emerald-400' : ''}`}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Action Buttons & CTA */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#059669] dark:hover:text-emerald-400 transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Search"
              aria-label="Search website"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={
                    currentUser.role === 'APPLICANT' || currentUser.role === 'MEMBER'
                      ? "/member/dashboard"
                      : currentUser.role === 'VERIFYING_OFFICER' || currentUser.role === 'VERIFICATION_DESK'
                      ? "/admin/verification"
                      : currentUser.role === 'APPROVAL_AUTHORITY' || currentUser.role === 'AUTHORISATION_DESK'
                      ? "/admin/approval"
                      : currentUser.role === 'WEB_COORDINATOR'
                      ? "/admin/cms"
                      : "/admin/master"
                  }
                  className="flex items-center space-x-2 bg-[#052818] text-amber-300 border border-amber-400/40 hover:bg-[#073822] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="max-w-[130px] truncate">{displayName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-[#052818] dark:bg-emerald-950 hover:bg-[#083a24] dark:hover:bg-emerald-900 text-white dark:text-emerald-300 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 border border-emerald-800 dark:border-emerald-700 flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Member Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200"
                >
                  Join NYP
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#059669] dark:hover:text-emerald-400"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#059669] dark:hover:text-emerald-400 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Search Bar Slide Out */}
      {searchOpen && (
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800 py-3 px-4 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search NYP Sindh news, cabinets, initiatives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-emerald-600"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#052818] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-900 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0b1320] border-b border-slate-200 dark:border-slate-800 px-5 pt-3 pb-6 space-y-3 text-left animate-fade-in font-sans">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 py-2 text-sm font-semibold hover:text-[#059669] dark:hover:text-emerald-400"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 py-2 text-sm font-semibold hover:text-[#059669] dark:hover:text-emerald-400"
          >
            About
          </Link>
          <Link
            to="/cabinets"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 py-2 text-sm font-semibold hover:text-[#059669] dark:hover:text-emerald-400"
          >
            Cabinets
          </Link>
          <Link
            to="/cabinets?view=parliamentarians"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 py-2 text-sm font-semibold hover:text-[#059669] dark:hover:text-emerald-400"
          >
            Youth Parliamentarians
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 py-2 text-sm font-semibold hover:text-[#059669] dark:hover:text-emerald-400"
          >
            Contact
          </Link>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2.5">
            {currentUser ? (
              <div className="space-y-2">
                <Link
                  to={
                    currentUser.role === 'APPLICANT' || currentUser.role === 'MEMBER'
                      ? "/member/dashboard"
                      : currentUser.role === 'VERIFYING_OFFICER'
                      ? "/admin/verification"
                      : currentUser.role === 'APPROVAL_AUTHORITY'
                      ? "/admin/approval"
                      : "/admin/master"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center bg-[#052818] text-amber-300 py-3 rounded-lg font-bold text-xs"
                >
                  Dashboard ({displayName})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center text-rose-600 py-2 text-xs font-bold"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-[#052818] dark:bg-emerald-950 text-white dark:text-emerald-300 py-3 rounded-lg font-bold text-xs tracking-wider border border-emerald-800 dark:border-emerald-700"
                >
                  Member Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-amber-500 text-slate-950 py-3 rounded-lg font-bold text-xs tracking-wider"
                >
                  Join NYP
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
