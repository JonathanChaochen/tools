import React, { useState, useCallback } from 'react';
import { Clipboard, Wand2, Copy, AlertCircle, Lightbulb, Download, CheckCircle, Info } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useClipboard } from '../../hooks/useClipboard';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { getTextStats, formatNumber } from '../../utils/textStats';

const examples = [
  {
    title: 'Product List',
    description: 'A typical nested array of e-commerce items.',
    data: [
      { id: 101, name: "Wireless Headphones", price: 99.99, stock: true },
      { id: 102, name: "Mechanical Keyboard", price: 149.50, stock: false },
      { id: 103, name: "Gaming Mouse", price: 59.99, stock: true }
    ]
  },
  {
    title: 'User Profile',
    description: 'A flat object containing metadata and IDs.',
    data: {
      userId: "u_83726",
      username: "designer_01",
      email: "hello@design.co",
      preferences: { theme: "dark", notifications: true },
      lastLogin: "2026-03-15T10:30:00Z"
    }
  },
  {
    title: 'Config File',
    description: 'Settings for a web application project.',
    data: {
      appName: "Dashboard Pro",
      version: "2.1.0",
      features: { analytics: true, betaUsers: false },
      apiEndpoints: ["/api/v1", "/api/v2"]
    }
  },
  {
    title: 'Complex Nesting',
    description: 'Deeply nested objects and arrays.',
    data: {
      level1: {
        id: 1,
        children: [
          { level2: { id: 2, tags: ["a", "b"] } },
          { level2: { id: 3, meta: { active: true } } }
        ]
      }
    }
  }
];

export const JsonTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { copy, paste, copied } = useClipboard();
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Listen for theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handlePaste = async () => {
    const text = await paste();
    if (text) {
      setInput(text);
      setError(null);
      // Auto-format on paste if it's valid JSON
      tryAutoFormat(text);
    } else {
      setError('Failed to read clipboard. Please paste manually.');
    }
  };

  const tryAutoFormat = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch {
      // Silently fail - user can manually format
    }
  };

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some JSON to format.');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (err) {
      setError('Invalid JSON: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setOutput('');
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
  }, []);

  const handleCopy = async () => {
    if (!output) return;
    const success = await copy(output);
    if (!success) {
      setError('Failed to copy to clipboard.');
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadExample = (data: unknown) => {
    setInput(JSON.stringify(data));
    setOutput('');
    setError(null);
  };

  // Keyboard shortcuts
  useKeyboardShortcut({
    key: 'Enter',
    ctrl: true,
    callback: handleFormat,
  });

  useKeyboardShortcut({
    key: 'k',
    ctrl: true,
    callback: handleClear,
  });

  const inputStats = getTextStats(input);
  const outputStats = getTextStats(output);

  return (
    <div className="space-y-12">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-8">
        {/* Keyboard Shortcuts Info */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-300">
          <Info size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <strong>Keyboard shortcuts:</strong> <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded text-xs font-mono">Cmd/Ctrl + Enter</kbd> to format, <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded text-xs font-mono">Cmd/Ctrl + K</kbd> to clear
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Input</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                {formatNumber(inputStats.characters)} chars · {formatNumber(inputStats.lines)} lines
              </span>
              <button
                onClick={handlePaste}
                className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <Clipboard size={16} className="mr-1.5" />
                Paste
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y text-gray-900 dark:text-gray-100 placeholder-gray-400"
            placeholder='{"key": "value", "array": [1, 2, 3]}'
            spellCheck={false}
          />
          {error && (
            <div className="flex items-center text-sm text-red-600 dark:text-red-400 mt-2">
              <AlertCircle size={16} className="mr-1.5" />
              {error}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleFormat}
            className="flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-200 min-w-[200px]"
          >
            <Wand2 size={20} className="mr-2" />
            Format JSON
          </button>
        </div>

        {/* Output Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</label>
            <div className="flex items-center gap-3">
              {output && (
                <span className="text-xs text-gray-500">
                  {formatNumber(outputStats.characters)} chars · {formatNumber(outputStats.lines)} lines
                </span>
              )}
              <button
                onClick={handleDownload}
                disabled={!output}
                className={`flex items-center text-sm font-medium transition-colors ${
                  output 
                    ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Download JSON"
              >
                <Download size={16} className="mr-1.5" />
                Download
              </button>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`flex items-center text-sm font-medium transition-colors ${
                  output 
                    ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} className="mr-1.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="relative w-full min-h-[12rem] max-h-[30rem] overflow-auto border border-gray-200 dark:border-gray-800 rounded-lg">
            {output ? (
              <SyntaxHighlighter
                language="json"
                style={isDarkMode ? vscDarkPlus : oneLight}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.875rem',
                  background: isDarkMode ? 'rgb(3 7 18 / 0.5)' : 'rgb(249 250 251)',
                  borderRadius: '0.5rem',
                }}
                showLineNumbers={true}
                wrapLines={true}
              >
                {output}
              </SyntaxHighlighter>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 select-none bg-gray-50 dark:bg-gray-950/50">
                Formatted result will appear here...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Examples Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Lightbulb size={24} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Try these examples</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {examples.map((example) => (
            <button
              key={example.title}
              onClick={() => loadExample(example.data)}
              className="text-left p-4 bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group"
            >
              <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                {example.title}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {example.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
