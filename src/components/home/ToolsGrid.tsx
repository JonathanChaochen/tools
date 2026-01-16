import { Braces, FileText, ArrowLeftRight, Clock, Search, Shield } from 'lucide-react';
import { ToolCard } from '../ui/ToolCard';

const tools = [
  {
    icon: Clock,
    title: 'Timestamp Converter',
    description: 'Convert Unix timestamps, ISO 8601 strings and dates across timezones.',
    href: '/timestamp-converter',
  },
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
  {
    icon: Search,
    title: 'Regex Playground',
    description: 'Test regular expressions with live highlighting and capture groups.',
    href: '/regex-tester',
  },
  {
    icon: Shield,
    title: 'JWT Inspector',
    description: 'Decode tokens locally with header/payload breakdown and signature validation.',
    href: '/jwt-inspector',
  },
  {
    icon: Clock,
    title: 'Cron Helper',
    description: 'Parse, validate, and debug cron expressions with human-readable descriptions.',
    href: '/cron-helper',
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
