import { Header } from './components/layout/Header';
import { Hero } from './components/home/Hero';
import { ToolsGrid } from './components/home/ToolsGrid';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ToolsGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;
