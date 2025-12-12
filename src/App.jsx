import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProductSection from './components/ProductSection';
import ProducersTeaser from './components/ProducersTeaser';
import Footer from './components/Footer';
import ProducersPage from './pages/ProducersPage';
import ProducerDetails from './pages/ProducerDetails';
import SubscriptionPage from './pages/SubscriptionPage';
import AuthSelectionPage from './pages/AuthSelectionPage';
import RegisterTypeSelection from './pages/RegisterTypeSelection';
import ProducerRegisterPage from './pages/ProducerRegisterPage';
import UserRegisterPage from './pages/UserRegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ClientProfilePage from './pages/ClientProfilePage';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function Home() {
  return (
    <div className="app">
      <HeroSection />
      <AboutSection />
      <div id="products">
        <ProductSection />
      </div>
      <ProducersTeaser />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producatori" element={<ProducersPage />} />
        <Route path="/producatori/:id" element={<ProducerDetails />} />
        <Route path="/producatori/:id/abonament" element={<SubscriptionPage />} />
        <Route path="/autentificare" element={<AuthSelectionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inregistrare" element={<RegisterTypeSelection />} />
        <Route path="/inregistrare/client" element={<UserRegisterPage />} />
        <Route path="/inregistrare/producator" element={<ProducerRegisterPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/profil-client" element={<ClientProfilePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
