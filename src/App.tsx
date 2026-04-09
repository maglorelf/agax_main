import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LichessRegistration } from './pages/LichessRegistration';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro-lichess" element={<LichessRegistration />} />
          <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
