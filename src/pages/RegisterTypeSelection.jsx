import { Link } from 'react-router-dom';
import './RegisterTypeSelection.css';

const RegisterTypeSelection = () => {
    return (
        <div className="register-type-page">
            <div className="register-container">
                <div className="register-header">
                    <h1 className="register-title">Cum dorești să te înregistrezi?</h1>
                    <p className="register-subtitle">Alege tipul de cont care ți se potrivește</p>
                </div>

                <div className="register-cards-wrapper">
                    {/* Client Card */}
                    <div className="register-card">
                        <div className="register-card-icon">🧺</div>
                        <h2>Vreau să fiu Client</h2>
                        <p>Doresc să cumpăr produse proaspete și naturale direct de la producătorii locali.</p>
                        <ul className="register-benefits">
                            <li>✓ Acces la produse locale</li>
                            <li>✓ Livrare la domiciliu</li>
                            <li>✓ Abonamente lunare</li>
                        </ul>
                        <Link to="#" className="btn btn-primary btn-block">
                            Creează Cont Client
                        </Link>
                    </div>

                    {/* Producer Card */}
                    <div className="register-card producer-card">
                        <div className="register-card-icon">🚜</div>
                        <h2>Vreau să fiu Producător</h2>
                        <p>Sunt producător local și vreau să îmi vând produsele către comunitate.</p>
                        <ul className="register-benefits">
                            <li>✓ Magazin online propriu</li>
                            <li>✓ Gestionare comenzi</li>
                            <li>✓ Vizibilitate crescută</li>
                        </ul>
                        <Link to="/inregistrare/producator" className="btn btn-secondary btn-block">
                            Devino Partener
                        </Link>
                    </div>
                </div>

                <div className="register-footer-link">
                    <Link to="/autentificare">← Înapoi la Autentificare</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterTypeSelection;
