import React from 'react';
import { Terminal, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-1.5 bg-gray-900 dark:bg-gray-100 rounded-lg">
              <Terminal className="w-5 h-5 text-white dark:text-gray-900" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
              DevTools
            </span>
          </a>

          {/* Navigation - visible on all screens */}
          <div className="flex items-center gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors text-sm text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 mr-2"
              aria-label="Search tools"
            >
              <Search size={14} />
              <span className="hidden sm:inline mr-1">Search</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 font-mono text-[10px] font-medium bg-white dark:bg-gray-950 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-400">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
