import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LichessRegistration } from './pages/LichessRegistration';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Directiva } from './pages/Directiva';
import { MemberSignup } from './pages/MemberSignup';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro-lichess" element={<LichessRegistration />} />
          <Route path="/alta-socio" element={<MemberSignup />} />
          <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
          <Route path="/directiva" element={<Directiva />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
