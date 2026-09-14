import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserCheck, LogIn, LogOut, Menu, X, Megaphone, Sparkles, Shield, Sun, Moon } from 'lucide-react';
import { store } from '../services/store';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = store.getCurrentUser();
  const announcements = store.getAnnouncements();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    store.logoutUser();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-nav text-slate-100 shadow-xl transition-all duration-300">
      
      {/* Dynamic Animated News Ticker Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-100 text-[11px] py-1.5 px-4 overflow-hidden border-b border-emerald-800/60 font-medium relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-2 shrink-0 z-10 bg-emerald-950 pr-3 font-bold text-amber-300 uppercase tracking-wider text-[10px]">
            <Megaphone className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>LATEST BULLETIN:</span>
          </div>

          {/* Marquee Text Container */}
          <div className="flex-1 overflow-hidden relative mx-2">
            <div className="animate-marquee whitespace-nowrap space-x-12">
              {announcements.map((ann, i) => (
                <span key={i} className="inline-flex items-center space-x-2 text-emerald-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <strong className="text-white font-bold">{ann.title}:</strong>
                  <span className="text-emerald-200">{ann.content.substring(0, 90)}...</span>
                </span>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4 shrink-0 z-10 bg-emerald-950 pl-3 text-[10px]">
            <span className="text-emerald-300 font-semibold">Helpline: 0331 9226110</span>
            <span className="text-amber-300 font-bold uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>NYP SINDH 2026</span>
            </span>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo with Smooth Hover */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400/80 bg-white p-0.5 shadow-lg group-hover:scale-105 group-hover:shadow-emerald-500/20 transition-all duration-300 shrink-0">
              <img src="/nyp-logo.jpg" alt="NYP Sindh Emblem" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="text-left">
              <div className="text-base sm:text-lg font-black tracking-tight text-white leading-tight group-hover:text-amber-400 transition-colors">
                NATIONAL YOUTH PARLIAMENT
              </div>
              <div className="text-[11px] font-extrabold text-emerald-400 tracking-wider flex items-center space-x-1.5">
                <span>S I N D H</span>
                <span className="text-slate-600 font-normal">|</span>
                <span className="text-slate-400 font-medium text-[10px]">Official Public Website</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links with Active Pill Highlights */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/') ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/cabinets" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/cabinets') ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Cabinet & MPAs
            </Link>
            <Link 
              to="/announcements" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/announcements') ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              News Bulletins
            </Link>
            <Link 
              to="/contact" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/contact') ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-800'
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
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-400 text-amber-400 transition-all shadow-md flex items-center justify-center cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-emerald-400" />}
            </button>

            {currentUser && currentUser.role === 'APPLICANT' ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/member/dashboard"
                  className="flex items-center space-x-2 bg-emerald-950 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 shadow-md"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Dashboard ({currentUser.fullName.split(' ')[0]})</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
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
              className="p-2 rounded-lg bg-slate-800 text-amber-400 border border-slate-700"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-emerald-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 space-y-3 text-left animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 py-2 text-sm font-semibold hover:text-emerald-700"
          >
            Home
          </Link>
          <Link
            to="/cabinets"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 py-2 text-sm font-semibold hover:text-emerald-700"
          >
            Cabinet & MPAs
          </Link>
          <Link
            to="/announcements"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 py-2 text-sm font-semibold hover:text-emerald-700"
          >
            News Bulletins
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 py-2 text-sm font-semibold hover:text-emerald-700"
          >
            Contact Us
          </Link>

          <div className="pt-4 border-t border-slate-200 flex flex-col space-y-2.5">
            {currentUser && currentUser.role === 'APPLICANT' ? (
              <div className="space-y-2">
                <Link
                  to="/member/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center bg-emerald-50 text-emerald-800 py-3 rounded-xl font-bold text-xs font-semibold"
                >
                  My Member Dashboard
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
