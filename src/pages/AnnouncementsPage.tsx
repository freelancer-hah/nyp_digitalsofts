import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Megaphone, Calendar, ArrowRight, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Announcement } from '../types';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(store.getAnnouncements());

  useEffect(() => {
    setAnnouncements(store.getAnnouncements());
    store.fetchFromSupabase().then(() => {
      setAnnouncements(store.getAnnouncements());
    });
  }, []);

  const fallbackAnnouncements: Announcement[] = [
    {
      id: 'default-ann-1',
      title: 'Hyderabad Divisional Meeting Held at Royal Taj',
      content: 'Young leaders came together to strengthen NYP Sindh and advance youth engagement across all districts of Hyderabad division.',
      publishedAt: '2026-09-05',
      bannerUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
      isActive: true,
    },
    {
      id: 'default-ann-2',
      title: 'NYP Sindh Pays Tribute on Defence Day',
      content: 'Remembering the courage and sacrifices of our national heroes with youth parliamentary caucuses and policy resolutions.',
      publishedAt: '2026-09-06',
      bannerUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=800',
      isActive: true,
    },
    {
      id: 'default-ann-3',
      title: 'NYP Sindh Cabinet Meeting Concludes Successfully',
      content: 'Productive discussions on upcoming provincial initiatives, divisional chapter bodies, and youth development programs across Sindh.',
      publishedAt: '2026-08-30',
      bannerUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
      isActive: true,
    }
  ];

  const displayList = announcements.length > 0 ? announcements : fallbackAnnouncements;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-left space-y-8 bg-slate-50 dark:bg-[#060b13] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="ui-card p-8 space-y-3 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1320] rounded-3xl">
        <div className="flex items-center space-x-3 text-emerald-800 dark:text-emerald-400 font-bold text-sm uppercase">
          <Megaphone className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>Official Bulletins &amp; Notifications</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">NYP Sindh News &amp; Announcements</h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
          Stay updated with latest parliamentary sessions, regional assembly schedules, and central notifications.
        </p>
      </div>

      <div className="space-y-6">
        {displayList.map((ann) => (
          <div key={ann.id} className="rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1320] hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            {ann.bannerUrl && (
              <img
                src={ann.bannerUrl}
                alt={ann.title}
                className="w-full md:w-80 h-56 object-cover border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 shrink-0"
              />
            )}
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-400 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{ann.publishedAt}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{ann.title}</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link to="/signup" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center space-x-1">
                  <span>Register &amp; Participate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">NYP Sindh Official Release</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
