import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, ArrowRight, ShieldCheck, MapPin, Megaphone, 
  ChevronRight, Building2, MessageSquare, TrendingUp,
  Lightbulb, GraduationCap, Heart, Leaf, Scale, MessageCircle,
  Eye, Handshake, Calendar, FileText, Landmark, Award, Crown,
  Film, Image as ImageIcon, Video, Play, X, Filter, Sparkles
} from 'lucide-react';
import { store } from '../services/store';
import { SINDH_DIVISIONS, SINDH_DISTRICTS } from '../data/sindhHierarchy';
import { MediaItem, Announcement } from '../types';

export const HomePage: React.FC = () => {
  const stats = store.getStats();
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>(store.getAnnouncements());
  const [mediaItemsList, setMediaItemsList] = useState<MediaItem[]>(store.getMediaItems());

  useEffect(() => {
    setAnnouncementsList(store.getAnnouncements());
    setMediaItemsList(store.getMediaItems());
    store.fetchFromSupabase().then(() => {
      setAnnouncementsList(store.getAnnouncements());
      setMediaItemsList(store.getMediaItems());
    });
  }, []);

  const [selectedMediaCategory, setSelectedMediaCategory] = useState<string>('ALL');
  const [selectedMediaModal, setSelectedMediaModal] = useState<MediaItem | null>(null);

  const currentUser = store.getCurrentUser();
  const profile = currentUser ? store.getProfileByUserId(currentUser.id) : undefined;
  const hasApplied = Boolean(profile);

  // Reference design news data fallback
  const latestNews = [
    {
      id: 'news-1',
      date: '05 Sep 2026',
      title: 'Hyderabad Divisional Meeting Held at Royal Taj',
      desc: 'Young leaders came together to strengthen NYP Sindh and advance youth engagement.',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'news-2',
      date: '06 Sep 2025',
      title: 'NYP Sindh Pays Tribute on Defence Day',
      desc: 'Remembering the courage and sacrifices of our heroes with parliamentary caucuses.',
      image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'news-3',
      date: '30 Aug 2026',
      title: 'NYP Sindh Cabinet Meeting Concludes Successfully',
      desc: 'Productive discussions on upcoming initiatives and divisional bodies across Sindh.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const displayNews = announcementsList.length > 0
    ? announcementsList.slice(0, 6).map((ann) => ({
        id: ann.id,
        date: ann.publishedAt,
        title: ann.title,
        desc: ann.content,
        image: ann.bannerUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600'
      }))
    : latestNews;

  return (
    <div className="overflow-x-hidden bg-[#faf8f5] text-slate-900 font-sans transition-colors duration-300">
      
      {/* ================= 1. HERO SECTION (Exact Reference Design) ================= */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] flex items-center bg-[#041a10] text-white">
        
        {/* Hero Background Image (Sindh Assembly Hall background) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-95 pointer-events-none filter brightness-105 contrast-105 saturate-110"
          style={{
            backgroundImage: `url('/sindh-assembly-hero.jpg')`
          }}
        ></div>

        {/* Subtle Edge Vignette (Keeps Mazar-e-Quaid crisp and clear while maintaining high text contrast) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041a10]/85 via-transparent to-[#041a10]/30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#041a10]/75 via-[#041a10]/35 to-transparent pointer-events-none"></div>

        {/* Top-Right Sindh Map Badge ("SINDH - OUR IDENTITY OUR PRIDE") */}
        <div className="absolute top-8 right-6 lg:right-12 z-20 hidden sm:flex items-center space-x-3 bg-[#03140e]/90 border border-amber-400/50 px-4 py-2 rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-300 font-bold text-xs shadow-inner">
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-right leading-tight">
            <span className="block font-black text-white text-xs tracking-wider font-heading">S I N D H</span>
            <span className="block text-[10px] font-bold text-amber-300 uppercase tracking-widest">OUR IDENTITY • OUR PRIDE</span>
          </div>
        </div>

        {/* Bottom Right Calligraphic Accent Text ("Youth Leading Future") */}
        <div className="absolute bottom-10 right-8 z-10 hidden lg:block opacity-95 pointer-events-none">
          <span className="text-4xl sm:text-6xl font-cursive-accent text-amber-300 tracking-wide drop-shadow-2xl">
            Youth Leading Future
          </span>
          <div className="h-0.5 w-36 bg-gradient-to-r from-amber-400 to-transparent mt-1 ml-auto"></div>
        </div>

        {/* Hero Main Content */}
        <div className="max-w-7xl mx-auto w-full relative z-10 pt-4">
          <div className="max-w-3xl space-y-6 text-left">
            
            {/* Top Subtitle Tag */}
            <div className="inline-flex items-center space-x-2 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-[0.25em]">
              <span className="w-8 h-0.5 bg-amber-400"></span>
              <span>YOUTH TODAY • A STRONGER PAKISTAN TOMORROW</span>
            </div>

            {/* Main Headline in Elegant Playfair/Cinzel Serif Font */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] font-serif-heading text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              YOUNG VOICES <br />
              <span className="text-gold-metallic drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                A STRONGER SINDH
              </span>
            </h1>

            {/* Sub-text */}
            <p className="text-base sm:text-xl text-white font-medium max-w-2xl leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Empowering youth to discuss, debate and deliver for a progressive Sindh.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link 
                to={hasApplied ? "/member/dashboard" : "/signup"} 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-[#c59b27] hover:from-amber-600 hover:to-amber-700 text-slate-950 text-sm font-extrabold px-8 py-3.5 rounded-full shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>{hasApplied ? "Go to Dashboard" : "Join Us"}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
              
              <a 
                href="#about"
                className="inline-flex items-center space-x-2 border border-emerald-600/80 bg-[#052818]/60 hover:bg-[#052818] text-white text-sm font-bold px-7 py-3.5 rounded-lg backdrop-blur-md shadow-md transition-all duration-200"
              >
                <span>Learn More</span>
              </a>
            </div>

            {/* Bottom Slogan Ticker Bar inside Hero */}
            <div className="pt-8 flex items-center space-x-6 text-xs sm:text-sm font-bold tracking-wider text-emerald-200/90">
              <div className="relative pb-1">
                <span className="text-amber-300 font-extrabold uppercase">DISCUSS</span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"></div>
              </div>
              <span className="text-emerald-500">|</span>
              <span className="uppercase">DEBATE</span>
              <span className="text-emerald-500">|</span>
              <span className="uppercase">DELIVER FOR A BETTER SINDH</span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= LIVE ANNOUNCEMENT TICKER BANNER ================= */}
      {announcementsList.length > 0 && (
        <div className="bg-gradient-to-r from-[#031d13] via-[#052818] to-[#031d13] border-b border-amber-400/40 text-amber-200 py-3 px-4 sm:px-6 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm font-medium">
            <div className="flex items-center space-x-3 overflow-hidden">
              <span className="bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase shrink-0 flex items-center space-x-1 shadow-sm">
                <Megaphone className="w-3 h-3" />
                <span>LATEST BULLETIN</span>
              </span>
              <Link to="/announcements" className="font-bold text-white hover:text-amber-300 transition-colors truncate">
                {announcementsList[0].title}
              </Link>
              <span className="text-amber-300/70 text-xs hidden md:inline shrink-0">
                • {announcementsList[0].publishedAt}
              </span>
            </div>
            <Link to="/announcements" className="text-amber-300 hover:text-white font-bold text-xs flex items-center space-x-1 shrink-0 ml-4">
              <span>View Announcement</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ================= 2. 4-PILLAR FEATURE BAR (Cream Background) ================= */}
      <section className="bg-[#f5f2eb] border-b border-[#eae5d8] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#e2dcd0]">
            
            {/* Pillar 1 */}
            <div className="flex items-start space-x-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#e2dcd0] flex items-center justify-center text-[#052818] shrink-0 shadow-xs">
                <Users className="w-6 h-6 text-[#052818]" />
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-sm text-[#052818] font-heading uppercase tracking-wide">
                  ENGAGE YOUTH
                </h3>
                <p className="text-xs text-slate-600 leading-snug mt-1">
                  Building a stronger youth network across Sindh
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start space-x-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#e2dcd0] flex items-center justify-center text-[#052818] shrink-0 shadow-xs">
                <MessageSquare className="w-6 h-6 text-[#052818]" />
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-sm text-[#052818] font-heading uppercase tracking-wide">
                  STRENGTHEN DEMOCRACY
                </h3>
                <p className="text-xs text-slate-600 leading-snug mt-1">
                  Promoting dialogue and civic participation
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start space-x-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#e2dcd0] flex items-center justify-center text-[#052818] shrink-0 shadow-xs">
                <TrendingUp className="w-6 h-6 text-[#052818]" />
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-sm text-[#052818] font-heading uppercase tracking-wide">
                  CREATE SOLUTIONS
                </h3>
                <p className="text-xs text-slate-600 leading-snug mt-1">
                  Turning ideas into action
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-start space-x-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#e2dcd0] flex items-center justify-center text-[#052818] shrink-0 shadow-xs">
                <Lightbulb className="w-6 h-6 text-[#052818]" />
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-sm text-[#052818] font-heading uppercase tracking-wide">
                  BUILD A BRIGHTER SINDH
                </h3>
                <p className="text-xs text-slate-600 leading-snug mt-1">
                  For a progressive and inclusive tomorrow
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. WHO WE ARE SECTION (Exact Reference Layout) ================= */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#eae5d8]">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Image with Quote Overlay Box */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 relative group">
                <img 
                  src="/nyp-youth-summit.jpg" 
                  alt="Official Sindh Youth Convention Delegates" 
                  className="w-full h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Quote Box Overlaid at Bottom Left of Image */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#042217]/95 border-l-4 border-amber-400 p-4 rounded-xl shadow-2xl text-left backdrop-blur-md">
                  <span className="text-amber-400 text-2xl font-serif font-black leading-none block mb-1">“</span>
                  <p className="text-amber-100 text-xs sm:text-sm font-serif italic leading-snug">
                    The future of Sindh is brightest when its youth lead.
                  </p>
                  <div className="h-0.5 w-12 bg-amber-400 mt-2"></div>
                </div>
              </div>
            </div>

            {/* Center Content: About Description & CTA */}
            <div className="lg:col-span-4 text-left space-y-5">
              <div className="text-[#c59b27] text-xs font-black uppercase tracking-[0.25em] font-heading">
                ABOUT NYP SINDH
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#052818] font-serif-heading">
                Who We Are
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The National Youth Parliament (NYP) Sindh is a youth-led platform committed to empowering young people, promoting democratic values, and creating opportunities for meaningful youth engagement across Sindh.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe in a progressive, inclusive and empowered Sindh led by its youth — where every young person has a voice, an opportunity and a role in shaping a better tomorrow.
              </p>

              <div className="pt-2">
                <a 
                  href="#president-message"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('president-message')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-2 bg-[#052818] hover:bg-[#073822] text-white text-xs font-bold px-6 py-3 rounded-lg shadow-md transition-all cursor-pointer"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Cards: Mission, Vision, Values */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Card 1: Mission */}
              <div className="p-4 rounded-xl bg-[#f8f6f0] border border-[#e8e2d5] flex items-start space-x-3 text-left">
                <div className="w-10 h-10 rounded-full bg-[#eae4d5] flex items-center justify-center shrink-0 text-[#052818]">
                  <Handshake className="w-5 h-5 text-[#052818]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#052818] uppercase tracking-wide font-heading">
                    Our Mission
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    To empower youth through dialogue, leadership and action.
                  </p>
                </div>
              </div>

              {/* Card 2: Vision */}
              <div className="p-4 rounded-xl bg-[#f8f6f0] border border-[#e8e2d5] flex items-start space-x-3 text-left">
                <div className="w-10 h-10 rounded-full bg-[#eae4d5] flex items-center justify-center shrink-0 text-[#052818]">
                  <Eye className="w-5 h-5 text-[#052818]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#052818] uppercase tracking-wide font-heading">
                    Our Vision
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    A progressive, inclusive and empowered Sindh led by its youth.
                  </p>
                </div>
              </div>

              {/* Card 3: Values */}
              <div className="p-4 rounded-xl bg-[#f8f6f0] border border-[#e8e2d5] flex items-start space-x-3 text-left">
                <div className="w-10 h-10 rounded-full bg-[#eae4d5] flex items-center justify-center shrink-0 text-[#052818]">
                  <Users className="w-5 h-5 text-[#052818]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#052818] uppercase tracking-wide font-heading">
                    Our Values
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Integrity, Inclusion, Service and Youth Leadership.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= PRESIDENT'S MESSAGE SECTION ================= */}
      <section id="president-message" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto text-left space-y-8">
          
          {/* Top Accent Pill */}
          <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700/60 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-xs">
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>PRESIDENTIAL MESSAGE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* President Message Content (Left Side) */}
            <div className="lg:col-span-8 space-y-4 order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#052818] dark:text-white font-serif-heading">
                Youth Leading Future
              </h2>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-relaxed border-l-4 border-amber-400 pl-4 py-1 italic font-serif">
                  "It is a privilege to lead the National Youth Parliament Sindh with a firm belief that the future of our province depends on the ideas, courage and participation of its young people."
                </p>

                <p>
                  Our youth must be more than observers of change, they must become its architects. NYP Sindh is committed to providing young people with a platform where they can discuss, debate, lead, and transform ideas into meaningful action. We aim to promote responsible leadership, democratic values, education, social inclusion, innovation and community service across Sindh.
                </p>

                <p>
                  I believe leadership is not defined by a position, it is defined by the positive difference we create for others. Every young person has the potential to contribute and when that potential is given direction and opportunity, it can shape a stronger society.
                </p>

                <p className="font-medium text-emerald-900 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 p-3.5 rounded-xl">
                  <strong>Our message is simple:</strong> believe in your voice, take responsibility, serve your community, and have the courage to lead. Together we can build a progressive, inclusive and empowered Sindh led by its youth.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/cabinets"
                  className="inline-flex items-center space-x-2 bg-[#052818] hover:bg-[#073822] text-amber-300 text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
                >
                  <span>View Full Executive Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Official Executive Secretariat</span>
                </div>
              </div>
            </div>

            {/* President Photo Card (Right Side) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center order-1 lg:order-2">
              <div className="w-52 h-64 sm:w-60 sm:h-72 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl bg-slate-100 shrink-0 relative group">
                <img
                  src="/nyp-president.png"
                  alt="President Abdul Rehman Halepoto"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 right-3 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md">
                  <Crown className="w-4 h-4 text-slate-950" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading mt-4 uppercase">
                Abdul Rehman Halepoto
              </h3>
              <p className="text-xs font-semibold text-emerald-700 dark:text-amber-400 uppercase tracking-wider mt-0.5">
                President, National Youth Parliament Sindh
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 5. FOCUS AREAS ("Building a Better Tomorrow") ================= */}
      <section id="focus-areas" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#052818] border-b border-[#073822] text-white">
        <div className="max-w-7xl mx-auto text-left">
          
          <div className="mb-10">
            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.25em] font-heading block mb-1">
              OUR FOCUS AREAS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif-heading">
              Building a Better Tomorrow
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Focus Area Cards */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-800/40 shadow-md text-center flex flex-col items-center justify-center space-y-3 hover:border-amber-400 hover:scale-105 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-[#052818] dark:text-emerald-400">
                  <GraduationCap className="w-6 h-6 text-[#052818] dark:text-emerald-400" />
                </div>
                <span className="font-bold text-xs text-[#052818] dark:text-white leading-tight">Education &amp; Skills</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-800/40 shadow-md text-center flex flex-col items-center justify-center space-y-3 hover:border-amber-400 hover:scale-105 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-[#052818] dark:text-emerald-400">
                  <Heart className="w-6 h-6 text-[#052818] dark:text-emerald-400" />
                </div>
                <span className="font-bold text-xs text-[#052818] dark:text-white leading-tight">Health &amp; Wellbeing</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-800/40 shadow-md text-center flex flex-col items-center justify-center space-y-3 hover:border-amber-400 hover:scale-105 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-[#052818] dark:text-emerald-400">
                  <Leaf className="w-6 h-6 text-[#052818] dark:text-emerald-400" />
                </div>
                <span className="font-bold text-xs text-[#052818] dark:text-white leading-tight">Environment &amp; Climate Action</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-800/40 shadow-md text-center flex flex-col items-center justify-center space-y-3 hover:border-amber-400 hover:scale-105 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-[#052818] dark:text-emerald-400">
                  <Users className="w-6 h-6 text-[#052818] dark:text-emerald-400" />
                </div>
                <span className="font-bold text-xs text-[#052818] dark:text-white leading-tight">Social Inclusion &amp; Gender Equality</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-800/40 shadow-md text-center flex flex-col items-center justify-center space-y-3 hover:border-amber-400 hover:scale-105 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-[#052818] dark:text-emerald-400">
                  <TrendingUp className="w-6 h-6 text-[#052818] dark:text-emerald-400" />
                </div>
                <span className="font-bold text-xs text-[#052818] dark:text-white leading-tight">Economic Opportunities</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-800/40 shadow-md text-center flex flex-col items-center justify-center space-y-3 hover:border-amber-400 hover:scale-105 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-[#052818] dark:text-emerald-400">
                  <Scale className="w-6 h-6 text-[#052818] dark:text-emerald-400" />
                </div>
                <span className="font-bold text-xs text-[#052818] dark:text-white leading-tight">Democratic Awareness</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-800/40 shadow-md text-center flex flex-col items-center justify-center space-y-3 hover:border-amber-400 hover:scale-105 transition-all col-span-2 sm:col-span-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-[#052818] dark:text-emerald-400">
                  <MessageCircle className="w-6 h-6 text-[#052818] dark:text-emerald-400" />
                </div>
                <span className="font-bold text-xs text-[#052818] dark:text-white leading-tight">Youth Engagement</span>
              </div>

            </div>

            {/* Right Featured Image Banner Card ("Be the Change Join NYP Sindh") */}
            <div className="lg:col-span-4 relative rounded-xl overflow-hidden shadow-lg border border-[#e8e2d5] min-h-[260px] flex items-end p-6 bg-[#042217]">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" 
                alt="Join NYP Sindh Assembly" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#042217] via-[#042217]/60 to-transparent"></div>
              
              <div className="relative z-10 flex items-center justify-between w-full">
                <div>
                  <h3 className="text-2xl font-extrabold text-white font-serif-heading leading-tight">
                    Be the Change <br />
                    <span className="text-amber-300">Join NYP Sindh</span>
                  </h3>
                </div>

                <Link 
                  to={hasApplied ? "/member/dashboard" : "/signup"} 
                  className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 shrink-0"
                >
                  <ArrowRight className="w-6 h-6 text-slate-950" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SINDH ADMINISTRATIVE DIVISIONS SECTION ================= */}
      <section id="divisions" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] dark:bg-slate-950 border-b border-[#eae5d8] dark:border-slate-800">
        <div className="max-w-7xl mx-auto text-left space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>REGIONAL ADMINISTRATIVE DISTRIBUTION</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#052818] dark:text-white font-serif-heading">
                6 Administrative Divisions of Sindh
              </h2>
            </div>

            {/* Right Active Members Counter Card */}
            <div className="bg-[#042217] dark:bg-slate-900 border border-emerald-800/80 dark:border-slate-800 rounded-2xl px-6 py-3.5 flex items-center space-x-4 shadow-lg text-white shrink-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-amber-300 shrink-0">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider block leading-none">TOTAL REGISTERED MEMBERS</span>
                <span className="text-base sm:text-lg font-black text-white font-heading leading-tight block mt-1">
                  {stats.approved || 0} Active Members
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SINDH_DIVISIONS.map((div) => {
              const divisionImagesMap: Record<string, string> = {
                'div-karachi': '/divisions/div-karachi.jpg',
                'div-hyderabad': '/divisions/div-hyderabad.jpg',
                'div-sukkur': '/divisions/div-sukkur.jpg',
                'div-larkana': '/divisions/div-larkana.jpg',
                'div-mirpurkhas': '/divisions/div-mirpurkhas.jpg',
                'div-sba': '/divisions/div-sba.jpg',
              };

              const divImage = divisionImagesMap[div.id] || divisionImagesMap['div-karachi'];
              const memberCount = store.getCabinetMembers(undefined, div.id).length;

              return (
                <div
                  key={div.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 text-left"
                >
                  {/* Top Image Banner with Division Pill Badge */}
                  <div className="h-44 sm:h-48 overflow-hidden relative">
                    <img 
                      src={divImage} 
                      alt={div.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20"></div>
                    
                    {/* Top Left Badge: e.g. KHI DIVISION */}
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg shadow-md">
                      <span className="text-xs font-black text-[#052818] dark:text-emerald-400 uppercase tracking-wider">
                        {div.code} DIVISION
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 text-left space-y-4">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {div.name}
                    </h3>

                    <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          LIVE DIVISION MEMBERS
                        </span>
                        <span className="text-xl font-black text-[#052818] dark:text-emerald-400 font-heading block leading-none mt-0.5">
                          {memberCount}
                        </span>
                      </div>

                      <Link
                        to={`/cabinets?div=${div.id}`}
                        className="bg-emerald-100/80 dark:bg-emerald-950/90 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/60 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
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

      {/* ================= MEDIA & EVENT GALLERY SECTION ================= */}
      <section id="media-gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-left space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-emerald-950/90 border border-emerald-700/80 px-3.5 py-1 rounded-full text-xs font-bold text-amber-300 shadow-xs">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>PROGRAMS &amp; EVENT GALLERY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif-heading">
                Capturing Youth Action Across Sindh
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Explore highlights from official youth parliamentary sessions, divisional leadership conventions, and community outreach programs across Sindh.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl shrink-0">
              {['ALL', 'Youth Summit', 'Assembly Session', 'Divisional Meetup', 'Community Outreach'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedMediaCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedMediaCategory === cat 
                      ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'All Gallery' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Media Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItemsList
              .filter((item) => selectedMediaCategory === 'ALL' || item.category === selectedMediaCategory)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMediaModal(item)}
                  className="bg-slate-950/80 border border-slate-800 hover:border-amber-400/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1 text-left"
                >
                  {/* Thumbnail Banner */}
                  <div className="h-52 overflow-hidden relative bg-slate-950">
                    <img 
                      src={item.mediaUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                    
                    {/* Top Format Badge */}
                    <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-700/80 px-2.5 py-1 rounded-lg shadow-md flex items-center space-x-1.5 backdrop-blur-md">
                      {item.mediaType === 'VIDEO' ? (
                        <div className="flex items-center space-x-1 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                          <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>Video Coverage</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          <ImageIcon className="w-3 h-3 text-emerald-400" />
                          <span>Photo Media</span>
                        </div>
                      )}
                    </div>

                    {/* Top Right Category Pill */}
                    <div className="absolute top-3 right-3 bg-emerald-950/90 border border-emerald-700/80 px-2.5 py-1 rounded-lg shadow-md backdrop-blur-md">
                      <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    {/* Center Play overlay icon for videos */}
                    {item.mediaType === 'VIDEO' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-slate-950 fill-slate-950 ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-medium">
                        {item.eventDate && (
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>{item.eventDate}</span>
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{item.location}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white font-heading group-hover:text-amber-300 transition-colors leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                      <span>View Program Gallery Details</span>
                      <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              ))}
          </div>

        </div>
      </section>

      {/* Lightbox / Modal for Program Media Gallery Item */}
      {selectedMediaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative text-left text-white my-8">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedMediaModal(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center backdrop-blur-md cursor-pointer transition-transform hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Cover / Preview */}
            <div className="h-72 sm:h-96 relative bg-slate-950 overflow-hidden">
              <img 
                src={selectedMediaModal.mediaUrl} 
                alt={selectedMediaModal.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>

              {selectedMediaModal.mediaType === 'VIDEO' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <a 
                    href={selectedMediaModal.mediaUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Play className="w-8 h-8 text-slate-950 fill-slate-950 ml-1" />
                  </a>
                </div>
              )}
            </div>

            {/* Details Content */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-amber-400/20 border border-amber-400/60 text-amber-300 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                  {selectedMediaModal.category}
                </span>

                {selectedMediaModal.eventDate && (
                  <span className="text-xs text-slate-300 font-medium flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>{selectedMediaModal.eventDate}</span>
                  </span>
                )}

                {selectedMediaModal.location && (
                  <span className="text-xs text-slate-300 font-medium flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{selectedMediaModal.location}</span>
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-heading">
                {selectedMediaModal.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {selectedMediaModal.description}
              </p>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Official National Youth Parliament (NYP) Sindh Program Archive</span>
                </div>

                <button
                  onClick={() => setSelectedMediaModal(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= 6. LATEST NEWS ================= */}

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#eae5d8]">
        <div className="max-w-7xl mx-auto text-left space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xl font-extrabold text-[#052818] uppercase tracking-wider font-heading">
              LATEST NEWS &amp; ANNOUNCEMENTS
            </h3>
            <Link to="/announcements" className="text-xs font-bold text-[#059669] hover:text-[#042217] flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNews.map((news) => (
              <article key={news.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs hover:shadow-md transition-all hover:-translate-y-1 flex flex-col">
                <div className="h-44 overflow-hidden relative bg-slate-100">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 block mb-1">
                      {news.date}
                    </span>
                    <h4 className="font-bold text-sm text-[#052818] line-clamp-2 leading-snug">
                      {news.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {news.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <Link to="/announcements" className="hover:underline flex items-center space-x-1">
                      <span>Read Full Release</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
