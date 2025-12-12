
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './ProfilePage.css'; // Reuse styles

const ClientProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form states
    const [personalInfo, setPersonalInfo] = useState({
        displayName: '',
        phone: '',
        email: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: ''
    });

    // Image state for client
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const data = await api.getCurrentUser(token);
            const userData = data.user;

            // Role check for client
            if (userData.role !== 'user') {
                navigate('/');
                return;
            }

            // Check localStorage for persisted client-side image
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            if ((!userData.imageUrl && !userData.image_url) && (storedUser.imageUrl || storedUser.image_url)) {
                userData.imageUrl = storedUser.imageUrl || storedUser.image_url;
            }

            // Sync merged data back to localStorage
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);

            setPersonalInfo({
                displayName: userData.fullName || userData.full_name,
                phone: userData.phone || '',
                email: userData.email
            });

            setImageUrl(userData.imageUrl || '');

        } catch (err) {
            setError('Nu s-au putut încărca datele profilului.');
        } finally {
            setLoading(false);
        }
    };

    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            // Update basic user info
            const updateData = {
                fullName: personalInfo.displayName,
                phone: personalInfo.phone
            };

            await api.updateProfile(user.id, updateData);

            let updatedUser = { ...user, ...updateData };

            // Handle Image Update (Client side mainly for now)
            if (imageUrl) {
                updatedUser.imageUrl = imageUrl;
            }

            setSuccessMsg('Datele au fost actualizate cu succes!');

            // Update local storage user for Header updates
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('auth-change'));

            // Update local state
            setUser(updatedUser);

        } catch (err) {
            setError(err.message || 'Eroare la actualizarea profilului');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            await api.changePassword(passwordData);
            setSuccessMsg('Parola a fost schimbată cu succes!');
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (err) {
            setError(err.message || 'Eroare la schimbarea parolei');
        }
    };

    const handleImageUpdate = () => {
        const url = prompt('Introduceți URL-ul imagini de profil:', imageUrl);
        if (url !== null) {
            setImageUrl(url);
        }
    };

    if (loading) return <div className="loading-screen">Se încarcă profilul...</div>;
    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Header Section */}
                <div className="profile-header">
                    <div className="profile-avatar-wrapper">
                        {imageUrl ? (
                            <img src={imageUrl} alt="Profile" className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar">
                                {personalInfo.displayName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <button className="profile-avatar-edit" onClick={handleImageUpdate} title="Schimbă poza">
                            📷
                        </button>
                    </div>

                    <div className="profile-info">
                        <h1 className="profile-name">{personalInfo.displayName}</h1>
                        <span className="profile-role">Client Membru</span>
                    </div>
                </div>

                {/* Messages */}
                {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
                {successMsg && <div className="form-success" style={{ textAlign: 'center', color: 'green', marginBottom: '1rem', padding: '1rem', background: '#dcfce7', borderRadius: '8px' }}>{successMsg}</div>}

                <div className="settings-grid">
                    {/* Account Data */}
                    <div className="settings-card">
                        <h3>Datele Contului</h3>
                        <form onSubmit={handleInfoUpdate}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={personalInfo.email}
                                        disabled
                                        className="input-disabled"
                                        title="Adresa de email nu poate fi schimbată direct."
                                    />
                                    <small style={{ color: '#64748b', fontSize: '0.8rem' }}>Pentru schimbarea email-ului, contactați suportul.</small>
                                </div>

                                <div className="form-group">
                                    <label>Nume Complet</label>
                                    <input
                                        type="text"
                                        value={personalInfo.displayName}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, displayName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Număr de Telefon</label>
                                    <input
                                        type="tel"
                                        value={personalInfo.phone}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="profile-actions">
                                <button type="submit" className="btn btn-primary">
                                    Salvează Modificările
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security */}
                    <div className="settings-card">
                        <h3>Securitate</h3>
                        <form onSubmit={handlePasswordChange}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Parola Curentă</label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Parola Nouă</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>
                            <div className="profile-actions">
                                <button type="submit" className="btn btn-secondary">
                                    Schimbă Parola
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfilePage;
