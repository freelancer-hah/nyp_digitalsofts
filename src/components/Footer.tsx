import React from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUp, 
  ChevronRight 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const profile = currentUser ? store.getProfileByUserId(currentUser.id) : undefined;
  const hasApplied = Boolean(profile);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#03140e] text-slate-100 text-xs overflow-hidden border-t border-emerald-900/80 font-sans transition-colors duration-300">
      
      {/* Top Gold Accent Border Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-emerald-800/50">
          
          {/* Column 1: Brand & Slogan */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <img src="/nyp-logo.png" alt="NYP Sindh Logo" className="h-14 sm:h-16 w-auto object-contain shrink-0" />
              <div>
                <span className="font-black text-white text-base tracking-tight block font-heading uppercase">
                  NATIONAL YOUTH PARLIAMENT
                </span>
                <span className="text-xs text-amber-400 font-black uppercase tracking-[0.3em] block font-heading">
                  — S I N D H —
                </span>
              </div>
            </div>

            <p className="text-xs text-amber-300/95 font-bold uppercase tracking-widest leading-relaxed">
              YOUTH TODAY • A STRONGER PAKISTAN TOMORROW
            </p>

            {/* Social Icons with High Contrast */}
            <div className="flex items-center space-x-2.5 pt-1">
              {/* Discord Community */}
              <a 
                href="https://discord.gg/vuctexed9" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Discord Server"
                title="Join Official Discord Server"
                className="w-8 h-8 rounded-full bg-emerald-950 border border-amber-400/60 flex items-center justify-center text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/share/1DUTWH5d4M/" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Facebook"
                title="Facebook"
                className="w-8 h-8 rounded-full bg-emerald-950 border border-amber-400/60 flex items-center justify-center text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a 
                href="https://x.com/nypsindh?s=11" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="X (Twitter)"
                title="X (Twitter)"
                className="w-8 h-8 rounded-full bg-emerald-950 border border-amber-400/60 flex items-center justify-center text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-sm"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com/nypsindh" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                title="Instagram"
                className="w-8 h-8 rounded-full bg-emerald-950 border border-amber-400/60 flex items-center justify-center text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest font-heading border-b border-emerald-800/80 pb-2">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-100 hover:text-amber-400 font-semibold transition-colors flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-100 hover:text-amber-400 font-semibold transition-colors flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link to="/#focus-areas" className="text-slate-100 hover:text-amber-400 font-semibold transition-colors flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Initiatives</span>
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="text-slate-100 hover:text-amber-400 font-semibold transition-colors flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>News &amp; Media</span>
                </Link>
              </li>
              <li>
                <Link to="/cabinets" className="text-slate-100 hover:text-amber-400 font-semibold transition-colors flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Resources &amp; Cabinet</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-100 hover:text-amber-400 font-semibold transition-colors flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Secretariat Contact Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest font-heading border-b border-emerald-800/80 pb-2">
              Secretariat
            </h3>
            <div className="space-y-2.5 text-xs text-slate-100 font-medium">
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Helpline: <strong className="font-extrabold text-amber-300">0331 9226110</strong></span>
              </div>
              <div className="flex items-center space-x-2.5">
                <a 
                  href="https://discord.gg/vuctexed9" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center space-x-2 text-slate-100 hover:text-amber-300 transition-colors group"
                >
                  <svg className="w-4 h-4 fill-current shrink-0 text-amber-400 group-hover:text-amber-300" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Discord: <strong className="font-extrabold text-amber-300 hover:underline">Official Community</strong></span>
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Email: <a href="mailto:nypsindh@gmail.com" className="font-extrabold text-amber-300 hover:underline">nypsindh@gmail.com</a></span>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Secretariat: <strong className="font-bold text-white">Karachi, Sindh, Pakistan</strong></span>
              </div>
            </div>
          </div>

          {/* Column 4: Slogan & Mission Statement */}
          <div className="space-y-3 md:col-span-1">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest font-heading border-b border-emerald-800/80 pb-2">
              Our Commitment
            </h3>
            <p className="text-xs text-emerald-300 font-bold leading-relaxed font-heading tracking-wide">
              EMPOWERING YOUTH | STRENGTHENING SINDH | BUILDING A BRIGHTER TOMORROW
            </p>
            <div className="pt-2">
              <Link 
                to={hasApplied ? "/member/dashboard" : "/signup"} 
                className="inline-block bg-gradient-to-r from-amber-400 via-amber-500 to-[#c59b27] hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-lg text-xs shadow-lg tracking-wide uppercase font-heading"
              >
                {hasApplied ? "Access Member Portal" : "Join NYP Sindh Today"}
              </Link>
            </div>
          </div>

        </div>

        {/* Sindh Landmark Architectural Silhouette Decoration in Background */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-200 font-medium">
          <div>
            © {new Date().getFullYear()} National Youth Parliament Sindh (nypsindh.org.pk). All Rights Reserved.
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <span className="text-amber-300 font-cursive-accent text-2xl tracking-wide">Youth Leading Future</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-emerald-950 border border-amber-400/80 text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-all cursor-pointer shadow-md"
              title="Back to Top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
