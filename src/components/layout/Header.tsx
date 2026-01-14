import React from 'react';
import { Terminal, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);

  const tools = [
    { name: 'JSON Formatter', href: '/json-formatter' },
    { name: 'Markdown Previewer', href: '/markdown-preview' },
    { name: 'Base64 Converter', href: '/base64-converter' },
  ];

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
              Chao Chen
            </span>
          </a>

          {/* Navigation - visible on all screens */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                onBlur={() => setTimeout(() => setIsToolsOpen(false), 200)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                Tools
                <ChevronDown size={16} className={`transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-2 z-50">
                  {tools.map((tool) => (
                    <a
                      key={tool.href}
                      href={tool.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {tool.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
