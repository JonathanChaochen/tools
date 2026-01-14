import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Base64Tool } from '../components/tools/Base64Tool';
import { Base64Guide } from '../components/tools/Base64Guide';

export const Base64Converter = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />
      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Headline Section */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              Base64 Converter
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Easily encode text to Base64 format or decode Base64 strings back to plain text.
            </p>
          </div>

          {/* Tool Container */}
          <Base64Tool />

          {/* Guide Section */}
          <div className="pt-8">
            <Base64Guide />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
