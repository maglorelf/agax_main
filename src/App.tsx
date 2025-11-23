import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LichessRegistration } from './pages/LichessRegistration';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro-lichess" element={<LichessRegistration />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
