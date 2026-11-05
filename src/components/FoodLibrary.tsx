import React, { useState } from 'react';
import { BASE_FOODS } from '../data/baseFoods';
import { FoodItem, MealType } from '../types';
import { Search, Plus, Sparkles, BookOpen } from 'lucide-react';

interface FoodLibraryProps {
  customFoods: FoodItem[];
  onAddEntry: (food: FoodItem, qty: number, meal: MealType) => void;
  onAddCustomFood: (food: FoodItem) => void;
}

export const FoodLibrary: React.FC<FoodLibraryProps> = ({
  customFoods,
  onAddEntry,
  onAddCustomFood,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Custom Food Form State
  const [newFoodName, setNewFoodName] = useState('');
  const [newServing, setNewServing] = useState('1 portion (100g)');
  const [newCal, setNewCal] = useState('');
  const [newPro, setNewPro] = useState('');
  const [newCarbs, setNewCarbs] = useState('');
  const [newFat, setNewFat] = useState('');
  const [newCategory, setNewCategory] = useState<FoodItem['category']>('custom');

  const allFoods = [...customFoods, ...BASE_FOODS];

  const filteredFoods = allFoods.filter((f) => {
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.synonyms.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreateCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName || !newCal) return;

    const item: FoodItem = {
      name: newFoodName,
      synonyms: [newFoodName.toLowerCase()],
      serving: newServing || '1 serving',
      grams: 100,
      calories: parseInt(newCal, 10) || 100,
      protein: parseFloat(newPro) || 0,
      carbs: parseFloat(newCarbs) || 0,
      fat: parseFloat(newFat) || 0,
      category: newCategory,
    };

    onAddCustomFood(item);
    setShowAddModal(false);
    setNewFoodName('');
    setNewCal('');
    setNewPro('');
    setNewCarbs('');
    setNewFat('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <span>Food Database &amp; Nutritional Directory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Browse {allFoods.length} Indian &amp; Global food items with exact calorie and macro counts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Food</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="my-4 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food by name (e.g. paneer, dosa, oats)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
          {['all', 'staples', 'curries', 'protein', 'breakfast', 'snacks', 'fruits', 'beverages'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Foods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredFoods.map((food, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  {food.name}
                </h3>
                <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-white bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50 shrink-0">
                  {food.calories} kcal
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Serving: <span className="font-medium text-slate-700 dark:text-slate-300">{food.serving}</span>
              </p>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{food.protein}g protein</span>
                <span className="text-amber-600 dark:text-amber-400">{food.carbs}g carbs</span>
                <span className="text-sky-600 dark:text-sky-400">{food.fat}g fat</span>
              </div>
            </div>

            {/* Quick Log Buttons */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 capitalize font-medium">{food.category}</span>
              <div className="flex items-center gap-1">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => onAddEntry(food, 1, m)}
                    className="px-2 py-1 text-[10px] font-semibold capitalize bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-colors"
                    title={`Log 1 serving as ${m}`}
                  >
                    + {m[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create Custom Food Item</h3>
            <form onSubmit={handleCreateCustomFood} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Food Name *
                </label>
                <input
                  type="text"
                  required
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  placeholder="e.g. Homemade Protein Bar"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Serving Description
                  </label>
                  <input
                    type="text"
                    value={newServing}
                    onChange={(e) => setNewServing(e.target.value)}
                    placeholder="e.g. 1 bar (60g)"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Calories (kcal) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newCal}
                    onChange={(e) => setNewCal(e.target.value)}
                    placeholder="e.g. 210"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPro}
                    onChange={(e) => setNewPro(e.target.value)}
                    placeholder="15"
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCarbs}
                    onChange={(e) => setNewCarbs(e.target.value)}
                    placeholder="20"
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFat}
                    onChange={(e) => setNewFat(e.target.value)}
                    placeholder="5"
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
                >
                  Save Food Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
