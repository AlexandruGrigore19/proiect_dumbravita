import heroImage from '../assets/hero-dumbravita.jpg';
import './HeroSection.css';

const HeroSection = () => {
    return (
        <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="hero-overlay"></div>
            <div className="hero-content container">
                <span className="hero-badge">🌿 Proaspăt de la Sursă</span>
                <h1 className="hero-title">
                    Piața din Dumbro
                </h1>
                <p className="hero-subtitle">
                    Bunătățuri autentice din inima Dumbrăviței, direct de la producătorii locali.
                </p>
                <div className="hero-stats">
                    <div className="stat">
                        <span className="stat-number">50+</span>
                        <span className="stat-label">Producători Locali</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">100%</span>
                        <span className="stat-label">Produse Naturale</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">5★</span>
                        <span className="stat-label">Recenzii Clienți</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
