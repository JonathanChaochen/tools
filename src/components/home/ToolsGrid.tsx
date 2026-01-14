import React from 'react';
import { Braces, FileText, ArrowLeftRight } from 'lucide-react';
import { ToolCard } from '../ui/ToolCard';

const tools = [
  {
    icon: Braces,
    title: 'JSON Formatter',
    description: 'Clean, format, and validate your JSON data instantly with syntax highlighting.',
    href: '/json-formatter',
  },
  {
    icon: FileText,
    title: 'Markdown Previewer',
    description: 'Real-time markdown rendering to preview your documentation and README files.',
    href: '/markdown-preview',
  },
  {
    icon: ArrowLeftRight,
    title: 'Base64 Converter',
    description: 'Quickly encode or decode strings and files to and from Base64 format.',
    href: '/base64-converter',
  },
];

export const ToolsGrid: React.FC = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            href={tool.href}
          />
        ))}
      </div>
    </section>
  );
};
