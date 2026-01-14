import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MarkdownTool } from '../components/tools/MarkdownTool';
import { MarkdownGuide } from '../components/tools/MarkdownGuide';

export const MarkdownPreview = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Headline Section */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              Markdown Previewer
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Write Markdown on the left and see the rendered HTML on the right in real-time. Fast, clean, and distraction-free.
            </p>
          </div>

          {/* Main Tool */}
          <MarkdownTool />

          {/* Guide Section */}
          <div className="max-w-4xl mx-auto pt-8">
            <MarkdownGuide />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
