import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Terminal, FileText, Braces, Clock, ArrowRight, Moon, Sun, Shield, Lock } from 'lucide-react';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { useTheme } from '../../hooks/useTheme';

type CommandItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  keywords: string[];
  shortcut?: string;
};

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Open/Close Shortcut
  useKeyboardShortcut({
    key: 'k',
    ctrl: true, // Cmd+K
    callback: () => {
      setIsOpen((prev) => !prev);
    },
    preventDefault: true,
  });

  // Custom Event Listener for external triggers (e.g. Header button)
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-command-palette', handleOpenEvent);
    return () => window.removeEventListener('open-command-palette', handleOpenEvent);
  }, []);

  // Close on Escape
  useKeyboardShortcut({
    key: 'Escape',
    callback: () => setIsOpen(false),
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Small timeout to ensure render
      setTimeout(() => inputRef.current?.focus(), 10);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Terminal,
      action: () => navigate('/'),
      keywords: ['home', 'start', 'index'],
    },
    {
      id: 'timestamp',
      label: 'Timestamp Converter',
      icon: Clock,
      action: () => navigate('/timestamp-converter'),
      keywords: ['time', 'date', 'epoch', 'unix'],
    },
    {
      id: 'json',
      label: 'JSON Formatter',
      icon: Braces,
      action: () => navigate('/json-formatter'),
      keywords: ['json', 'format', 'pretty', 'lint'],
    },
    {
      id: 'markdown',
      label: 'Markdown Previewer',
      icon: FileText,
      action: () => navigate('/markdown-preview'),
      keywords: ['markdown', 'md', 'preview', 'readme'],
    },
    {
      id: 'base64',
      label: 'Base64 Converter',
      icon: Lock,
      action: () => navigate('/base64-converter'),
      keywords: ['base64', 'encode', 'decode'],
    },
    {
      id: 'regex',
      label: 'Regex Playground',
      icon: Search,
      action: () => navigate('/regex-tester'),
      keywords: ['regex', 'regexp', 'test', 'match'],
    },
    {
      id: 'jwt',
      label: 'JWT Inspector',
      icon: Shield,
      action: () => navigate('/jwt-inspector'),
      keywords: ['jwt', 'token', 'decode', 'security'],
    },
    {
      id: 'cron',
      label: 'Cron Helper',
      icon: Clock,
      action: () => navigate('/cron-helper'),
      keywords: ['cron', 'schedule', 'job', 'time'],
    },
    {
      id: 'theme',
      label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
      icon: theme === 'light' ? Moon : Sun,
      action: toggleTheme,
      keywords: ['theme', 'dark', 'light', 'mode'],
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.keywords.some(k => k.includes(query.toLowerCase()))
  );

  const handleSelect = (index: number) => {
    const item = filteredCommands[index];
    if (item) {
      item.action();
      setIsOpen(false);
    }
  };

  // Keyboard Navigation inside the list
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          handleSelect(selectedIndex);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Ensure selection index is valid when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Search Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[60vh] animate-in fade-in zoom-in-95 duration-100">
        
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <Search className="text-gray-400 w-5 h-5 mr-3" />
          <input
            ref={inputRef}
            className="flex-grow bg-transparent border-none outline-none text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 font-medium"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
          <div className="hidden sm:flex gap-1">
             <kbd className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">esc</kbd>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-2" ref={listRef}>
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No results found.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors ${
                    index === selectedIndex 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={index === selectedIndex ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.shortcut && (
                     <span className="text-xs text-gray-400">{item.shortcut}</span>
                  )}
                  {index === selectedIndex && (
                    <ArrowRight size={16} className="text-blue-500 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="hidden sm:flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500">
          <div className="flex gap-4">
             <span><strong className="font-medium text-gray-700 dark:text-gray-300">Cmd K</strong> to open</span>
             <span><strong className="font-medium text-gray-700 dark:text-gray-300">↑↓</strong> to navigate</span>
             <span><strong className="font-medium text-gray-700 dark:text-gray-300">Enter</strong> to select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
