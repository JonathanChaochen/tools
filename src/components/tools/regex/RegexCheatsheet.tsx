import React from 'react';
import { Copy, CheckCircle, X } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

type Pattern = {
  label: string;
  value: string;
  description: string;
};

type Section = {
  title: string;
  items: Pattern[];
};

const CHEATSHEET_DATA: Section[] = [
  {
    title: 'Character Classes',
    items: [
      { label: 'Digit', value: '\\d', description: 'Any digit 0-9' },
      { label: 'Word Char', value: '\\w', description: 'Alphanumeric & underscore' },
      { label: 'Whitespace', value: '\\s', description: 'Space, tab, newline' },
      { label: 'Any Character', value: '.', description: 'Any char except newline' },
    ],
  },
  {
    title: 'Quantifiers',
    items: [
      { label: 'Zero or more', value: '*', description: 'Matches 0+ times' },
      { label: 'One or more', value: '+', description: 'Matches 1+ times' },
      { label: 'Optional', value: '?', description: 'Matches 0 or 1 time' },
      { label: 'Exact count', value: '{3}', description: 'Matches exactly 3 times' },
      { label: 'Range count', value: '{2,5}', description: 'Matches 2 to 5 times' },
    ],
  },
  {
    title: 'Anchors',
    items: [
      { label: 'Start of line', value: '^', description: 'Matches beginning of string/line' },
      { label: 'End of line', value: '$', description: 'Matches end of string/line' },
      { label: 'Word boundary', value: '\\b', description: 'Start/end of word' },
    ],
  },
  {
    title: 'Groups',
    items: [
      { label: 'Capture Group', value: '(...)', description: 'Captures match for extraction' },
      { label: 'Non-capturing', value: '(?:...)', description: 'Groups without capturing' },
      { label: 'Or / Alternate', value: 'a|b', description: 'Matches a or b' },
      { label: 'Character Set', value: '[abc]', description: 'Any char in brackets' },
      { label: 'Negated Set', value: '[^abc]', description: 'Any char NOT in brackets' },
    ],
  },
  {
    title: 'Common Recipes',
    items: [
      { label: 'Email', value: '[\\w.-]+@[\\w.-]+\\.[a-z]{2,}', description: 'Simple email validation' },
      { label: 'Date (YYYY-MM-DD)', value: '\\d{4}-\\d{2}-\\d{2}', description: 'ISO date format' },
      { label: 'Strong Password', value: '^(?=.*[A-Z])(?=.*\\d).{8,}$', description: 'At least 8 chars, 1 uppercase, 1 digit' },
      { label: 'URL', value: 'https?:\\/\\/[\\w\\-\\.]+(?:\\.[\\w\\-\\.]+)+', description: 'Basic http/https URL' },
    ],
  },
];

interface RegexCheatsheetProps {
  onClose: () => void;
  onInsert?: (pattern: string) => void;
}

export const RegexCheatsheet: React.FC<RegexCheatsheetProps> = ({ onClose, onInsert }) => {
  const { copy } = useClipboard();
  const [lastCopied, setLastCopied] = React.useState<string | null>(null);

  const handleCopy = async (text: string) => {
    await copy(text);
    setLastCopied(text);
    setTimeout(() => setLastCopied(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          Regex Cheatsheet
        </h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-500"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        { CHEATSHEET_DATA.map((section) => (
          <div key={section.title}>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </h4>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div 
                  key={item.label}
                  className="group bg-gray-50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-lg p-2 transition-all cursor-pointer"
                  onClick={() => onInsert ? onInsert(item.value) : handleCopy(item.value)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <code className="text-sm font-mono text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                      {item.value}
                    </code>
                    {lastCopied === item.value ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                    <span className="text-[10px] text-gray-400">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
