import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Shield, AlertTriangle, CheckCircle, Info, Clock, Lock } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useClipboard } from '../../hooks/useClipboard';
import { useTheme } from '../../hooks/useTheme';
import { decodeJwt, type DecodedJwt } from '../../utils/jwt';

// Dummy example tokens (structurally valid but fake content)
const EXAMPLE_TOKENS = {
  valid: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjQ2OTk5OTk5OTksInJvbGUiOiJhZG1pbiJ9.SignatureShouldBeHereButWeDoNotVerify`,
  expired: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleHBpcmVkX3VzZXIiLCJuYW1lIjoiamFuZV9kb2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyMn0.Signature`,
  future: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmdXR1cmVfdXNlciIsIm5hbWUiOiJ0aW1lX3RyYXZlbGVyIiwiaWF0Ijo0Njk5OTk5OTk5LCJuYmYiOjQ3MDAwMDAwMDB9.Signature`
};

export const JwtTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [isValid, setIsValid] = useState(false);
  const { copy, paste } = useClipboard();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const customHighlightStyle = {
    margin: 0,
    padding: '1rem',
    fontSize: '0.875rem',
    background: isDarkMode ? 'rgb(17 24 39)' : 'rgb(249 250 251)',
    borderRadius: '0.5rem',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = decodeJwt(input);
      setDecoded(result);
      setIsValid(!!result);
    }, 200);
    return () => clearTimeout(timer);
  }, [input]);

  // Derived state for warnings and attributes
  const payload = decoded?.payload || {};
  const header = decoded?.header || {};
  
  const now = Math.floor(Date.now() / 1000);
  const exp = payload.exp;
  const nbf = payload.nbf;
  const iat = payload.iat;
  
  const isExpired = exp ? now > exp : false;
  const isActive = nbf ? now >= nbf : true; // Active if nbf is past or undefined
  
  // Warnings Logic
  const warnings = [];
  if (header.alg === 'none' || !header.alg) warnings.push({ type: 'danger', msg: 'Algorithm is "none" or missing. Token is insecure.' });
  if (!exp) warnings.push({ type: 'warning', msg: 'Token has no expiry (exp). It may last forever.' });
  if (exp && exp - now > 30 * 24 * 3600) warnings.push({ type: 'warning', msg: 'Expiry is more than 30 days in the future.' });
  if (nbf && now < nbf) warnings.push({ type: 'info', msg: 'Token is not active yet (nbf is in future).' });
  if (Object.keys(payload).length > 50) warnings.push({ type: 'warning', msg: 'Large payload detected. Avoid storing PII in JWT.' });
  
  // Format Time Helper
  const formatTime = (timestamp: number) => {
    // Basic check for ms timestamps (if > year 3000 in seconds, assume ms)
    let ts = timestamp;
    if (ts > 32503680000) { // Year 3000
       ts = Math.floor(ts / 1000);
    }
    
    const date = new Date(ts * 1000);
    const relativeSeconds = ts - now;
    const abs = date.toLocaleString();
    
    let relative = '';
    if (relativeSeconds > 0) {
      const h = Math.floor(relativeSeconds / 3600);
      const m = Math.floor((relativeSeconds % 3600) / 60);
      relative = `in ${h}h ${m}m`;
    } else {
       relative = `${Math.abs(Math.floor(relativeSeconds / 60))}m ago`;
    }
    
    return { abs, relative, date };
  };

  const clearAll = () => {
    setInput('');
    setDecoded(null);
  };
  
  const handlePaste = async () => {
     const text = await paste();
     if (text) setInput(text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT: Input & Config */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-4">
           <div className="flex justify-between items-center">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Encoded Token</label>
             <div className="flex gap-2">
               <button onClick={clearAll} className="text-xs flex items-center text-gray-500 hover:text-red-500 transition-colors">
                 <Trash2 size={12} className="mr-1" /> Clear
               </button>
             </div>
           </div>
           
           <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="w-full h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y text-gray-900 dark:text-gray-100 break-all"
             placeholder="Paste your JWT here (header.payload.signature)..."
           />
           
           <div className="flex justify-between items-center pt-2">
             <div className="flex gap-2">
                <button onClick={() => setInput(EXAMPLE_TOKENS.valid)} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400">Valid</button>
                <button onClick={() => setInput(EXAMPLE_TOKENS.expired)} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400">Expired</button>
             </div>
             <button onClick={handlePaste} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">Paste from Clipboard</button>
           </div>
           
           <div className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
             <Lock size={10} />
             All decoding happens locally. Tokens are never sent to a server.
           </div>
        </div>
        
        {/* Warnings Panel */}
        {isValid && warnings.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              Warnings
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
              {warnings.map((w, i) => (
                <li key={i}>{w.msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RIGHT: Decoded Output */}
      <div className="space-y-6">
        {/* Summary Panel */}
        {isValid && payload ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-4">
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
               <div className="flex flex-col items-center">
                 <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</span>
                 {isExpired 
                   ? <span className="flex items-center text-red-600 dark:text-red-400 font-bold text-sm"><AlertTriangle size={14} className="mr-1" /> Expired</span>
                   : isActive 
                     ? <span className="flex items-center text-green-600 dark:text-green-400 font-bold text-sm"><CheckCircle size={14} className="mr-1" /> Active</span>
                     : <span className="flex items-center text-yellow-600 dark:text-yellow-400 font-bold text-sm"><Clock size={14} className="mr-1" /> Not Active</span>
                 }
               </div>
               
               <div className="flex flex-col items-center">
                 <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Algorithm</span>
                 <span className="font-mono text-sm font-semibold">{header.alg || 'None'}</span>
               </div>
               
               <div className="flex flex-col items-center">
                 <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Expires</span>
                 {exp ? (
                   <span className="text-sm font-medium" title={formatTime(exp).abs}>{formatTime(exp).relative}</span>
                 ) : (
                   <span className="text-sm text-gray-400 text-xs">Never</span>
                 )}
               </div>
               
               <div className="flex flex-col items-center">
                 <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type</span>
                 <span className="font-mono text-sm font-semibold">{header.typ || 'JWT'}</span>
               </div>
             </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-12 text-center text-gray-400">
             <Shield size={48} className="mx-auto mb-4 opacity-20" />
             <p>Paste a token to see details</p>
          </div>
        )}

        {/* Decoded Sections */}
        {isValid && decoded && (
          <div className="space-y-4">
            {/* Header */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
               <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                 <h3 className="text-xs font-bold text-gray-500 uppercase">Header</h3>
                 <button onClick={() => copy(JSON.stringify(header, null, 2))} className="text-gray-400 hover:text-blue-500 transition-colors">
                   <Copy size={14} />
                 </button>
               </div>
               <SyntaxHighlighter language="json" style={isDarkMode ? vscDarkPlus : oneLight} customStyle={customHighlightStyle}>
                 {JSON.stringify(header, null, 2)}
               </SyntaxHighlighter>
            </div>
            
            {/* Payload */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
               <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                 <h3 className="text-xs font-bold text-gray-500 uppercase">Payload</h3>
                 <button onClick={() => copy(JSON.stringify(payload, null, 2))} className="text-gray-400 hover:text-blue-500 transition-colors">
                   <Copy size={14} />
                 </button>
               </div>
               <SyntaxHighlighter language="json" style={isDarkMode ? vscDarkPlus : oneLight} customStyle={customHighlightStyle}>
                 {JSON.stringify(payload, null, 2)}
               </SyntaxHighlighter>
            </div>
            
             {/* Signature */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
               <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                 <h3 className="text-xs font-bold text-gray-500 uppercase">Signature</h3>
                 <span className="text-xs text-gray-400">{decoded.signature.length} chars</span>
               </div>
               <div className="p-4 bg-gray-50 dark:bg-gray-950/50 font-mono text-xs break-all text-gray-500 dark:text-gray-400">
                 {decoded.signature}
               </div>
            </div>
            
            {/* Claims Explanation */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
                 <Info size={16} className="mr-2" />
                 Claims Explanation
              </h3>
              <ul className="space-y-2 text-sm">
                 {exp && (
                   <li className="grid grid-cols-[40px_1fr]">
                     <span className="font-mono font-bold text-blue-700 dark:text-blue-400">exp</span>
                     <span className="text-gray-700 dark:text-gray-300">
                       Expires at <a href={`/timestamp-converter?t=${exp}`} className="text-blue-600 hover:underline" title="Click to convert">{formatTime(exp).abs}</a>
                     </span>
                   </li>
                 )}
                 {iat && (
                   <li className="grid grid-cols-[40px_1fr]">
                     <span className="font-mono font-bold text-blue-700 dark:text-blue-400">iat</span>
                     <span className="text-gray-700 dark:text-gray-300">
                       Issued at <a href={`/timestamp-converter?t=${iat}`} className="text-blue-600 hover:underline" title="Click to convert">{formatTime(iat).abs}</a>
                     </span>
                   </li>
                 )}
                 {nbf && (
                   <li className="grid grid-cols-[40px_1fr]">
                     <span className="font-mono font-bold text-blue-700 dark:text-blue-400">nbf</span>
                     <span className="text-gray-700 dark:text-gray-300">
                       Not valid before <a href={`/timestamp-converter?t=${nbf}`} className="text-blue-600 hover:underline" title="Click to convert">{formatTime(nbf).abs}</a>
                     </span>
                   </li>
                 )}
                 {payload.iss && <li className="grid grid-cols-[40px_1fr]"><span className="font-mono font-bold text-blue-700 dark:text-blue-400">iss</span> <span className="text-gray-700 dark:text-gray-300">Issuer: {payload.iss}</span></li>}
                 {payload.sub && <li className="grid grid-cols-[40px_1fr]"><span className="font-mono font-bold text-blue-700 dark:text-blue-400">sub</span> <span className="text-gray-700 dark:text-gray-300">Subject: {payload.sub}</span></li>}
                 {payload.aud && <li className="grid grid-cols-[40px_1fr]"><span className="font-mono font-bold text-blue-700 dark:text-blue-400">aud</span> <span className="text-gray-700 dark:text-gray-300">Audience: {payload.aud}</span></li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
