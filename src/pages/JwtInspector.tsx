import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { JwtTool } from '../components/tools/JwtTool';

export const JwtInspector = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />
      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Headline Section */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              JWT Inspector
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Decode JWTs locally with human-friendly expiry, claims explanations, and common warnings.
            </p>
          </div>

          {/* Tool Container */}
          <JwtTool />
        </div>
      </main>
      <Footer />
    </div>
  );
};
