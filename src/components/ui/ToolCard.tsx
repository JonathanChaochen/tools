import React from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ icon: Icon, title, description, href }) => {
  return (
    <a
      href={href}
      className="group block h-full flex flex-col p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/20 hover:-translate-y-1"
    >
      <div className="flex-1">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4 transition-transform group-hover:scale-110 duration-300">
          <Icon size={24} strokeWidth={2} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white mt-auto group-hover:translate-x-1 transition-transform">
        Open Tool
        <ArrowRight size={16} className="ml-2 group-hover:ml-3 transition-all" />
      </div>
    </a>
  );
};
