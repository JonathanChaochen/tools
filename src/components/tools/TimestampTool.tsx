import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';
import {
  parseDateInput,
  getUnixSeconds,
  getUnixMillis,
  getISOString,
  getLocalString,
  getUTCString,
} from '../../utils/dateUtils';

const PRESETS = [
  { label: 'Current Time', getValue: () => new Date() },
  { label: 'Unix Seconds (Now)', getValue: () => Math.floor(Date.now() / 1000).toString() },
  { label: 'Unix Millis (Now)', getValue: () => Date.now().toString() },
  { label: 'ISO 8601 (Now)', getValue: () => new Date().toISOString() },
];

export const TimestampTool: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [parsedDate, setParsedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { copy } = useClipboard();
  // We'll track which field was just copied to show the "Copied!" state on the correct button
  // useClipboard generic 'copied' state is simple boolean, for specific button feedback 
  // we might want a local tracker, but for now we'll rely on the simple hook or enhance it.
  // Actually, standard usage usually shows "Copied" on the triggering button. 
  // Let's stick to simple single state for MVP or check if generic hook supports IDs.
  // The current hook is simple boolean. For multiple buttons, it might flash all of them 
  // or we need a way to know which one.
  // Reviewing previous hooks: useClipboard returns { copy, paste, copied }.
  // 'copied' is a boolean. If we have 5 copy buttons, they will all say "Copied!" at once.
  // Improvement: Let's create a local wrapper or just accept the shared state for MVP simplicity 
  // or use a local state for the copied ID.
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    const success = await copy(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  useEffect(() => {
    if (!input.trim()) {
      setParsedDate(null);
      setError(null);
      return;
    }

    const date = parseDateInput(input);
    if (date) {
      setParsedDate(date);
      setError(null);
    } else {
      setParsedDate(null);
      setError('Invalid date format');
    }
  }, [input]);

  const setPreset = (getter: () => Date | string) => {
    const val = getter();
    if (val instanceof Date) {
      setInput(val.toISOString());
    } else {
      setInput(val);
    }
  };

  return (
    <div className="space-y-12">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-8">
        
        {/* Input Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter timestamp or date
          </label>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-3 font-mono text-lg bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400"
              placeholder="e.g. 1705267800 or 2024-01-14T21:30:00Z"
              spellCheck={false}
              autoFocus
            />
            {error && (
              <div className="absolute right-3 top-3.5 text-red-500 animate-pulse">
                <AlertCircle size={20} />
              </div>
            )}
          </div>
          
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setPreset(preset.getValue)}
                className="px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Output Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {parsedDate ? (
            <>
              <OutputField
                label="Unix Timestamp (seconds)"
                value={getUnixSeconds(parsedDate)}
                id="unix-sec"
                onCopy={handleCopy}
                copiedId={copiedId}
              />
              <OutputField
                label="Unix Timestamp (milliseconds)"
                value={getUnixMillis(parsedDate)}
                id="unix-ms"
                onCopy={handleCopy}
                copiedId={copiedId}
              />
              <OutputField
                label="ISO 8601 (UTC)"
                value={getISOString(parsedDate)}
                id="iso"
                onCopy={handleCopy}
                copiedId={copiedId}
              />
              <OutputField
                label="UTC String"
                value={getUTCString(parsedDate)}
                id="utc-str"
                onCopy={handleCopy}
                copiedId={copiedId}
              />
              <OutputField
                label="Local Time"
                value={getLocalString(parsedDate)}
                id="local"
                onCopy={handleCopy}
                copiedId={copiedId}
                fullWidth
              />
            </>
          ) : (
            <div className="col-span-1 md:col-span-2 py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-950/20">
              <Calendar size={48} className="mb-4 opacity-50" />
              <p>Enter a timestamp above to see conversions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface OutputFieldProps {
  label: string;
  value: string;
  id: string;
  onCopy: (value: string, id: string) => void;
  copiedId: string | null;
  fullWidth?: boolean;
}

const OutputField: React.FC<OutputFieldProps> = ({ label, value, id, onCopy, copiedId, fullWidth }) => {
  const isCopied = copiedId === id;
  
  return (
    <div className={`space-y-2 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
        <button
          onClick={() => onCopy(value, id)}
          className={`flex items-center text-xs font-medium transition-colors ${
            isCopied
              ? 'text-green-600 dark:text-green-400'
              : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
          }`}
        >
          {isCopied ? (
            <>
              <CheckCircle size={12} className="mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy size={12} className="mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
        {value}
      </div>
    </div>
  );
};
