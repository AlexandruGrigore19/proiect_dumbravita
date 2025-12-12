
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await api.login(formData);

            // Save token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user)); // Useful for quick UI updates

            // Dispatch a custom event 
            window.dispatchEvent(new Event('auth-change'));

            // Redirect to home
            navigate('/');
        } catch (err) {
            setError(err.message || 'Autentificare eșuată');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-container">
                <div className="form-header">
                    <h1 className="form-title">Bine ai venit!</h1>
                    <p className="form-subtitle">Autentifică-te în contul tău.</p>
                </div>

                {error && <div className="form-error">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Ex: user@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parolă</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Introdu parola"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-submit"
                        disabled={loading}
                    >
                        {loading ? 'Se încarcă...' : 'Autentificare'}
                    </button>
                </form>

                <div className="form-footer-link">
                    <p>Nu ai cont? <Link to="/inregistrare">Înregistrează-te</Link></p>
                    <br />
                    <Link to="/autentificare">← Înapoi la Selecție</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
