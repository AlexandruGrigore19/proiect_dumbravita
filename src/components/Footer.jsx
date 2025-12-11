import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3 className="footer-logo">
                            <span className="footer-logo-icon">🌿</span>
                            Piața din Dumbro
                        </h3>
                        <p className="footer-desc">
                            Platforma comunității din Dumbrăvița, dedicată susținerii
                            producătorilor locali și a hranei sănătoase, naturale.
                        </p>
                    </div>
                    <div className="footer-links">
                        <h4 className="footer-title">Linkuri Utile</h4>
                        <ul className="footer-list">
                            <li><a href="#">Despre Noi</a></li>
                            <li><a href="#">Produse</a></li>
                            <li><a href="#">Producători</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-contact">
                        <h4 className="footer-title">Contact</h4>
                        <ul className="footer-list">
                            <li>📍 Strada Principală, Nr. 1</li>
                            <li>📍 Dumbrăvița, Timiș</li>
                            <li>📧 contact@piatadindumbro.ro</li>
                            <li>📞 0256 123 456</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 Piața din Dumbro. Creat cu ❤️ pentru comunitate.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
