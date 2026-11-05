import React, { useState, useEffect } from 'react';
import { LogEntry, FoodItem, MealType } from './types';
import { BASE_FOODS } from './data/baseFoods';
import { parsePhrase, searchFoods } from './utils/parser';
import { fetchGeminiNutrition } from './utils/gemini';
import { Plus, Mic, MicOff, Trash2, Edit3, X, Check, Search, Flame, Settings } from 'lucide-react';

interface TargetGoals {
  calories: number;
  protein: number;
}

export default function App() {
  // Pure dark mode theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_mode');
    return saved ? saved === 'dark' : true; // Default dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme_mode', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme_mode', 'light');
    }
  }, [isDarkMode]);

  // Daily target goals state
  const [goals, setGoals] = useState<TargetGoals>(() => {
    try {
      const saved = localStorage.getItem('nutri_goals');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return { calories: 2000, protein: 120 };
  });

  const [showGoalModal, setShowGoalModal] = useState(false);

  // Tracked logs state
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('nutri_today_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: '1',
        name: 'Roti / Chapati',
        serving: '2 medium (80g)',
        qty: 2,
        calories: 240,
        protein: 7,
        carbs: 44,
        fat: 3,
        meal: 'lunch',
        timestamp: Date.now() - 3600000,
      },
      {
        id: '2',
        name: 'Dal Tadka',
        serving: '1 katori (150g)',
        qty: 1,
        calories: 150,
        protein: 8,
        carbs: 22,
        fat: 4,
        meal: 'lunch',
        timestamp: Date.now() - 3600000,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('nutri_today_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('nutri_goals', JSON.stringify(goals));
  }, [goals]);

  // Natural Language & Voice Input
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Selected Item to Edit (Modal or inline expand)
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);

  // Totals calculation
  const totalCalories = logs.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = Math.round(logs.reduce((acc, curr) => acc + curr.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(logs.reduce((acc, curr) => acc + curr.carbs, 0) * 10) / 10;
  const totalFat = Math.round(logs.reduce((acc, curr) => acc + curr.fat, 0) * 10) / 10;

  const calPct = Math.min(100, Math.round((totalCalories / goals.calories) * 100));
  const remainingCalories = goals.calories - totalCalories;

  // Food logging logic
  const handleAddFood = async (rawText: string) => {
    if (!rawText.trim()) return;
    setLoading(true);

    const parsedParts = parsePhrase(rawText);
    if (!parsedParts.length) {
      setLoading(false);
      return;
    }

    const newEntries: LogEntry[] = [];

    for (const part of parsedParts) {
      const searchResults = searchFoods(part.query);
      if (searchResults.length > 0) {
        const food = searchResults[0].food;
        newEntries.push({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: food.name,
          serving: food.serving,
          qty: part.qty,
          calories: Math.round(food.calories * part.qty),
          protein: Math.round(food.protein * part.qty * 10) / 10,
          carbs: Math.round(food.carbs * part.qty * 10) / 10,
          fat: Math.round(food.fat * part.qty * 10) / 10,
          meal: 'lunch',
          timestamp: Date.now(),
        });
      } else {
        // AI Fallback
        const aiFood = await fetchGeminiNutrition(part.query);
        if (aiFood) {
          newEntries.push({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: aiFood.name,
            serving: aiFood.serving,
            qty: part.qty,
            calories: Math.round(aiFood.calories * part.qty),
            protein: Math.round(aiFood.protein * part.qty * 10) / 10,
            carbs: Math.round(aiFood.carbs * part.qty * 10) / 10,
            fat: Math.round(aiFood.fat * part.qty * 10) / 10,
            meal: 'lunch',
            timestamp: Date.now(),
          });
        }
      }
    }

    if (newEntries.length > 0) {
      setLogs((prev) => [...newEntries, ...prev]);
      setInputText('');
    }
    setLoading(false);
  };

  // Voice speech mic handler
  const toggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition not supported in browser. Try typing.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.interimResults = false;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      if (transcript) {
        setInputText(transcript);
        handleAddFood(transcript);
      }
    };
    rec.start();
  };

  // Quick 1-click add base item
  const handleQuickAdd = (food: FoodItem) => {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: food.name,
      serving: food.serving,
      qty: 1,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      meal: 'lunch',
      timestamp: Date.now(),
    };
    setLogs((prev) => [entry, ...prev]);
  };

  // Save changes to tapped/edited food item
  const handleSaveEdit = (updated: LogEntry) => {
    setLogs((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setEditingEntry(null);
  };

  // Delete logged item
  const handleDeleteItem = (id: string) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
    if (editingEntry?.id === id) setEditingEntry(null);
  };

  const filteredLogs = logs.filter((item) =>
    item.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} transition-colors font-sans antialiased`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Top Control Bar: Dark Mode Toggle & Goal Settings */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800/80 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-white" />
            <span className="font-extrabold tracking-tight text-lg">CALORIE TRACKER</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
            </button>
            <button
              onClick={() => setShowGoalModal(true)}
              className="p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 transition-colors"
              title="Edit Calorie Target Goal"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TOP SECTION: CALORIES TRACKED */}
        <div className="py-8 my-2 border-b border-neutral-800">
          <div className="text-xs uppercase tracking-widest font-mono text-neutral-400 mb-2">
            Calories Tracked Today
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight tabular-nums">
                {totalCalories}
              </span>
              <span className="text-xl font-mono text-neutral-400">/ {goals.calories} kcal</span>
            </div>
            <div className="text-right font-mono">
              <span className="text-2xl font-bold">{calPct}%</span>
            </div>
          </div>

          {/* Stark Monochromatic Progress Bar */}
          <div className="w-full h-3 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${calPct}%` }}
            />
          </div>

          {/* Key Dietary Summary Numbers */}
          <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-neutral-900 text-center font-mono">
            <div className="p-2 bg-neutral-900/60 border border-neutral-800/80 rounded-xl">
              <span className="text-[10px] text-neutral-400 uppercase block">Remaining</span>
              <span className="text-sm font-bold tabular-nums">
                {remainingCalories >= 0 ? `${remainingCalories}` : `+${Math.abs(remainingCalories)}`} kcal
              </span>
            </div>
            <div className="p-2 bg-neutral-900/60 border border-neutral-800/80 rounded-xl">
              <span className="text-[10px] text-neutral-400 uppercase block">Protein</span>
              <span className="text-sm font-bold tabular-nums">{totalProtein}g</span>
            </div>
            <div className="p-2 bg-neutral-900/60 border border-neutral-800/80 rounded-xl">
              <span className="text-[10px] text-neutral-400 uppercase block">Carbs</span>
              <span className="text-sm font-bold tabular-nums">{totalCarbs}g</span>
            </div>
            <div className="p-2 bg-neutral-900/60 border border-neutral-800/80 rounded-xl">
              <span className="text-[10px] text-neutral-400 uppercase block">Fat</span>
              <span className="text-sm font-bold tabular-nums">{totalFat}g</span>
            </div>
          </div>
        </div>

        {/* INPUT / LOGGING ROW */}
        <div className="my-6 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddFood(inputText);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., '2 rotis and dal' or '100g paneer'..."
              className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white transition-colors"
            />

            <button
              type="button"
              onClick={toggleVoice}
              className={`p-3 rounded-xl border text-sm font-mono flex items-center justify-center transition-colors ${
                isListening
                  ? 'bg-white text-black border-white animate-pulse'
                  : 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-white text-black font-extrabold text-sm rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Adding...' : 'ADD'}</span>
            </button>
          </form>

          {/* Quick 1-click popular add tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-neutral-500 font-mono">Quick Add:</span>
            {BASE_FOODS.slice(0, 6).map((food, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickAdd(food)}
                className="px-2.5 py-1 text-xs font-mono bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-lg transition-colors"
              >
                + {food.name.split('/')[0].trim()} ({food.calories} kcal)
              </button>
            ))}
          </div>
        </div>

        {/* FOODS TRACKED SECTION */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono font-bold tracking-widest text-neutral-400 uppercase">
              Food Log ({filteredLogs.length} items)
            </h2>

            {/* Simple Search Filter */}
            {logs.length > 3 && (
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter log..."
                  className="w-full pl-8 pr-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
              <p className="text-sm font-mono">No food items tracked yet today.</p>
              <p className="text-xs text-neutral-600 mt-1">Type food item above or use quick add tags.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setEditingEntry(item)}
                  className="group p-4 bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800/90 hover:border-neutral-700 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  {/* Left: Food Name & Dietary Info */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-bold text-xs bg-neutral-800 text-neutral-200 px-2 py-0.5 rounded">
                        {item.qty}x
                      </span>
                      <h3 className="font-bold text-base text-white tracking-tight group-hover:text-neutral-100">
                        {item.name}
                      </h3>
                    </div>

                    {/* Dietary Info */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400 mt-1.5">
                      <span>Serving: {item.serving}</span>
                      <span>·</span>
                      <span className="text-neutral-200">Protein: {item.protein}g</span>
                      <span>·</span>
                      <span>Carbs: {item.carbs}g</span>
                      <span>·</span>
                      <span>Fat: {item.fat}g</span>
                    </div>
                  </div>

                  {/* Right: Respective Calorie Count */}
                  <div className="text-right shrink-0">
                    <div className="text-xl font-extrabold font-mono tabular-nums text-white">
                      {item.calories} <span className="text-xs font-normal text-neutral-400">kcal</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 block group-hover:text-neutral-300">
                      Tap to edit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TAP ITEM TO EDIT VALUES MODAL / DRAWER */}
        {editingEntry && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
              <button
                onClick={() => setEditingEntry(null)}
                className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold font-mono border-b border-neutral-800 pb-3 mb-4">
                Edit Dietary Values
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Food Name</label>
                  <input
                    type="text"
                    value={editingEntry.name}
                    onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Quantity</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editingEntry.qty}
                      onChange={(e) => {
                        const newQty = parseFloat(e.target.value) || 1;
                        const ratio = newQty / (editingEntry.qty || 1);
                        setEditingEntry({
                          ...editingEntry,
                          qty: newQty,
                          calories: Math.round(editingEntry.calories * ratio),
                          protein: Math.round(editingEntry.protein * ratio * 10) / 10,
                          carbs: Math.round(editingEntry.carbs * ratio * 10) / 10,
                          fat: Math.round(editingEntry.fat * ratio * 10) / 10,
                        });
                      }}
                      className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      value={editingEntry.calories}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, calories: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-lg text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="block text-neutral-400 mb-1">Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingEntry.protein}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, protein: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 bg-black border border-neutral-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingEntry.carbs}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, carbs: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 bg-black border border-neutral-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingEntry.fat}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, fat: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 bg-black border border-neutral-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Serving Size</label>
                  <input
                    type="text"
                    value={editingEntry.serving}
                    onChange={(e) => setEditingEntry({ ...editingEntry, serving: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-5 mt-4 border-t border-neutral-800">
                <button
                  onClick={() => handleDeleteItem(editingEntry.id)}
                  className="px-3 py-2 text-rose-500 hover:text-rose-400 font-mono text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  DELETE
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingEntry(null)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 font-mono text-xs rounded-lg"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => handleSaveEdit(editingEntry)}
                    className="px-4 py-2 bg-white text-black font-extrabold font-mono text-xs rounded-lg hover:bg-neutral-200 flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    SAVE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT CALORIE GOAL TARGET MODAL */}
        {showGoalModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 text-white shadow-2xl relative font-mono">
              <button
                onClick={() => setShowGoalModal(false)}
                className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold pb-3 border-b border-neutral-800 mb-4">
                DAILY GOAL TARGETS
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Target Calories (kcal)</label>
                  <input
                    type="number"
                    value={goals.calories}
                    onChange={(e) => setGoals({ ...goals, calories: parseInt(e.target.value, 10) || 2000 })}
                    className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-lg text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Target Protein (g)</label>
                  <input
                    type="number"
                    value={goals.protein}
                    onChange={(e) => setGoals({ ...goals, protein: parseInt(e.target.value, 10) || 120 })}
                    className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-lg text-white font-bold"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowGoalModal(false)}
                className="w-full mt-5 py-2.5 bg-white text-black font-extrabold text-xs rounded-lg hover:bg-neutral-200"
              >
                SAVE TARGETS
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
