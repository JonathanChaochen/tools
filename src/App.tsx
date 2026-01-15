import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { JsonFormatter } from './pages/JsonFormatter';
import { MarkdownPreview } from './pages/MarkdownPreview';
import { Base64Converter } from './pages/Base64Converter';
import { TimestampConverter } from './pages/TimestampConverter';
import { RegexTester } from './pages/RegexTester';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/json-formatter" element={<JsonFormatter />} />
        <Route path="/markdown-preview" element={<MarkdownPreview />} />
        <Route path="/base64-converter" element={<Base64Converter />} />
        <Route path="/timestamp-converter" element={<TimestampConverter />} />
        <Route path="/regex-tester" element={<RegexTester />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
