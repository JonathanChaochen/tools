import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { JsonFormatter } from './pages/JsonFormatter';
import { MarkdownPreview } from './pages/MarkdownPreview';
import { Base64Converter } from './pages/Base64Converter';
import { TimestampConverter } from './pages/TimestampConverter';
import { RegexTester } from './pages/RegexTester';
import { JwtInspector } from './pages/JwtInspector';
import { CommandPalette } from './components/layout/CommandPalette';

function App() {
  return (
    <BrowserRouter>
      <CommandPalette />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/json-formatter" element={<JsonFormatter />} />
        <Route path="/markdown-preview" element={<MarkdownPreview />} />
        <Route path="/base64-converter" element={<Base64Converter />} />
        <Route path="/timestamp-converter" element={<TimestampConverter />} />
        <Route path="/regex-tester" element={<RegexTester />} />
        <Route path="/jwt-inspector" element={<JwtInspector />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
