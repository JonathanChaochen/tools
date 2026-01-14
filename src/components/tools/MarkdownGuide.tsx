import React from 'react';
import { Lightbulb } from 'lucide-react';

const guideItems = [
  {
    title: 'Emphasis',
    examples: [
      { code: '**bold**', label: 'Bold' },
      { code: '*italic*', label: 'Italic' },
      { code: '~~strike~~', label: 'Strikethrough' },
    ]
  },
  {
    title: 'Lists',
    examples: [
      { code: '1. Item', label: 'Ordered' },
      { code: '- Item', label: 'Unordered' },
      { code: '- [ ] Task', label: 'Task List' },
    ]
  },
  {
    title: 'Links & Images',
    examples: [
      { code: '[Link](url)', label: 'Link' },
      { code: '![Alt](url)', label: 'Image' },
      { code: '`code`', label: 'Inline Code' },
    ]
  }
];

export const MarkdownGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <Lightbulb size={24} />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Markdown Guide</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guideItems.map((section) => (
          <div key={section.title} className="bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
            <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.examples.map((item) => (
                <div key={item.code} className="flex items-center justify-between text-sm">
                  <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-800 dark:text-gray-200 font-mono text-xs">
                    {item.code}
                  </code>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
