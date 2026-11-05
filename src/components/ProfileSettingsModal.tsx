import React, { useState } from 'react';
import { Profile } from '../types';
import { Settings, Save, Key, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface ProfileSettingsModalProps {
  profile: Profile;
  onSaveProfile: (updated: Profile) => void;
  onClose: () => void;
  onResetData: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  profile,
  onSaveProfile,
  onClose,
  onResetData,
}) => {
  const [weight, setWeight] = useState(profile.weight || 70);
  const [calories, setCalories] = useState(profile.caloriesGoal || 2000);
  const [protein, setProtein] = useState(profile.proteinGoal || 120);
  const [carbs, setCarbs] = useState(profile.carbsGoal || 250);
  const [fat, setFat] = useState(profile.fatGoal || 65);
  const [geminiKey, setGeminiKey] = useState(profile.geminiKey || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      weight: Number(weight) || 70,
      caloriesGoal: Number(calories) || 2000,
      proteinGoal: Number(protein) || 120,
      carbsGoal: Number(carbs) || 250,
      fatGoal: Number(fat) || 65,
      geminiKey: geminiKey.trim(),
    });
    onClose();
  };

  // Quick Macro Auto-Calculator based on weight and calorie target
  const autoCalculateMacros = () => {
    const w = Number(weight) || 70;
    const c = Number(calories) || 2000;
    // 2.0g protein per kg bodyweight target for fitness
    const recommendedProtein = Math.round(w * 1.8);
    // 25% calories from fat (9 kcal per g)
    const recommendedFat = Math.round((c * 0.25) / 9);
    // Remaining calories from carbs (4 kcal per g)
    const remainingCal = c - recommendedProtein * 4 - recommendedFat * 9;
    const recommendedCarbs = Math.max(50, Math.round(remainingCal / 4));

    setProtein(recommendedProtein);
    setFat(recommendedFat);
    setCarbs(recommendedCarbs);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Settings className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Profile &amp; Nutritional Goals</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure your targets and optional AI integrations.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daily Calorie Target (kcal)
              </label>
              <input
                type="number"
                required
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Macro Goals</span>
            <button
              type="button"
              onClick={autoCalculateMacros}
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Auto-calculate from Weight &amp; Calories
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          {/* Gemini API Key */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>Gemini API Key (Optional)</span>
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Used as client fallback for rare dishes not in local database. Server proxy is active by default.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to clear all logged food entries?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              Reset All Logs
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
