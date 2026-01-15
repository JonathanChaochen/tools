import React, { useState, useEffect } from 'react';
import { Copy, Trash2, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';
import { RegexCheatsheet } from './regex/RegexCheatsheet';

type MatchGroup = {
  index: number;
  content: string;
};

type MatchResult = {
  index: number;
  content: string;
  groups: MatchGroup[];
  endIndex: number;
};

const DEFAULT_TEXT = `hello@example.com
support+regex@company.co.uk
123-456-7890
b0c1499c-e349-4787-9b65-6548d7c43632
https://example.com/path?query=1`;

const DEFAULT_PATTERN = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';

export const RegexTool: React.FC = () => {
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState(DEFAULT_TEXT);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [execTime, setExecTime] = useState<number>(0);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  
  const { copy, copied } = useClipboard();

  // Debounce logic could be added here, but for now we'll rely on useEffect dependency array
  // If performance becomes an issue with large text, we can add useDebounce

  useEffect(() => {
    const calculateMatches = () => {
      setError(null);
      setMatches([]);
      
      if (!pattern) return;

      const startTime = performance.now();
      
      try {
        // Validate regex first
        new RegExp(pattern, flags);
        
        const regex = new RegExp(pattern, flags);
        const newMatches: MatchResult[] = [];
        
        // Safety check for empty matches to prevent infinite loops
        // If the pattern matches an empty string (like ^, $, or *), we need to be careful
        
        let match;
        
        // If global flag is not set, standard exec only returns first match repeatedly if we don't handle it
        // actually standard exec returns null after first match if g is not set? 
        // No, if g is not set, exec always returns the first match.
        
        if (!flags.includes('g')) {
          match = regex.exec(text);
          if (match) {
             const groups: MatchGroup[] = [];
             // match is a RegExpExecArray
             // match[0] is the full match
             // match[1]... are capturing groups
             for (let i = 1; i < match.length; i++) {
               groups.push({ index: i, content: match[i] || '' });
             }
             newMatches.push({
               index: match.index,
               content: match[0],
               groups,
               endIndex: match.index + match[0].length
             });
          }
        } else {
          // Global search
          let loopCount = 0;
          const MAX_LOOPS = 10000; // Safety break
          
          while ((match = regex.exec(text)) !== null) {
            loopCount++;
            if (loopCount > MAX_LOOPS) {
              setError('Too many matches found. Execution stopped for safety.');
              break;
            }
            
            const groups: MatchGroup[] = [];
            for (let i = 1; i < match.length; i++) {
              groups.push({ index: i, content: match[i] || '' });
            }
            
            newMatches.push({
              index: match.index,
              content: match[0],
              groups,
              endIndex: match.index + match[0].length
            });
            
            // Handle zero-length matches to avoid infinite loops
            if (match[0].length === 0) {
              regex.lastIndex++;
            }
          }
        }
        
        setMatches(newMatches);
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Invalid Regular Expression');
        }
      } finally {
        setExecTime(performance.now() - startTime);
      }
    };

    const timer = setTimeout(calculateMatches, 200); // 200ms debounce
    return () => clearTimeout(timer);
  }, [pattern, flags, text]);

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const handleCopyJson = () => {
    copy(JSON.stringify(matches, null, 2));
  };
  
  const handleCopyRegex = () => {
    copy(`/${pattern}/${flags}`);
  };

  const clearAll = () => {
    setPattern('');
    setText('');
    setMatches([]);
    setError(null);
  };

  const setPreset = (presetName: string) => {
    switch (presetName) {
      case 'email':
        setPattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
        setFlags('gm');
        setText('Contact us at support@example.com or sales@example.co.uk');
        break;
      case 'url':
        setPattern('https?:\\/\\/[\\w\\-\\.]+(?::\\d+)?(?:\\/[\\w\\/_.#?&=]*)?');
        setFlags('gm');
        setText('Visit https://www.google.com or http://localhost:3000/api');
        break;
      case 'date':
        setPattern('(\\d{4})-(\\d{2})-(\\d{2})');
        setFlags('gm');
        setText('Events: 2024-01-15, 2024-12-25, 2025-01-01');
        break; 
      case 'uuid':
        setPattern('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}');
        setFlags('g');
        setText('User ID: 123e4567-e89b-12d3-a456-426614174000');
        break;
    }
  };

  // Rendering highlights
  // We need to render the text and insert highlighting spans
  const renderHighlightedText = () => {
    if (!text) return null;
    if (matches.length === 0) return <span className="text-gray-800 dark:text-gray-200">{text}</span>;

    const segments = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      // Overlaps are not handled by default in JS regex exec loop (it consumes characters)
      // So straightforward slicing works for non-overlapping matches
      
      // Text before match
      if (match.index > lastIndex) {
        segments.push(
          <span key={`text-${i}`} className="text-gray-800 dark:text-gray-200">
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Match itself
      segments.push(
        <span 
          key={`match-${i}`} 
          className="bg-blue-200 dark:bg-blue-900/60 text-blue-800 dark:text-blue-100 rounded-[2px] border-b-2 border-blue-400 dark:border-blue-500"
          title={`Match ${i + 1} at index ${match.index}`}
        >
          {match.content || <span className="text-xs opacity-50">[empty]</span>}
        </span>
      );

      lastIndex = match.endIndex;
    });

    // Remaining text
    if (lastIndex < text.length) {
      segments.push(
        <span key="text-end" className="text-gray-800 dark:text-gray-200">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return (
      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed break-all">
        {segments}
      </pre>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT COLUMN: Controls & Input */}
      <div className="space-y-6">
        
        {/* Regex Input Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2">
               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Regular Expression</label>
               <button 
                 onClick={() => setShowCheatsheet(!showCheatsheet)}
                 className={`ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                   showCheatsheet 
                   ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' 
                   : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                 }`}
                 title="Toggle Cheatsheet"
               >
                 <BookOpen size={14} />
                 Cheatsheet
               </button>
             </div>
             <div className="flex gap-2">
               <button onClick={() => setPreset('email')} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 transition-colors">Email</button>
               <button onClick={() => setPreset('url')} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 transition-colors">URL</button>
               <button onClick={() => setPreset('date')} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 transition-colors">Date</button>
             </div>
          </div>
          
          {/* Unified Regex Editor Container */}
          <div className={`bg-gray-50 dark:bg-gray-950 border rounded-xl overflow-hidden transition-all ${
            error 
            ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-200 dark:focus-within:ring-red-900/30' 
            : 'border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500'
          }`}>
            {/* Input Area */}
            <div className="flex items-start p-4 gap-3">
               <span className="text-gray-400 font-mono text-xl select-none pt-1">/</span>
               <textarea
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-grow font-mono text-lg bg-transparent border-none outline-none resize-y min-h-[60px] text-gray-900 dark:text-white placeholder-gray-400 p-0 leading-relaxed"
                placeholder="Enter regex pattern..."
                rows={1}
                spellCheck={false}
               />
               <span className="text-gray-400 font-mono text-xl select-none pt-1">/</span>
            </div>

            {/* Toolbar / Footer */}
            <div className="flex flex-wrap justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-1.5">
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2">Flags</span>
                 {['g', 'i', 'm', 's', 'u'].map(f => (
                   <button
                    key={f}
                    onClick={() => toggleFlag(f)}
                    className={`text-sm font-mono w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                      flags.includes(f) 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title={`Toggle flag ${f}`}
                   >
                     {f}
                   </button>
                 ))}
               </div>
               
               {error && (
                <div className="text-red-500 text-sm flex items-center animate-pulse">
                  <AlertCircle size={14} className="mr-1.5" />
                  <span className="truncate max-w-[200px]">{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test String Input */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-4 flex flex-col h-[300px]">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Text</label>
            <button 
              onClick={clearAll}
              className="text-xs flex items-center text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} className="mr-1" />
              Clear
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow w-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 dark:text-gray-100"
            placeholder="Enter text to match against..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Cheatsheet Drawer - Global Fixed Position */}
      {showCheatsheet && (
        <>
           {/* Backdrop */}
           <div 
             className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-[1px] z-40 transition-opacity" 
             onClick={() => setShowCheatsheet(false)}
           />
           {/* Drawer */}
           <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl transform transition-transform animate-in slide-in-from-right duration-200">
             <RegexCheatsheet 
               onClose={() => setShowCheatsheet(false)} 
               onInsert={(val) => setPattern(pattern + val)}
             />
           </div>
        </>
      )}

      {/* RIGHT COLUMN: Results */}
      <div className="space-y-6 relative">

        {/* Highlight View */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-4 flex flex-col h-[300px]">
           <div className="flex justify-between items-center">
             <div className="flex items-center gap-2">
               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Match Preview</label>
               {matches.length > 0 && (
                 <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                   {matches.length} matches
                 </span>
               )}
               <span className="text-xs text-gray-400">
                 {execTime.toFixed(1)}ms
               </span>
             </div>
             
             <button
               onClick={handleCopyRegex}
               className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
               title="Copy regex to clipboard"
             >
               {copied ? <CheckCircle size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
               {copied ? 'Copied' : 'Copy Regex'}
             </button>
           </div>
           
           <div className="flex-grow overflow-auto p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
             {renderHighlightedText()}
           </div>
        </div>

        {/* Match List */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-4 min-h-[200px]">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Match Details</label>
             <button
               onClick={handleCopyJson}
               disabled={matches.length === 0}
               className={`text-xs flex items-center ${matches.length === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 dark:text-blue-400 hover:underline'}`}
             >
               <Copy size={12} className="mr-1" />
               Copy Matches JSON
             </button>
          </div>

          <div className="max-h-[300px] overflow-auto space-y-2">
            {matches.length === 0 ? (
              <div className="text-center text-gray-400 py-8 italic">
                {error ? 'Fix errors to see matches' : 'No matches found'}
              </div>
            ) : (
              matches.map((match, i) => (
                <div key={i} className="text-sm border border-gray-100 dark:border-gray-800 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex gap-2 font-mono mb-1">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">#{i + 1}</span>
                    <span className="text-gray-500">[{match.index}-{match.endIndex}]</span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold truncate max-w-[200px]">{match.content}</span>
                  </div>
                  
                  {match.groups.length > 0 && (
                    <div className="pl-6 space-y-1 mt-1 border-l-2 border-gray-200 dark:border-gray-700 ml-1">
                      {match.groups.map(g => (
                         <div key={g.index} className="text-xs grid grid-cols-[20px_1fr] gap-2">
                           <span className="text-gray-400 font-mono">#{g.index}</span>
                           <span className="text-gray-700 dark:text-gray-300 font-mono break-all">{g.content}</span>
                         </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
