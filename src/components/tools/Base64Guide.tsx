import React from 'react';
import { Lightbulb, FileCode, Lock, Link, Braces } from 'lucide-react';

const cases = [
  {
    icon: FileCode,
    title: 'Data URIs',
    description: 'Convert small assets into strings for embedding in CSS or HTML.'
  },
  {
    icon: Lock,
    title: 'Basic Auth',
    description: 'Generate credentials for HTTP Authorization headers.'
  },
  {
    icon: Link,
    title: 'URL Parameters',
    description: 'Safely pass complex data strings through URLs without encoding issues.'
  },
  {
    icon: Braces,
    title: 'JWT Debugging',
    description: 'Decode headers or payloads from JSON Web Tokens.'
  }
];

export const Base64Guide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <Lightbulb size={24} />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Common Use Cases</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cases.map((item) => (
          <div key={item.title} className="flex gap-4 p-5 bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex-shrink-0">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <item.icon size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
