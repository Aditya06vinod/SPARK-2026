import React, { useState } from 'react';
import { DayLogs, Profile } from '../types';
import { Calendar as CalendarIcon, Clock, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryViewProps {
  logs: DayLogs;
  profile: Profile;
  onDeleteEntry: (dateKey: string, index: number) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ logs, profile, onDeleteEntry }) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const dayEntries = logs[selectedDate] || [];
  const totalCal = dayEntries.reduce((s, e) => s + e.calories, 0);
  const totalPro = Math.round(dayEntries.reduce((s, e) => s + e.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(dayEntries.reduce((s, e) => s + e.carbs, 0) * 10) / 10;
  const totalFat = Math.round(dayEntries.reduce((s, e) => s + e.fat, 0) * 10) / 10;

  const navigateDate = (daysOffset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + daysOffset);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const formattedSelectedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all">
      {/* Date Header & Navigator */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-500" />
            <span>Daily History &amp; Archived Logs</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formattedSelectedDate}</p>
        </div>

        {/* Date Selector Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-900 dark:text-white"
          />

          <button
            onClick={() => navigateDate(1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Metrics for Selected Date */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Calories Intake</span>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalCal} <span className="text-xs font-normal text-slate-500">/ {profile.caloriesGoal} kcal</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Protein</span>
          <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
            {totalPro}g <span className="text-xs font-normal text-slate-500">/ {profile.proteinGoal}g</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Carbohydrates</span>
          <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            {totalCarbs}g
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Healthy Fats</span>
          <div className="text-lg font-extrabold text-sky-600 dark:text-sky-400 font-mono tabular-nums">
            {totalFat}g
          </div>
        </div>
      </div>

      {/* Tracked Foods List for Selected Date */}
      {dayEntries.length === 0 ? (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
          <p className="text-sm font-medium">No foods logged on {selectedDate}.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {dayEntries.map((entry, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200">
                    {entry.qty}x
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{entry.name}</h4>
                  <span className="text-xs text-slate-400 capitalize">· {entry.meal}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  {entry.protein}g protein | {entry.carbs}g carbs | {entry.fat}g fat
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {entry.calories} kcal
                </span>
                <button
                  onClick={() => onDeleteEntry(selectedDate, idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
