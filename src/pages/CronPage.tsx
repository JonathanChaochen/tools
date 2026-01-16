import { CronTool } from '../components/tools/CronTool';
import { Clock } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export function CronPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Cron Expression Helper
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Parse, validate, and debug cron expressions with human-readable descriptions
              </p>
            </div>
          </div>

          <CronTool />
        </div>
      </main>
      <Footer />
    </div>
  );
}
