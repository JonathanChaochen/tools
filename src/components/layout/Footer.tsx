import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Built by Chao Chen. © 2026
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            A collection of experimental developer utilities.
          </p>
        </div>
      </div>
    </footer>
  );
};
