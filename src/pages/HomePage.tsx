import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, ArrowRight, ShieldCheck, MapPin, Megaphone, 
  ChevronRight, Sparkles, Building2, MessageSquare, TrendingUp,
  Lightbulb, GraduationCap, Heart, Leaf, Scale, MessageCircle,
  Eye, Handshake, Calendar, FileText, Landmark
} from 'lucide-react';
import { store } from '../services/store';
import { SINDH_DIVISIONS } from '../data/sindhHierarchy';

export const HomePage: React.FC = () => {
  const stats = store.getStats();
  const leadershipMessages = store.getLeadershipMessages();
  const announcements = store.getAnnouncements();
  const [activeGalleryTab, setActiveGalleryTab] = useState<'PARLIAMENTARY' | 'GENERAL' | 'INITIATIVES'>('PARLIAMENTARY');

  const currentUser = store.getCurrentUser();
  const profile = currentUser ? store.getProfileByUserId(currentUser.id) : undefined;
  const hasApplied = Boolean(profile);

  // Iconic famous images for 6 Divisions of Sindh
  const divisionImages: Record<string, { image: string; famousLandmark: string }> = {
    'div-karachi': {
      image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=800',
      famousLandmark: 'Mazar-e-Quaid & Clifton'
    },
    'div-hyderabad': {
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80&w=800',
      famousLandmark: 'Pacco Qillo & Indus River'
    },
    'div-sukkur': {
      image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80&w=800',
      famousLandmark: 'Lansdowne Bridge & Sukkur Barrage'
    },
    'div-larkana': {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      famousLandmark: 'Mohenjo-daro World Heritage'
    },
    'div-mirpurkhas': {
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
      famousLandmark: 'Umerkot Fort & Chittori'
    },
    'div-sba': {
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=800',
      famousLandmark: 'Nawabshah Monument'
    }
  };

  const galleryItems = {
    PARLIAMENTARY: [
      {
        title: "Youth MPA Assembly Session 2026",
        desc: "Provincial Assembly resolution drafting and debate simulation.",
        img: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Constitutional Bill Drafting Caucuses",
        desc: "Empowering young advocates across 30 districts of Sindh.",
        img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
      }
    ],
    GENERAL: [
      {
        title: "Annual General Body Meeting",
        desc: "Provincial executive cabinet members and divisional heads convention.",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Divisional Secretariat Strategic Conference",
        desc: "Setting youth action priorities across all 6 administrative divisions.",
        img: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800"
      }
    ],
    INITIATIVES: [
      {
        title: "Grassroots Civic Awareness Campaign",
        desc: "Community mobilizations in Sukkur, Larkana & Hyderabad.",
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Youth Climate & SDG Advocacy Drive",
        desc: "Promoting sustainability and youth innovation projects in Karachi.",
        img: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=800"
      }
    ]
  };

  const presidentMsg = leadershipMessages.find(m => m.id === 'msg-president') || leadershipMessages[0];
  const otherMessages = leadershipMessages.filter(m => m.id !== 'msg-president');

  return (
    <div className="space-y-16 pb-24 overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#090e17] dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center bg-[#051c14] border-b border-emerald-900/60 text-white">
        
        {/* Mazar-e-Quaid / Sindh Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 pointer-events-none transform scale-100 filter brightness-105 contrast-110"
          style={{
            backgroundImage: `url('/nyp-hero.jpg')`
          }}
        ></div>

        {/* Ambient Overlay Gradients for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#051c14] via-[#051c14]/50 to-[#051c14]/70 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#051c14]/95 via-[#051c14]/80 to-transparent pointer-events-none"></div>

        {/* Top-Right Sindh Map Badge ("SINDH - OUR IDENTITY OUR PRIDE") */}
        <div className="absolute top-8 right-6 lg:right-12 z-20 hidden sm:flex items-center space-x-3 bg-emerald-950/80 border border-amber-400/50 px-4 py-2 rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-300 font-bold text-xs uppercase shadow-inner">
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-right leading-tight">
            <span className="block font-black text-white text-xs tracking-wider font-heading">S I N D H</span>
            <span className="block text-[10px] font-bold text-amber-300 uppercase tracking-widest">OUR IDENTITY • OUR PRIDE</span>
          </div>
        </div>

        {/* Bottom Right Calligraphic Accent Text ("Youth Leading Future") */}
        <div className="absolute bottom-8 right-8 z-10 hidden lg:block opacity-90 pointer-events-none">
          <span className="text-3xl sm:text-5xl font-serif italic text-amber-300 tracking-wide drop-shadow-2xl" style={{ fontFamily: 'Georgia, serif' }}>
            Youth Leading Future
          </span>
          <div className="h-0.5 w-32 bg-gradient-to-r from-amber-400 to-transparent mt-1 ml-auto"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto w-full relative z-10 pt-4">
          <div className="max-w-3xl space-y-7 text-left">
            
            <div className="inline-flex items-center space-x-2 text-amber-300 text-xs font-black uppercase tracking-[0.25em]">
              <span className="w-8 h-0.5 bg-amber-400"></span>
              <span>YOUTH TODAY • A STRONGER PAKISTAN TOMORROW</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] font-heading text-white">
              YOUNG VOICES <br />
              <span className="text-amber-400 drop-shadow-md">
                A STRONGER SINDH
              </span>
            </h1>

            <p className="text-base sm:text-xl text-emerald-100 max-w-2xl leading-relaxed font-normal">
              Empowering youth to discuss, debate and deliver for a progressive Sindh.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={hasApplied ? "/member/dashboard" : "/signup"}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-8 py-4 rounded-xl uppercase tracking-wider flex items-center space-x-3 shadow-2xl transition-all group"
              >
                <span>Join Us</span>
                <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/cabinets"
                className="bg-emerald-950/80 border-2 border-white/30 text-white hover:bg-emerald-900 font-bold text-sm px-8 py-4 rounded-xl flex items-center space-x-2 transition-all shadow-md backdrop-blur-md"
              >
                <span>Learn More</span>
              </Link>
            </div>

            {/* Bottom-Left Tagline with Accent Bar */}
            <div className="pt-8 flex items-center space-x-3 text-xs sm:text-sm font-black tracking-widest text-amber-300 uppercase">
              <div className="w-12 h-1 bg-amber-400 rounded-full"></div>
              <span>DISCUSS | DEBATE | DELIVER FOR A BETTER SINDH</span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 2. 4 FEATURE CARDS STRIP ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/80 hover:shadow-emerald-950/20 backdrop-blur-md group">
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-300 shadow-md group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider font-heading group-hover:text-emerald-700 dark:group-hover:text-amber-300 transition-colors">
                ENGAGE YOUTH
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Building a stronger youth network across Sindh
              </p>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/80 hover:shadow-emerald-950/20 backdrop-blur-md group">
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-300 shadow-md group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider font-heading group-hover:text-emerald-700 dark:group-hover:text-amber-300 transition-colors">
                STRENGTHEN DEMOCRACY
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Promoting dialogue and civic participation
              </p>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/80 hover:shadow-emerald-950/20 backdrop-blur-md group">
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-300 shadow-md group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider font-heading group-hover:text-emerald-700 dark:group-hover:text-amber-300 transition-colors">
                CREATE SOLUTIONS
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Turning ideas into action
              </p>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/80 hover:shadow-emerald-950/20 backdrop-blur-md group">
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-300 shadow-md group-hover:scale-110 transition-transform">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider font-heading group-hover:text-emerald-700 dark:group-hover:text-amber-300 transition-colors">
                BUILD A BRIGHTER SINDH
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                For a progressive and inclusive tomorrow
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FEATURED ANNOUNCEMENT HIGHLIGHT BANNER ================= */}
      {announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 border border-emerald-600/40 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="flex items-center space-x-4 z-10 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg">
                <Megaphone className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest">
                    Latest Announcement
                  </span>
                  <span className="text-emerald-300 text-[11px] font-medium">
                    {announcements[0].publishedAt}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold font-heading text-white mt-0.5 line-clamp-1">
                  {announcements[0].title}
                </h3>
                <p className="text-xs text-emerald-100/80 line-clamp-1 max-w-2xl mt-0.5">
                  {announcements[0].content}
                </p>
              </div>
            </div>

            <Link
              to="/announcements"
              className="z-10 shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md"
            >
              <span>View Announcement</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ================= 3. ABOUT NYP SINDH ("Who We Are") ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Image with Quote Box */}
            <div className="lg:col-span-4 relative rounded-2xl overflow-hidden shadow-2xl group min-h-[340px] border-2 border-amber-400/40">
              <img 
                src="/nyp-youth-summit.jpg" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800";
                }}
                alt="NYP Sindh Youth Assembly Summit" 
                className="w-full h-full object-cover min-h-[340px] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/40 to-transparent"></div>
              
              {/* Floating Top Badge */}
              <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-slate-950" />
                <span>OFFICIAL SINDH YOUTH CONVENTION</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/90 border border-emerald-600/70 p-4 rounded-xl text-left backdrop-blur-md shadow-xl">
                <span className="text-amber-400 text-2xl font-serif leading-none block">“</span>
                <p className="text-xs font-serif italic text-emerald-100 leading-relaxed -mt-2">
                  The future of Sindh is brightest when its youth lead.
                </p>
                <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-amber-200 mt-2"></div>
              </div>
            </div>

            {/* Center Content: Who We Are */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest font-heading block">
                ABOUT NYP SINDH
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading">
                Who We Are
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The National Youth Parliament (NYP) Sindh is a youth-led platform committed to empowering young people, promoting democratic values, and creating opportunities for meaningful youth engagement across Sindh.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We believe in a progressive, inclusive and empowered Sindh led by its youth — where every young person has a voice, an opportunity and a role in shaping a better tomorrow.
              </p>
              <div className="pt-2">
                <Link
                  to="/cabinets"
                  className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center space-x-2 transition-colors shadow-md"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Mission, Vision, Values */}
            <div className="lg:col-span-3 space-y-4">
              
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-start space-x-3 text-left">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-400">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs font-heading">Our Mission</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                    To empower youth through dialogue, leadership and action.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-start space-x-3 text-left">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs font-heading">Our Vision</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                    A progressive, inclusive and empowered Sindh led by its youth.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-start space-x-3 text-left">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs font-heading">Our Values</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                    Integrity, Inclusion, Service and Youth Leadership.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= 4. STATS STRIP ================= */}
      <section className="bg-gradient-to-r from-[#031c13] via-[#053121] to-[#031c13] text-white py-12 relative overflow-hidden border-y border-emerald-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center space-y-8 text-center">
          
          {/* Centered 4 Stat Items Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full max-w-6xl items-center justify-items-center">
            
            {/* Stat 1 */}
            <div className="w-full bg-emerald-950/70 border border-amber-400/40 p-4 rounded-2xl shadow-xl flex items-center justify-center space-x-3.5 group hover:border-amber-400 hover:bg-emerald-900/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 border-2 border-amber-400/80 flex items-center justify-center shrink-0 text-amber-300 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight drop-shadow-sm">
                  500+
                </div>
                <div className="text-[10px] sm:text-[11px] font-black text-amber-300/90 uppercase tracking-widest leading-none mt-0.5">
                  YOUTH NETWORK
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="w-full bg-emerald-950/70 border border-amber-400/40 p-4 rounded-2xl shadow-xl flex items-center justify-center space-x-3.5 group hover:border-amber-400 hover:bg-emerald-900/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 border-2 border-amber-400/80 flex items-center justify-center shrink-0 text-amber-300 shadow-lg group-hover:scale-110 transition-transform">
                <Landmark className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight drop-shadow-sm">
                  14
                </div>
                <div className="text-[10px] sm:text-[11px] font-black text-amber-300/90 uppercase tracking-widest leading-none mt-0.5">
                  DIVISIONS
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="w-full bg-emerald-950/70 border border-amber-400/40 p-4 rounded-2xl shadow-xl flex items-center justify-center space-x-3.5 group hover:border-amber-400 hover:bg-emerald-900/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 border-2 border-amber-400/80 flex items-center justify-center shrink-0 text-amber-300 shadow-lg group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight drop-shadow-sm">
                  30+
                </div>
                <div className="text-[10px] sm:text-[11px] font-black text-amber-300/90 uppercase tracking-widest leading-none mt-0.5">
                  DISTRICTS
                </div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="w-full bg-emerald-950/70 border border-amber-400/40 p-4 rounded-2xl shadow-xl flex items-center justify-center space-x-3.5 group hover:border-amber-400 hover:bg-emerald-900/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 border-2 border-amber-400/80 flex items-center justify-center shrink-0 text-amber-300 shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-left">
                <div className="text-lg sm:text-xl font-black text-white font-heading uppercase tracking-tight drop-shadow-sm">
                  INITIATIVES
                </div>
                <div className="text-[10px] sm:text-[11px] font-black text-amber-300/90 uppercase tracking-widest leading-none mt-0.5">
                  FOR A BETTER SINDH
                </div>
              </div>
            </div>

          </div>

          {/* Centered Calligraphic Tagline Badge */}
          <div className="text-center pt-2">
            <span className="text-2xl sm:text-4xl font-serif italic text-amber-300 drop-shadow-lg tracking-wide block" style={{ fontFamily: 'Georgia, serif' }}>
              Sindh Leads Tomorrow
            </span>
            <div className="h-0.5 w-28 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1 mx-auto"></div>
          </div>

        </div>
      </section>

      {/* ================= 5. FOCUS AREAS ("Building a Better Tomorrow") ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 text-left">
          
          <div>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest font-heading block">
              OUR FOCUS AREAS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading mt-1">
              Building a Better Tomorrow
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* 7 Focus Area Cards */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 p-4 rounded-2xl text-center space-y-2 flex flex-col items-center justify-center hover:border-amber-400 transition-colors">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight font-heading">
                  Education & Skills
                </h4>
              </div>

              <div className="bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 p-4 rounded-2xl text-center space-y-2 flex flex-col items-center justify-center hover:border-amber-400 transition-colors">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight font-heading">
                  Health & Wellbeing
                </h4>
              </div>

              <div className="bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 p-4 rounded-2xl text-center space-y-2 flex flex-col items-center justify-center hover:border-amber-400 transition-colors">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Leaf className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight font-heading">
                  Environment & Climate Action
                </h4>
              </div>

              <div className="bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 p-4 rounded-2xl text-center space-y-2 flex flex-col items-center justify-center hover:border-amber-400 transition-colors">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight font-heading">
                  Social Inclusion & Gender Equality
                </h4>
              </div>

              <div className="bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 p-4 rounded-2xl text-center space-y-2 flex flex-col items-center justify-center hover:border-amber-400 transition-colors">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight font-heading">
                  Economic Opportunities
                </h4>
              </div>

              <div className="bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 p-4 rounded-2xl text-center space-y-2 flex flex-col items-center justify-center hover:border-amber-400 transition-colors">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Scale className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight font-heading">
                  Democratic Awareness
                </h4>
              </div>

              <div className="bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 p-4 rounded-2xl text-center space-y-2 flex flex-col items-center justify-center hover:border-amber-400 transition-colors col-span-2 sm:col-span-2">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight font-heading">
                  Youth Engagement
                </h4>
              </div>

            </div>

            {/* Right Large CTA Banner */}
            <div className="lg:col-span-4 relative rounded-2xl overflow-hidden min-h-[220px] flex items-center justify-center text-center p-8 text-white shadow-xl group">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
                alt="Join NYP Sindh Crowd" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-emerald-950/70"></div>
              
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black text-white font-heading">
                  Be the Change <br />
                  Join NYP Sindh
                </h3>
                <Link 
                  to="/signup"
                  className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center mx-auto shadow-xl transition-transform hover:scale-110"
                >
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 6. EXECUTIVE PRESIDENTIAL & LEADERSHIP MESSAGES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 dark:text-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-500/30 px-4 py-1.5 rounded-full shadow-sm">
            EXECUTIVE LEADERSHIP MESSAGES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white pt-2 font-heading">
            Vision & Leadership Guidelines
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Guiding message from President NYP Sindh and executive cabinet office.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* FEATURED PRESIDENT MESSAGE */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 border-2 border-amber-400/80 text-white p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-8 space-y-5 border-b lg:border-b-0 lg:border-r border-emerald-700/60 pb-6 lg:pb-0 lg:pr-8">
                <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/50 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>PRESIDENTIAL MESSAGE</span>
                </div>

                <div className="text-xs sm:text-sm text-emerald-100 leading-relaxed space-y-3 font-normal whitespace-pre-line">
                  {presidentMsg.messageText}
                </div>

                <div className="pt-4 border-t border-emerald-800 flex items-center justify-between text-xs text-amber-300">
                  <span className="font-bold">National Youth Parliament Sindh</span>
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
                <div className="w-44 h-52 sm:w-52 sm:h-60 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-slate-900 shrink-0">
                  <img 
                    src={presidentMsg.photoUrl} 
                    alt={presidentMsg.leaderName} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white font-heading">{presidentMsg.leaderName}</h3>
                  <p className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">{presidentMsg.leaderTitle}</p>
                  <p className="text-[11px] font-extrabold text-emerald-400 italic mt-1 font-serif">"{presidentMsg.subtitle || 'Youth Leading Future'}"</p>
                </div>
              </div>

            </div>
          </div>

          {/* SECONDARY CABINET MESSAGES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white border border-slate-200/90 text-slate-900 shadow-md dark:bg-slate-900/80 dark:border-slate-800 dark:text-white p-5 flex flex-col justify-between text-left space-y-4 rounded-2xl hover:border-emerald-500/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={msg.photoUrl}
                      alt={msg.leaderName}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-md shrink-0 bg-slate-100 dark:bg-slate-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">{msg.leaderName}</h4>
                      <p className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 leading-tight">{msg.leaderTitle}</p>
                    </div>
                  </div>

                  <blockquote className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-2 border-amber-400 pl-3 py-0.5">
                    "{msg.messageText}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 7. LATEST NEWS & UPCOMING EVENTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Column: LATEST NEWS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase font-heading tracking-wider">
                LATEST NEWS
              </h2>
              <Link to="/announcements" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {announcements.length > 0 ? (
                announcements.slice(0, 3).map((ann, idx) => (
                  <Link 
                    key={ann.id || idx}
                    to="/announcements" 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl hover:border-emerald-600/50 transition-all group text-left"
                  >
                    <div className="relative h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img 
                        src={ann.bannerUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"} 
                        alt={ann.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback image if custom image URL fails to load
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800";
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-emerald-800/90 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md backdrop-blur-xs">
                        Official Release
                      </div>
                    </div>
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          {ann.publishedAt}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug font-heading group-hover:text-emerald-700 dark:group-hover:text-amber-300 transition-colors">
                          {ann.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
                          {ann.content}
                        </p>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 pt-2 flex items-center space-x-1">
                        <span>Read full release</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <>
                  {/* Default News Card 1 */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
                    <div className="relative h-36">
                      <img 
                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" 
                        alt="Hyderabad Meeting" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">05 Sep 2026</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug font-heading">
                        Hyderabad Divisional Meeting Held at Royal Taj
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        Young leaders came together to strengthen NYP Sindh and advance youth engagement.
                      </p>
                    </div>
                  </div>

                  {/* Default News Card 2 */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
                    <div className="relative h-36">
                      <img 
                        src="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=800" 
                        alt="Defence Day Tribute" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">06 Sep 2026</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug font-heading">
                        NYP Sindh Pays Tribute on Defence Day
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        Remembering the courage and sacrifices of our heroes.
                      </p>
                    </div>
                  </div>

                  {/* Default News Card 3 */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
                    <div className="relative h-36">
                      <img 
                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
                        alt="Cabinet Meeting" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">30 Aug 2026</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug font-heading">
                        NYP Sindh Cabinet Meeting Concludes Successfully
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        Productive discussions on upcoming initiatives and divisional bodies.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: UPCOMING EVENTS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase font-heading tracking-wider">
                UPCOMING EVENTS
              </h2>
              <Link to="/announcements" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              
              {/* Event 1 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-center px-3 py-2 rounded-lg shrink-0">
                    <span className="block text-base font-black leading-none">21</span>
                    <span className="block text-[9px] font-bold uppercase">SEP</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Youth Leadership Workshop</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Karachi</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Event 2 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-center px-3 py-2 rounded-lg shrink-0">
                    <span className="block text-base font-black leading-none">05</span>
                    <span className="block text-[9px] font-bold uppercase">OCT</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Divisional Coordination Meeting</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Sukkur</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Event 3 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-center px-3 py-2 rounded-lg shrink-0">
                    <span className="block text-base font-black leading-none">16</span>
                    <span className="block text-[9px] font-bold uppercase">OCT</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">SDGs Youth Engagement Session</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Hyderabad</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Event 4 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-center px-3 py-2 rounded-lg shrink-0">
                    <span className="block text-base font-black leading-none">27</span>
                    <span className="block text-[9px] font-bold uppercase">OCT</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Youth Parliament Simulation</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Karachi</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= 8. 6 ADMINISTRATIVE DIVISIONS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/90 text-slate-900 shadow-xl dark:bg-slate-900/70 dark:border-slate-800 dark:text-white p-8 sm:p-12 space-y-8 rounded-3xl text-left backdrop-blur-md">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 dark:text-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>REGIONAL ADMINISTRATIVE DISTRIBUTION</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading">
                6 Administrative Divisions of Sindh
              </h2>
            </div>

            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white px-5 py-3 rounded-2xl border border-emerald-500/50 flex items-center space-x-3 shadow-lg shrink-0">
              <div className="p-2 rounded-xl bg-white/10 text-amber-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-200 block uppercase font-extrabold tracking-wider">Total Registered Members</span>
                <span className="text-2xl font-black text-white font-heading">{stats.total} Active Members</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SINDH_DIVISIONS.map((division) => {
              const count = stats.divisionCounts[division.name] || 0;
              const divInfo = divisionImages[division.id] || {
                image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=800',
                famousLandmark: 'Regional Heritage'
              };
              
              return (
                <div
                  key={division.id}
                  className="bg-slate-50 border border-slate-200 text-slate-900 shadow-md hover:border-emerald-500/60 dark:bg-slate-950 dark:border-slate-800 dark:text-white rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={divInfo.image} 
                      alt={division.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                    
                    <span className="absolute top-3 left-3 bg-white/90 border border-slate-300 text-emerald-800 dark:bg-slate-900/90 dark:border-slate-700 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider backdrop-blur-md shadow-md">
                      {division.code} DIVISION
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      {division.name}
                    </h4>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold block">Live Division Members</span>
                        <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-heading">{count}</span>
                      </div>
                      <Link 
                        to={`/cabinets?div=${division.id}`}
                        className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60 text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Roster
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};
