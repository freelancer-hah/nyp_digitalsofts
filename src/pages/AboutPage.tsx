import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  BookOpen, 
  Users, 
  Building2, 
  ArrowRight, 
  Scale, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#060b13] text-slate-900 dark:text-slate-100 min-h-screen text-left">
      
      {/* ================= 1. HERO BANNER ================= */}
      <section className="relative bg-gradient-to-b from-[#03140e] via-[#052818] to-[#03180f] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/60 overflow-hidden">
        
        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          
          <div className="inline-flex items-center space-x-2 bg-emerald-950/90 border border-amber-400/50 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-wider uppercase">Official Institutional Overview</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white leading-tight">
            About National Youth Parliament <span className="text-amber-400">— Sindh —</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed font-sans font-medium">
            National Youth Parliament (NYP) Sindh is the premier non-partisan platform dedicated to empowering youth, fostering democratic literacy, civic engagement, and nurturing future parliamentary leaders across all 6 administrative divisions of Sindh.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-[#c59b27] hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-6 py-3 rounded-xl text-xs shadow-lg uppercase tracking-wide font-heading transition-all"
            >
              Join NYP Sindh Today
            </Link>
            <Link
              to="/cabinets"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all"
            >
              View Executive Cabinets
            </Link>
          </div>

        </div>
      </section>

      {/* ================= 2. VISION, MISSION & VALUES ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Vision */}
          <div className="bg-white dark:bg-[#0b1320] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To cultivate an enlightened, responsible, and visionary youth generation equipped with parliamentary acumen, ethical values, and public service mindset to lead Pakistan forward.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white dark:bg-[#0b1320] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-800 dark:text-amber-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Providing dynamic platforms for legislative debate, youth assembly simulations, community leadership programs, and policy advocacy across Karachi, Hyderabad, Sukkur, Larkana, Mirpurkhas, and Shaheed Benazirabad.
            </p>
          </div>

          {/* Core Values */}
          <div className="bg-white dark:bg-[#0b1320] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 flex items-center justify-center text-teal-800 dark:text-teal-300">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Core Values</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Democratic Integrity &amp; Transparency</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Provincial Inclusion &amp; Equal Voice</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Merit-Based Youth Leadership</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Grassroots Community Service</span>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* ================= 3. LEADERSHIP STATEMENTS & MESSAGES ================= */}
      {/* Exclusive Leadership Messages (Malik Usman Khan, Abdul Muiz Lakho, Rao Humayun Farrukh) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#090f1a] border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700/60 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>LEADERSHIP PERSPECTIVES &amp; MESSAGES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#052818] dark:text-white font-serif-heading">
              Guiding Voices of National Youth Parliament
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Key perspectives from our central leadership, chairman, and general secretariat on empowering youth across Sindh.
            </p>
          </div>

          {/* ----------------- LEADER 1: MALIK USMAN KHAN (President, National Youth Parliament) ----------------- */}
          <div className="bg-slate-50 dark:bg-[#0b1320] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Photo Card */}
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="w-48 h-60 sm:w-56 sm:h-68 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl bg-slate-100 dark:bg-slate-900 shrink-0 relative group">
                  <img
                    src="/nyp-central-president.png"
                    alt="President Malik Usman Khan"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 right-3 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md">
                    <Crown className="w-4 h-4 text-slate-950" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mt-3 uppercase">
                  Malik Usman Khan
                </h3>
                <p className="text-xs font-semibold text-emerald-700 dark:text-amber-400 uppercase tracking-wider mt-0.5">
                  President, National Youth Parliament
                </p>
              </div>

              {/* Message Content */}
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center space-x-1.5 bg-amber-100/80 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 px-3 py-1 rounded-full text-[11px] font-bold text-amber-900 dark:text-amber-300">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>Central Presidential Message</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#052818] dark:text-white font-serif-heading">
                  Building an Inclusive and Empowered Pakistan
                </h3>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-relaxed border-l-4 border-amber-400 pl-4 py-1 italic font-serif">
                    "Sindh’s young people have the talent, ideas and determination to shape a better future. Through NYP Sindh, we aim to give them opportunities to develop leadership skills, understand parliamentary processes and serve their communities."
                  </p>

                  <p>
                    I encourage our Sindh team to listen to young voices across the province and turn their concerns into meaningful action.
                  </p>

                  <p className="font-medium text-emerald-950 dark:text-emerald-200 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/60 p-3.5 rounded-xl">
                    <strong>Together, we can build a more inclusive and empowered Pakistan.</strong>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ----------------- LEADER 2: ABDUL MUIZ LAKHO (Chairman, NYP Sindh) ----------------- */}
          <div className="bg-slate-50 dark:bg-[#0b1320] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Message Content (Left) */}
              <div className="lg:col-span-8 space-y-4 order-2 lg:order-1">
                <div className="inline-flex items-center space-x-1.5 bg-amber-100/80 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 px-3 py-1 rounded-full text-[11px] font-bold text-amber-900 dark:text-amber-300">
                  <Crown className="w-3 h-3 text-amber-600" />
                  <span>Chairman's Message</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#052818] dark:text-white font-serif-heading">
                  Voice of Youth, Force for Change
                </h3>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-relaxed border-l-4 border-amber-500 pl-4 py-1 italic font-serif">
                    "National Youth Parliament Sindh stands as a voice of youth, a platform of leadership, and a force for change. We believe leadership is earned through responsibility, discipline, service, and action."
                  </p>

                  <p>
                    Our commitment is clear: to unite the youth, strengthen leadership, serve society, and build a stronger Sindh and a stronger Pakistan.
                  </p>

                  <p className="font-medium text-emerald-950 dark:text-emerald-200 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/60 p-3.5 rounded-xl">
                    <strong>Visionary Goal:</strong> We do not follow the future; we prepare the leaders who will shape it.
                  </p>
                </div>
              </div>

              {/* Photo Card (Right) */}
              <div className="lg:col-span-4 flex flex-col items-center text-center order-1 lg:order-2">
                <div className="w-48 h-60 sm:w-56 sm:h-68 rounded-2xl overflow-hidden border-4 border-amber-500 shadow-xl bg-slate-100 dark:bg-slate-900 shrink-0 relative group">
                  <img
                    src="/nyp-chairman.png"
                    alt="Chairman Abdul Muiz Lakho"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-md">
                    <Award className="w-4 h-4 text-slate-950" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mt-3 uppercase">
                  Abdul Muiz Lakho
                </h3>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mt-0.5">
                  Chairman, National Youth Parliament Sindh
                </p>
              </div>

            </div>
          </div>

          {/* ----------------- LEADER 3: RAO HUMAYUN FARRUKH (General Secretary, NYP Sindh) ----------------- */}
          <div className="bg-slate-50 dark:bg-[#0b1320] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Photo Card */}
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="w-48 h-60 sm:w-56 sm:h-68 rounded-2xl overflow-hidden border-4 border-emerald-600 dark:border-emerald-500 shadow-xl bg-slate-100 dark:bg-slate-900 shrink-0 relative group">
                  <img
                    src="/nyp-general-secretary.png"
                    alt="General Secretary Rao Humayun Farrukh"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 right-3 bg-emerald-600 text-white p-1.5 rounded-full shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mt-3 uppercase">
                  Rao Humayun Farrukh
                </h3>
                <p className="text-xs font-semibold text-emerald-700 dark:text-amber-400 uppercase tracking-wider mt-0.5">
                  General Secretary, NYP Sindh
                </p>
              </div>

              {/* Message Content */}
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center space-x-1.5 bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>General Secretary's Message</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#052818] dark:text-white font-serif-heading">
                  Empowering Youth, Shaping the Future
                </h3>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-relaxed border-l-4 border-emerald-600 dark:border-emerald-400 pl-4 py-1 italic font-serif">
                    “Empowering youth, strengthening democracy, Stronger leadership. A better tomorrow. Together, we are building a generation that is ready to lead, serve, and shape the future of Sindh and Pakistan.”
                  </p>

                  <p>
                    At National Youth Parliament Sindh, our mission is to translate youth energy and intellect into practical policy, civic advocacy, and transformative action. We strive to provide equal opportunities for youth across every division and district of Sindh to develop legislative knowledge, ethical leadership, and democratic stewardship.
                  </p>

                  <p className="font-medium text-amber-950 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 p-3.5 rounded-xl">
                    <strong>Our Commitment:</strong> Building institutional pathways and empowering dynamic young minds who will lead Sindh towards lasting prosperity, social justice, and good governance.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= 4. PROVINCIAL STRUCTURE ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Organizational Structure
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A transparent, tiered democratic framework connecting central governance with grassroots youth across all divisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0b1320] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center mx-auto font-bold">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Provincial Executive Desk</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">President, Chairman, General Secretary &amp; Central Secretariat</p>
          </div>

          <div className="bg-white dark:bg-[#0b1320] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto font-bold">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Divisional Cabinets</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">6 Divisional Teams managing regional coordination &amp; programs</p>
          </div>

          <div className="bg-white dark:bg-[#0b1320] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto font-bold">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Youth Parliamentarians</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Youth MPAs simulating legislative bills, debates &amp; assemblies</p>
          </div>

          <div className="bg-white dark:bg-[#0b1320] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto font-bold">
              4
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">District &amp; Taluka Chapters</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Local community outreach, youth volunteerism &amp; blood drives</p>
          </div>
        </div>

      </section>

      {/* ================= 5. CTA ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#03140e] via-[#052818] to-[#03140e] text-white border-t border-emerald-900/60 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Ready to Make a Difference for Sindh?
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
            Join thousands of passionate young leaders across Sindh. Register for membership, become a Youth MPA delegate, or serve in your district cabinet.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-block bg-gradient-to-r from-amber-400 via-amber-500 to-[#c59b27] hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-8 py-3.5 rounded-xl text-xs shadow-xl uppercase tracking-wide font-heading transition-all"
            >
              Apply for NYP Sindh Membership
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
