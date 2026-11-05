import React from 'react';
import { DayLogs, Profile } from '../types';
import { BarChart3, TrendingUp, Target, Award, Calendar } from 'lucide-react';

interface AnalyticsViewProps {
  logs: DayLogs;
  profile: Profile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ logs, profile }) => {
  // Generate last 7 days keys
  const days: { dateKey: string; label: string; calories: number; protein: number }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayEntries = logs[key] || [];

    const cal = dayEntries.reduce((s, e) => s + e.calories, 0);
    const pro = Math.round(dayEntries.reduce((s, e) => s + e.protein, 0) * 10) / 10;
    const dayName = d.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' });

    days.push({
      dateKey: key,
      label: dayName,
      calories: cal,
      protein: pro,
    });
  }

  const maxCal = Math.max(...days.map((d) => d.calories), profile.caloriesGoal || 2000, 2500);
  const avgCal = Math.round(days.reduce((s, d) => s + d.calories, 0) / 7);
  const avgProtein = Math.round((days.reduce((s, d) => s + d.protein, 0) / 7) * 10) / 10;
  const daysMetGoal = days.filter((d) => d.calories > 0 && Math.abs(d.calories - profile.caloriesGoal) <= 200).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">7-Day Calorie Avg</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {avgCal} <span className="text-xs font-normal text-slate-500">kcal/day</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">7-Day Protein Avg</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {avgProtein} <span className="text-xs font-normal text-slate-500">g/day</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Target Consistency</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {daysMetGoal} / 7 <span className="text-xs font-normal text-slate-500">days on target</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Visual Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              <span>7-Day Calorie &amp; Protein Intake Trends</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Target baseline: {profile.caloriesGoal} kcal / {profile.proteinGoal}g protein
            </p>
          </div>
        </div>

        {/* Bar chart container */}
        <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-200 dark:border-slate-800 relative">
          {/* Target Reference Line */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-500/50 pointer-events-none z-10 flex items-center justify-end"
            style={{ bottom: `${(profile.caloriesGoal / maxCal) * 100}%` }}
          >
            <span className="bg-emerald-500 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded -mr-2 shadow-sm">
              Target: {profile.caloriesGoal}
            </span>
          </div>

          {days.map((day, idx) => {
            const heightPct = Math.min(100, Math.round((day.calories / maxCal) * 100));
            const isToday = idx === 6;

            return (
              <div key={day.dateKey} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-mono px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                  {day.calories} kcal | {day.protein}g protein
                </div>

                {/* Calorie Bar */}
                <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex flex-col justify-end p-1">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                        : day.calories > profile.caloriesGoal
                        ? 'bg-gradient-to-t from-amber-500 to-orange-400'
                        : 'bg-emerald-500/70 dark:bg-emerald-600/70'
                    }`}
                    style={{ height: `${Math.max(8, heightPct)}%` }}
                  />
                </div>

                {/* Date Label */}
                <span className={`text-[11px] font-semibold mt-2 ${isToday ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {day.label}
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">{day.calories} kcal</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
