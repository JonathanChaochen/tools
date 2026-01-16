import { useState, useEffect } from 'react';
import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';
import { Copy, AlertCircle, CheckCircle, Calendar, Clock } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';

export function CronTool() {
  const [expression, setExpression] = useState('*/5 * * * *');
  const [description, setDescription] = useState('');
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState('');
  
  const { copy } = useClipboard();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    const success = await copy(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const presets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 5 minutes', value: '*/5 * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Midnight daily', value: '0 0 * * *' },
    { label: 'At 2:30 AM', value: '30 2 * * *' },
    { label: 'Weekdays at 9 AM', value: '0 9 * * 1-5' },
  ];

  useEffect(() => {
    try {
      if (!expression.trim()) {
        setDescription('');
        setNextRuns([]);
        setError('');
        return;
      }

      const desc = cronstrue.toString(expression);
      setDescription(desc);

      // Use static parse method from v5
      const interval = CronExpressionParser.parse(expression);
      const runs = [];
      for (let i = 0; i < 5; i++) {
        runs.push(interval.next().toString());
      }
      setNextRuns(runs);
      setError('');
    } catch (err) {
      setError('Invalid cron expression');
      setDescription('');
      setNextRuns([]);
    }
  }, [expression]);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-8">
        
        {/* Input Section */}
        <div className="space-y-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Cron Expression
          </label>
          <div className="relative">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full pl-4 pr-12 py-3 font-mono text-lg bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400"
              placeholder="* * * * *"
              autoFocus
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {error ? (
                <div className="text-red-500 animate-pulse">
                  <AlertCircle size={20} />
                </div>
              ) : (
                <button
                  onClick={() => handleCopy(expression, 'input')}
                  className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Copy expression"
                >
                  {copiedId === 'input' ? (
                    <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center text-[10px] md:text-xs font-mono text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
             <div className="flex flex-col gap-1 items-center">
                <span className="font-bold text-gray-700 dark:text-gray-300">MINUTE</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">0-59</span>
             </div>
             <div className="flex flex-col gap-1 items-center">
                <span className="font-bold text-gray-700 dark:text-gray-300">HOUR</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">0-23</span>
             </div>
             <div className="flex flex-col gap-1 items-center">
                <span className="font-bold text-gray-700 dark:text-gray-300">DAY</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">1-31</span>
             </div>
             <div className="flex flex-col gap-1 items-center">
                <span className="font-bold text-gray-700 dark:text-gray-300">MONTH</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">1-12</span>
             </div>
             <div className="flex flex-col gap-1 items-center">
                <span className="font-bold text-gray-700 dark:text-gray-300">WEEK</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">0-6</span>
             </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setExpression(preset.value)}
                className="px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        {(description || nextRuns.length > 0) && !error ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4 md:col-span-2">
                <OutputField 
                  label="Human Readable"
                  value={description}
                  id="desc"
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  icon={<Clock size={16} className="text-blue-500" />}
                />
             </div>
             
             <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Next Executions
                </label>
                <div className="bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                  {nextRuns.map((run, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 last:border-0 font-mono text-sm text-gray-900 dark:text-gray-100"
                    >
                      <span className="w-5 h-5 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-900 text-gray-500 text-[10px] font-bold">
                        {index + 1}
                      </span>
                      {run}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        ) : (
           <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-950/20">
             <Calendar size={48} className="mb-4 opacity-50" />
             <p>Enter a cron expression above</p>
           </div>
        )}
      </div>
    </div>
  );
}

interface OutputFieldProps {
  label: string;
  value: string;
  id: string;
  onCopy: (value: string, id: string) => void;
  copiedId: string | null;
  icon?: React.ReactNode;
}

function OutputField({ label, value, id, onCopy, copiedId, icon }: OutputFieldProps) {
  const isCopied = copiedId === id;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {icon}
          {label}
        </label>
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
      <div className="p-3 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg font-medium text-lg text-gray-900 dark:text-gray-100 break-all">
        {value}
      </div>
    </div>
  );
}
