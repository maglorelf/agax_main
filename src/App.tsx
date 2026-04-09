import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LichessRegistration } from './pages/LichessRegistration';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Directiva } from './pages/Directiva';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro-lichess" element={<LichessRegistration />} />
          <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
          <Route path="/directiva" element={<Directiva />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
