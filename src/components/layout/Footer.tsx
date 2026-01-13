import React from 'react';
import { Github, Twitter, Coffee } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Built by Chao Chen. © 2026
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              A collection of experimental developer utilities.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              aria-label="Buy me a coffee"
            >
              <Coffee size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
