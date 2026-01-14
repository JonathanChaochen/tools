import React, { useState } from 'react';
import { Clipboard, Wand2, Copy, AlertCircle, Lightbulb } from 'lucide-react';

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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setError(null);
    } catch {
      setError('Failed to read clipboard. Please paste manually.');
    }
  };

  const handleFormat = () => {
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
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  };

  const loadExample = (data: unknown) => {
    setInput(JSON.stringify(data));
    setOutput('');
    setError(null);
  };

  return (
    <div className="space-y-12">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-8">
        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Input</label>
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
            className="w-full h-48 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y text-gray-900 dark:text-gray-100 placeholder-gray-400"
            placeholder={'{"key": "value", "array": [1, 2, 3]}'}
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
              Copy Output
            </button>
          </div>
          <div className="relative w-full min-h-[12rem] max-h-[30rem] overflow-auto p-4 font-mono text-sm bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-100">
            {output ? (
              <pre className="whitespace-pre-wrap break-words">{output}</pre>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 select-none">
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
