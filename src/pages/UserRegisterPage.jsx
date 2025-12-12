
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './UserRegisterPage.css';

const UserRegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Parolele nu coincid.');
            setLoading(false);
            return;
        }

        try {
            // Prepare data for API (exclude confirmPassword)
            const apiData = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            };

            const data = await api.registerUser(apiData);

            // Save token and user
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            window.dispatchEvent(new Event('auth-change'));

            navigate('/');
        } catch (err) {
            setError(err.message || 'Înregistrare eșuată');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-register-page">
            <div className="register-form-container">
                <div className="form-header">
                    <h1 className="form-title">Creează Cont Client</h1>
                    <p className="form-subtitle">Bucură-te de produse proaspete, direct la tine acasă.</p>
                </div>

                {error && <div className="form-error">{error}</div>}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Nume Complet</label>
                        <input
                            type="text"
                            id="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Ex: Popescu Ion"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Ex: ion.popescu@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Număr de Telefon (Opțional)</label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Ex: 0712 345 678"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parolă</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minim 8 caractere"
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmă Parola</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Reintrodu parola"
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', display: 'flex' }}>
                        <input type="checkbox" id="terms" required style={{ width: 'auto' }} />
                        <label htmlFor="terms" style={{ fontWeight: 'normal' }}>Sunt de acord cu Termenii și Condițiile</label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-submit"
                        disabled={loading}
                    >
                        {loading ? 'Se creează contul...' : 'Creează Cont Client'}
                    </button>
                </form>

                <div className="form-footer-link">
                    <Link to="/inregistrare">← Înapoi la Selecție</Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegisterPage;
