import React from 'react';
import { Sun, Moon, Flame, History, BookOpen, BarChart3, Settings, Download, Upload } from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'history' | 'library' | 'analytics';
  onTabChange: (tab: 'dashboard' | 'history' | 'library' | 'analytics') => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenSettings: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dateStr: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  isDark,
  onToggleDark,
  onOpenSettings,
  onExportData,
  onImportData,
  dateStr,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Brand Title / Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onTabChange('dashboard'); }}
              className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
            >
              Nutri<span className="text-emerald-600 dark:text-emerald-400">Pulse</span>
            </a>
            <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 ml-2 font-medium">
              {dateStr}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line controls) */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'dashboard'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Daily History
          </button>
          <button
            onClick={() => onTabChange('library')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'library'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Food Library
          </button>
          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'analytics'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>
        </nav>

        {/* Zone 3: Actions (Dark mode toggle, Export, Settings) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDark}
            aria-label="Toggle theme mode"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-800"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Backup / Export */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={onExportData}
              title="Export JSON backup"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import JSON backup"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onImportData}
              className="hidden"
            />
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-700"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium rounded-lg ${
            currentTab === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Flame className="w-4 h-4" />
          Today
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium rounded-lg ${
            currentTab === 'history' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <History className="w-4 h-4" />
          Logs
        </button>
        <button
          onClick={() => onTabChange('library')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium rounded-lg ${
            currentTab === 'library' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Foods
        </button>
        <button
          onClick={() => onTabChange('analytics')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium rounded-lg ${
            currentTab === 'analytics' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Trends
        </button>
      </div>
    </header>
  );
};
