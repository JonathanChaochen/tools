import React, { useState } from 'react';
import { Clipboard, RefreshCw, Copy, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { encodeBase64, decodeBase64 } from '../../utils/base64';

type Mode = 'encode' | 'decode';

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setError(null);
    } catch {
      setError('Failed to read clipboard.');
    }
  };

  const handleConvert = () => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      setError('Failed to copy result.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-8">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => handleModeSwitch('encode')}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'encode'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => handleModeSwitch('decode')}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'decode'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {mode === 'encode' ? 'Input Text' : 'Base64 Input'}
          </label>
          <button
            onClick={handlePaste}
            className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <Clipboard size={16} className="mr-1.5" />
            Paste
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-36 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y text-gray-900 dark:text-gray-100 placeholder-gray-400"
          placeholder={mode === 'encode' ? "Type or paste your text here..." : "Paste Base64 string here..."}
          spellCheck={false}
        />
        {error && (
          <div className="flex items-center text-sm text-red-600 dark:text-red-400 mt-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={16} className="mr-1.5" />
            {error}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          className="flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-200 min-w-[200px]"
        >
          {mode === 'encode' ? <RefreshCw size={20} className="mr-2" /> : <ArrowRightLeft size={20} className="mr-2" />}
          {mode === 'encode' ? 'Encode to Base64' : 'Decode to Text'}
        </button>
      </div>

      {/* Output Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {mode === 'encode' ? 'Base64 Output' : 'Plain Text Result'}
          </label>
          <button
            onClick={handleCopy}
            disabled={!output}
            className={`flex items-center text-sm font-medium transition-colors ${
              output 
                ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <Copy size={16} className="mr-1.5" />
            Copy Result
          </button>
        </div>
        <div className="relative w-full min-h-[9rem] max-h-[20rem] overflow-auto p-4 font-mono text-sm bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-100 break-all whitespace-pre-wrap">
          {output ? (
            output
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 select-none pointer-events-none">
              Output will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
