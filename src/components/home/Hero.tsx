import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="text-center py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
        Web Utilities
      </h1>
      <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
        A minimalist collection of essential tools for developers and designers.
        <br className="hidden sm:block" />
        Fast, private, and easy to use.
      </p>
    </section>
  );
};
