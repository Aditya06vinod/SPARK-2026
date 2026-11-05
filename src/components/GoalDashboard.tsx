import React from 'react';
import { Profile, LogEntry } from '../types';
import { Flame, Dumbbell, Wheat, Droplets, CheckCircle2, AlertCircle } from 'lucide-react';

interface GoalDashboardProps {
  profile: Profile;
  todayEntries: LogEntry[];
}

export const GoalDashboard: React.FC<GoalDashboardProps> = ({ profile, todayEntries }) => {
  const totalCalories = todayEntries.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = Math.round(todayEntries.reduce((acc, curr) => acc + curr.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(todayEntries.reduce((acc, curr) => acc + curr.carbs, 0) * 10) / 10;
  const totalFat = Math.round(todayEntries.reduce((acc, curr) => acc + curr.fat, 0) * 10) / 10;

  const calPct = Math.min(100, Math.round((totalCalories / (profile.caloriesGoal || 2000)) * 100));
  const proPct = Math.min(100, Math.round((totalProtein / (profile.proteinGoal || 120)) * 100));
  const carbPct = Math.min(100, Math.round((totalCarbs / (profile.carbsGoal || 250)) * 100));
  const fatPct = Math.min(100, Math.round((totalFat / (profile.fatGoal || 65)) * 100));

  const remainingCal = (profile.caloriesGoal || 2000) - totalCalories;
  const isOverCal = remainingCal < 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Primary Focus Card: Calories Overview */}
      <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Flame className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Daily Calories</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Target: {profile.caloriesGoal} kcal</p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isOverCal
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                  : calPct >= 90
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
              }`}
            >
              {isOverCal ? (
                <>
                  <AlertCircle className="w-3 h-3" /> Over by {Math.abs(remainingCal)} kcal
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" /> {remainingCal} kcal remaining
                </>
              )}
            </span>
          </div>
        </div>

        {/* Big Numbers */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono tabular-nums">
              {totalCalories}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium ml-1">kcal</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
              {calPct}%
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 block">completed</span>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isOverCal
                ? 'bg-gradient-to-r from-orange-500 to-rose-600'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${Math.min(100, calPct)}%` }}
          />
        </div>

        {/* Sub-info summary */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>{todayEntries.length} items logged today</span>
          <span>Target Weight: {profile.weight} kg</span>
        </div>
      </div>

      {/* Protein Goal Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Protein</span>
          </div>
          <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {proPct}%
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {totalProtein}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">/ {profile.proteinGoal}g</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {profile.proteinGoal - totalProtein > 0
              ? `${Math.round((profile.proteinGoal - totalProtein) * 10) / 10}g needed`
              : 'Goal achieved!'}
          </p>
        </div>

        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${proPct}%` }}
          />
        </div>
      </div>

      {/* Carbs & Fat Dual Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all">
        <div className="grid grid-cols-2 gap-3 h-full">
          {/* Carbs */}
          <div className="flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Wheat className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold">Carbs</span>
            </div>
            <div className="my-1">
              <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {totalCarbs}g
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">/ {profile.carbsGoal || 250}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${carbPct}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="flex flex-col justify-between pl-3 border-l border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span className="text-xs font-semibold">Fat</span>
            </div>
            <div className="my-1">
              <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {totalFat}g
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">/ {profile.fatGoal || 65}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${fatPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
