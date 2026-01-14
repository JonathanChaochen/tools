import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Trash2, CheckCircle } from 'lucide-react';

export const MarkdownTool: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Hello World
  
Start typing some **markdown** here...

- Item 1
- Item 2

> Blockquotes are also supported!

    const code = "is supported too";
`);
  const [copied, setCopied] = useState(false);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      setMarkdown('');
    }
  };

  const handleCopyHtml = async () => {
    // Basic HTML conversion (for the copy feature, we'll maintain the rendered output concept)
    // Note: react-markdown doesn't expose the HTML string directly easily without a ref/renderToStaticMarkup.
    // For simplicity efficiently, we will copy the *markdown* or we could use a ref to the preview container.
    // However, the requirement says "Copy HTML". We'll grab innerHTML from the preview div.
    const previewElement = document.getElementById('markdown-preview-content');
    if (previewElement) {
      try {
        await navigator.clipboard.writeText(previewElement.innerHTML);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[800px] lg:h-[600px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Workspace
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
            Clear
          </button>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
          <button
            onClick={handleCopyHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
          >
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Pane */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 min-h-[300px]">
          <div className="h-8 px-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Markdown Input
            </span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none resize-none placeholder-gray-400"
            placeholder="# Start typing..."
            spellCheck={false}
          />
        </div>

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col bg-gray-50/30 dark:bg-gray-900/50 min-h-[300px]">
          <div className="h-8 px-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Live Preview
            </span>
          </div>
          <div 
            id="markdown-preview-content"
            className="flex-1 p-6 overflow-y-auto prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800 prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:bg-gray-100 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400 prose-img:rounded-xl prose-img:shadow-sm prose-ul:marker:text-blue-500 dark:prose-ul:marker:text-blue-400 prose-hr:border-gray-200 dark:prose-hr:border-gray-800"
          >
            {markdown ? (
              <ReactMarkdown>
                {markdown}
              </ReactMarkdown>
            ) : (
                <div className="flex h-full items-center justify-center text-gray-400 italic">
                    Preview will appear here...
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
