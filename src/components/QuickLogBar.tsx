import React, { useState } from 'react';
import { MealType, FoodItem } from '../types';
import { Mic, MicOff, Plus, Sparkles, Loader2, Utensils } from 'lucide-react';
import { parsePhrase, searchFoods } from '../utils/parser';
import { fetchGeminiNutrition } from '../utils/gemini';

interface QuickLogBarProps {
  onAddEntry: (food: FoodItem, qty: number, meal: MealType) => void;
  customFoods: FoodItem[];
  geminiKey?: string;
}

const QUICK_FAVORITES: { name: string; query: string; icon: string }[] = [
  { name: 'Roti (1)', query: '1 roti', icon: '🫓' },
  { name: 'Dal (1 katori)', query: '1 dal', icon: '🥣' },
  { name: 'White Rice (1 cup)', query: '1 white rice', icon: '🍚' },
  { name: 'Boiled Egg (2)', query: '2 boiled egg', icon: '🥚' },
  { name: 'Paneer (100g)', query: '100g paneer', icon: '🧀' },
  { name: 'Whey Scoop (1)', query: '1 whey protein', icon: '🥤' },
  { name: 'Chai (1 cup)', query: '1 chai', icon: '☕' },
];

export const QuickLogBar: React.FC<QuickLogBarProps> = ({
  onAddEntry,
  customFoods,
  geminiKey,
}) => {
  const [input, setInput] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');
  const [isListening, setIsListening] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);
  const [disambiguation, setDisambiguation] = useState<{
    query: string;
    qty: number;
    options: { food: FoodItem; score: number }[];
    remaining: { qty: number; query: string }[];
  } | null>(null);

  // Web Speech Recognition
  const toggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.interimResults = false;

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onerror = (e: any) => {
      setIsListening(false);
      console.error('Speech error:', e.error);
    };

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      if (transcript) {
        setInput(transcript);
        processRawText(transcript);
      }
    };

    rec.start();
  };

  const processRawText = async (text: string) => {
    if (!text.trim()) return;
    setLoadingMsg(null);
    const parsed = parsePhrase(text);
    if (!parsed.length) {
      setLoadingMsg('Could not detect food in that phrase. Try typing e.g. "2 rotis and dal"');
      return;
    }

    setInput('');
    let pending = [...parsed];

    while (pending.length > 0) {
      const current = pending[0];
      const results = searchFoods(current.query, customFoods);

      if (!results.length) {
        // Try Gemini fallback
        setLoadingMsg(`AI searching nutrition for "${current.query}"...`);
        const aiFood = await fetchGeminiNutrition(current.query);
        setLoadingMsg(null);

        if (aiFood) {
          onAddEntry(aiFood, current.qty, selectedMeal);
          pending.shift();
          continue;
        } else {
          setLoadingMsg(`No match found for "${current.query}". Try another term.`);
          pending.shift();
          continue;
        }
      }

      const top = results[0];
      const second = results[1];
      const isClearWinner =
        top.score >= 0.88 || !second || top.score - second.score >= 0.15;

      if (isClearWinner) {
        onAddEntry(top.food, current.qty, selectedMeal);
        pending.shift();
        continue;
      }

      // If ambiguous, pop disambiguation UI to let user choose
      setDisambiguation({
        query: current.query,
        qty: current.qty,
        options: results,
        remaining: pending.slice(1),
      });
      return;
    }
  };

  const handleSelectOption = (food: FoodItem) => {
    if (!disambiguation) return;
    onAddEntry(food, disambiguation.qty, selectedMeal);
    const remaining = [...disambiguation.remaining];
    setDisambiguation(null);

    // Continue processing remaining queue
    if (remaining.length > 0) {
      const remainingText = remaining.map((r) => `${r.qty} ${r.query}`).join(' and ');
      processRawText(remainingText);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processRawText(input);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm mb-8 transition-all">
      {/* Top Header & Meal Type Segmented Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Log Food Item</h2>
        </div>

        {/* Meal Category Filter / Tab */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((meal) => (
            <button
              key={meal}
              type="button"
              onClick={() => setSelectedMeal(meal)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all whitespace-nowrap ${
                selectedMeal === meal
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {meal}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type e.g., '2 rotis and dal' or '1 bowl paneer butter masala'..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Mic Button */}
        <button
          type="button"
          onClick={toggleVoice}
          title="Voice input (Indian English & Hindi supported)"
          className={`px-3.5 py-3 rounded-xl border font-semibold text-xs flex items-center gap-1.5 transition-all ${
            isListening
              ? 'bg-rose-500 text-white border-rose-500 animate-pulse shadow-md shadow-rose-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Voice'}</span>
        </button>

        {/* Submit Add Button */}
        <button
          type="submit"
          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add to Log</span>
        </button>
      </form>

      {/* Status or loading messages */}
      {loadingMsg && (
        <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2 font-medium">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{loadingMsg}</span>
        </div>
      )}

      {/* Disambiguation Picker */}
      {disambiguation && (
        <div className="mt-4 p-3.5 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2">
            Which food item did you mean for &quot;{disambiguation.query}&quot;?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {disambiguation.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt.food)}
                className="text-left px-3 py-2 bg-white dark:bg-slate-800 border border-amber-200/70 dark:border-amber-900/40 hover:border-amber-400 rounded-lg text-xs transition-colors flex items-center justify-between"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-100">{opt.food.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {opt.food.calories} kcal ({opt.food.serving})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick 1-Click Favorites */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Quick 1-Click Logging:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_FAVORITES.map((fav, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => processRawText(fav.query)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>{fav.icon}</span>
              <span>{fav.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
