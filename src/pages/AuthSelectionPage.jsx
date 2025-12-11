import { Link } from 'react-router-dom';
import './AuthSelectionPage.css';

const AuthSelectionPage = () => {
    return (
        <div className="auth-selection-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-title">Bine ai venit la Piața din Dumbro</h1>
                    <p className="auth-subtitle">Alege cum dorești să continui</p>
                </div>

                <div className="auth-cards-wrapper">
                    {/* Login Card */}
                    <div className="auth-card">
                        <div className="auth-card-icon">🔐</div>
                        <h2>Ai deja cont?</h2>
                        <p>Accesează contul tău pentru a vedea istoricul comenzilor și abonamentele active.</p>
                        <Link to="#" className="btn btn-primary btn-block">
                            Autentificare
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span>SAU</span>
                    </div>

                    {/* Sign Up Card */}
                    <div className="auth-card">
                        <div className="auth-card-icon">👋</div>
                        <h2>Ești nou aici?</h2>
                        <p>Creează un cont nou pentru a profita de produsele locale proaspete la tine acasă.</p>
                        <Link to="/inregistrare" className="btn btn-secondary btn-block">
                            Înscrie-te Acum
                        </Link>
                    </div>
                </div>

                <div className="auth-footer-link">
                    <Link to="/">← Înapoi la Magazin</Link>
                </div>
            </div>
        </div>
    );
};

export default AuthSelectionPage;
