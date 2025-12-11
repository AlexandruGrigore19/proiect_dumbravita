import { Link } from 'react-router-dom';
import './ProducerRegisterPage.css';

const ProducerRegisterPage = () => {
    return (
        <div className="producer-register-page">
            <div className="register-form-container">
                <div className="form-header">
                    <h1 className="form-title">Devino Partener Producător</h1>
                    <p className="form-subtitle">Alătură-te comunității și vinde produsele tale locale.</p>
                </div>

                <form className="register-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Nume Complet</label>
                        <input type="text" id="fullName" placeholder="Ex: Popescu Ion" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Ex: ion.popescu@email.com" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Număr de Telefon</label>
                        <input type="tel" id="phone" placeholder="Ex: 0712 345 678" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Locația Fermei / Punct de Vânzare</label>
                        <input type="text" id="location" placeholder="Ex: Str. Principală nr. 10, Dumbrăvița" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parolă</label>
                        <input type="password" id="password" placeholder="Minim 8 caractere" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmă Parola</label>
                        <input type="password" id="confirmPassword" placeholder="Reintrodu parola" required />
                    </div>

                    <div className="form-group checkbox-group">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">Sunt de acord cu Termenii și Condițiile</label>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block btn-submit">
                        Creează Cont Producător
                    </button>
                </form>

                <div className="form-footer-link">
                    <Link to="/inregistrare">← Înapoi la Selecție</Link>
                </div>
            </div>
        </div>
    );
};

export default ProducerRegisterPage;
