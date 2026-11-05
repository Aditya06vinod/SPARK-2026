import React, { useState } from 'react';
import { LogEntry, MealType } from '../types';
import { Trash2, Plus, Minus, Search, Calendar, Clock, Sparkles } from 'lucide-react';

interface TrackedFoodsListProps {
  entries: LogEntry[];
  onDeleteEntry: (index: number) => void;
  onUpdateQty: (index: number, newQty: number) => void;
  dateStr: string;
}

export const TrackedFoodsList: React.FC<TrackedFoodsListProps> = ({
  entries,
  onDeleteEntry,
  onUpdateQty,
  dateStr,
}) => {
  const [mealFilter, setMealFilter] = useState<'all' | MealType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = entries.filter((entry) => {
    const matchesMeal = mealFilter === 'all' || entry.meal === mealFilter;
    const matchesQuery = entry.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMeal && matchesQuery;
  });

  const totalCaloriesFiltered = filteredEntries.reduce((sum, e) => sum + e.calories, 0);
  const totalProteinFiltered = Math.round(filteredEntries.reduce((sum, e) => sum + e.protein, 0) * 10) / 10;

  // Group by meal for subtotal summaries
  const meals: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  const mealSubtotals = meals.reduce((acc, meal) => {
    const mealItems = entries.filter((e) => e.meal === meal);
    acc[meal] = {
      calories: mealItems.reduce((s, e) => s + e.calories, 0),
      protein: Math.round(mealItems.reduce((s, e) => s + e.protein, 0) * 10) / 10,
      count: mealItems.length,
    };
    return acc;
  }, {} as Record<MealType, { calories: number; protein: number; count: number }>);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Tracked Foods &amp; Calories</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {entries.length} items logged for {dateStr}
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search log..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMealFilter(m)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all whitespace-nowrap ${
                  mealFilter === m
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meal Subtotals Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
        {meals.map((meal) => (
          <div
            key={meal}
            onClick={() => setMealFilter(mealFilter === meal ? 'all' : meal)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              mealFilter === meal
                ? 'bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                : 'bg-slate-50/80 border-slate-200/60 dark:bg-slate-800/50 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs capitalize text-slate-600 dark:text-slate-300 font-semibold">
              <span>{meal}</span>
              <span className="text-[11px] font-mono text-slate-400">({mealSubtotals[meal].count})</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {mealSubtotals[meal].calories} <span className="text-[10px] font-normal text-slate-500">kcal</span>
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                {mealSubtotals[meal].protein}g pro
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Tracked Foods List View */}
      {filteredEntries.length === 0 ? (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50 text-emerald-500" />
          <p className="text-sm font-medium">No food items logged for this view.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Use the input bar above to add meals like &quot;2 rotis and dal&quot; or voice mic.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredEntries.map((entry, idx) => {
            const actualIndex = entries.findIndex((e) => e.id === entry.id || e === entry);
            const timeFormatted = new Date(entry.timestamp || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={entry.id || idx}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
              >
                {/* Left: Food details */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm shrink-0 font-mono">
                    {entry.qty}x
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                        {entry.name}
                      </h3>
                      {/* Unboxed Metadata Discipline */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                        <span className="capitalize">{entry.meal}</span>
                        <span aria-hidden="true">·</span>
                        <span>{entry.serving}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3 inline" />
                          {timeFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Macro Breakdown Text */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        Protein: {entry.protein}g
                      </span>
                      <span className="text-amber-600 dark:text-amber-400">Carbs: {entry.carbs}g</span>
                      <span className="text-sky-600 dark:text-sky-400">Fat: {entry.fat}g</span>
                    </div>
                  </div>
                </div>

                {/* Right: Respective Calorie Count & Quick Quantity Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  {/* Respective Calorie Display */}
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      {entry.calories}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">kcal</span>
                  </div>

                  {/* Qty Adjustment */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => onUpdateQty(actualIndex, entry.qty - 0.5)}
                      disabled={entry.qty <= 0.5}
                      title="Decrease quantity"
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded transition-colors disabled:opacity-40"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                      {entry.qty}
                    </span>
                    <button
                      onClick={() => onUpdateQty(actualIndex, entry.qty + 0.5)}
                      title="Increase quantity"
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteEntry(actualIndex)}
                    title="Delete item"
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Subtotal Bar */}
      {filteredEntries.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Total for this view ({filteredEntries.length} items)</span>
          <div className="flex items-center gap-4 font-mono">
            <span className="text-indigo-600 dark:text-indigo-400">{totalProteinFiltered}g Protein</span>
            <span className="text-base text-slate-900 dark:text-white font-extrabold">{totalCaloriesFiltered} kcal</span>
          </div>
        </div>
      )}
    </div>
  );
};
