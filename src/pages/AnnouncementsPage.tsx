import React from 'react';
import { store } from '../services/store';
import { Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementsPage: React.FC = () => {
  const announcements = store.getAnnouncements();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-left space-y-8 bg-slate-50">
      <div className="ui-card p-8 space-y-3 shadow-sm border-slate-200">
        <div className="flex items-center space-x-3 text-emerald-800 font-bold text-sm uppercase">
          <Megaphone className="w-5 h-5 text-emerald-700" />
          <span>Official Bulletins & Notifications</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">NYP Sindh News & Announcements</h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Stay updated with latest parliamentary sessions, regional assembly schedules, and central notifications.
        </p>
      </div>

      <div className="space-y-6">
        {announcements.map((ann) => (
          <div key={ann.id} className="ui-card rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm border-slate-200 hover:border-slate-300 transition-all">
            {ann.bannerUrl && (
              <img
                src={ann.bannerUrl}
                alt={ann.title}
                className="w-full md:w-80 h-56 object-cover border-b md:border-b-0 md:border-r border-slate-200 shrink-0"
              />
            )}
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-emerald-800 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ann.publishedAt}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">{ann.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link to="/signup" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1">
                  <span>Register & Participate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-slate-400 font-medium">NYP Sindh Official Release</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
