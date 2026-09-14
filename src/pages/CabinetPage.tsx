import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { store } from '../services/store';
import { SINDH_DIVISIONS } from '../data/sindhHierarchy';
import { Award, Users, Filter, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export const CabinetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeDivParam = searchParams.get('div') || 'ALL';

  const [selectedDiv, setSelectedDiv] = useState(activeDivParam);
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'PROVINCIAL' | 'DIVISIONAL'>('ALL');

  const cabinetMembers = store.getCabinetMembers(
    selectedLevel === 'ALL' ? undefined : selectedLevel,
    selectedDiv === 'ALL' ? undefined : selectedDiv
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-left space-y-8 bg-slate-50 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-800/60 text-left space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 bg-emerald-800/80 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-amber-300 border border-emerald-700">
          <img src="/nyp-logo.jpg" alt="NYP Logo" className="w-4 h-4 object-contain rounded-full border border-amber-300" />
          <span>Official Public Cabinet Directories & Ehedadaran</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Sindh Provincial & Divisional Cabinet Directory
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
          Public roster of office bearers, Youth Members of Provincial Assembly (Youth MPAs), and designated cabinet leaders representing Karachi, Hyderabad, Sukkur, Larkana, Mirpurkhas, and Shaheed Benazirabad divisions.
        </p>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="ui-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border-slate-200 bg-white">
        
        {/* Division Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedDiv('ALL')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
              selectedDiv === 'ALL'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Sindh Cabinets
          </button>

          {SINDH_DIVISIONS.map((div) => (
            <button
              key={div.id}
              onClick={() => setSelectedDiv(div.id)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                selectedDiv === div.id
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {div.name.replace(' Division', '')}
            </button>
          ))}
        </div>

        {/* Level Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setSelectedLevel('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedLevel === 'ALL' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'}`}
          >
            All Levels
          </button>
          <button
            onClick={() => setSelectedLevel('PROVINCIAL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedLevel === 'PROVINCIAL' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'}`}
          >
            Provincial
          </button>
          <button
            onClick={() => setSelectedLevel('DIVISIONAL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedLevel === 'DIVISIONAL' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'}`}
          >
            Divisional
          </button>
        </div>

      </div>

      {/* Grid of Cabinet Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cabinetMembers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs bg-white rounded-3xl border border-slate-200 shadow-xs">
            No cabinet members found for the selected filter.
          </div>
        ) : (
          cabinetMembers.map((member) => (
            <div
              key={member.id}
              className="ui-card ui-card-hover p-6 border-slate-200 space-y-4 shadow-sm flex flex-col justify-between text-left group hover:border-emerald-300"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative overflow-hidden rounded-2xl shrink-0">
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      className="w-16 h-20 object-cover border-2 border-emerald-600 shadow-sm bg-slate-100 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="ui-badge-green text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase block w-fit mb-1 shadow-2xs">
                      {member.cabinetLevel} CABINET
                    </span>
                    <h3 className="font-black text-slate-900 text-base leading-tight group-hover:text-emerald-800 transition-colors">
                      {member.fullName}
                    </h3>
                    <p className="text-xs font-extrabold text-emerald-800 mt-0.5">{member.designation}</p>
                  </div>
                </div>

                {member.bio && (
                  <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-emerald-600 pl-3">
                    "{member.bio}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-bold">
                    {member.divisionId ? store.getDivisionName(member.divisionId) : 'Sindh Province'}
                  </span>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
