
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
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

    const [producerInfo, setProducerInfo] = useState({
        location: '',
        imageUrl: '',
        description: '',
        specialty: ''
    });

    // Products state
    const [products, setProducts] = useState([]);

    // File input refs
    const mainImageRef = useRef(null);
    const productImageRefs = useRef({});

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

            if (userData.role !== 'producer') {
                navigate('/');
                return;
            }

            // Check localStorage for persisted data
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            if ((!userData.imageUrl && !userData.image_url) && (storedUser.imageUrl || storedUser.image_url)) {
                userData.imageUrl = storedUser.imageUrl || storedUser.image_url;
            }

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            setPersonalInfo({
                displayName: userData.fullName || userData.full_name || '',
                phone: userData.phone || '',
                email: userData.email || ''
            });

            const producer = userData.producer || {};
            setProducerInfo({
                location: producer.location || '',
                imageUrl: producer.imageUrl || producer.image_url || userData.imageUrl || '',
                description: producer.description || '',
                specialty: producer.specialty || ''
            });

            // Load products from localStorage (since API might not store them yet)
            const storedProducts = JSON.parse(localStorage.getItem(`producer_products_${userData.id}`) || '[]');
            setProducts(storedProducts);

        } catch (err) {
            setError('Nu s-au putut încărca datele profilului.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e, callback) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                callback(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMainImageUpload = (e) => {
        handleFileUpload(e, (base64) => {
            setProducerInfo({ ...producerInfo, imageUrl: base64 });
        });
    };

    const handleProductImageUpload = (e, productId) => {
        handleFileUpload(e, (base64) => {
            setProducts(products.map(p =>
                p.id === productId ? { ...p, image: base64 } : p
            ));
        });
    };

    const addProduct = () => {
        const newProduct = {
            id: Date.now(),
            name: '',
            description: '',
            price: '',
            image: ''
        };
        setProducts([...products, newProduct]);
    };

    const removeProduct = (productId) => {
        setProducts(products.filter(p => p.id !== productId));
    };

    const updateProduct = (productId, field, value) => {
        setProducts(products.map(p =>
            p.id === productId ? { ...p, [field]: value } : p
        ));
    };

    const handleSaveAnnouncement = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            const updateData = {
                fullName: personalInfo.displayName,
                phone: personalInfo.phone
            };

            await api.updateProfile(user.id, updateData);

            let updatedUser = { ...user, ...updateData };

            if (user.producer) {
                const producerData = {
                    location: producerInfo.location,
                    imageUrl: producerInfo.imageUrl,
                    description: producerInfo.description,
                    specialty: producerInfo.specialty
                };
                await api.updateProducer(user.producer.id, producerData);
                updatedUser.producer = { ...user.producer, ...producerData };
            }

            // Save products to localStorage
            localStorage.setItem(`producer_products_${user.id}`, JSON.stringify(products));

            setSuccessMsg('Anunțul a fost salvat cu succes!');
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('auth-change'));
            setUser(updatedUser);

        } catch (err) {
            setError(err.message || 'Eroare la salvarea anunțului');
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

    if (loading) return <div className="loading-screen">Se încarcă profilul...</div>;
    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Header Section */}
                <div className="profile-header">
                    <div className="profile-avatar-wrapper">
                        {producerInfo.imageUrl ? (
                            <img src={producerInfo.imageUrl} alt="Profile" className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar">
                                {personalInfo.displayName ? personalInfo.displayName.charAt(0).toUpperCase() : 'P'}
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{personalInfo.displayName || 'Producător'}</h1>
                        <span className="profile-role">Partener Producător</span>
                    </div>
                </div>

                {/* Messages */}
                {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
                {successMsg && <div className="form-success" style={{ textAlign: 'center', color: 'green', marginBottom: '1rem', padding: '1rem', background: '#dcfce7', borderRadius: '8px' }}>{successMsg}</div>}

                <div className="settings-grid">
                    {/* ANNOUNCEMENT BUILDER - First and most important */}
                    <div className="settings-card full-width-card announcement-builder">
                        <h3>🌿 Construiește-ți Anunțul</h3>
                        <p className="card-subtitle">Așa cum completezi aici, așa va arăta pe pagina Producători pentru toți vizitatorii.</p>

                        <form onSubmit={handleSaveAnnouncement}>
                            {/* Preview Card */}
                            <div className="announcement-preview">
                                <h4>Previzualizare Anunț</h4>
                                <div className="producer-card-preview">
                                    <div className="preview-image-section">
                                        {producerInfo.imageUrl ? (
                                            <img src={producerInfo.imageUrl} alt="Preview" />
                                        ) : (
                                            <div className="placeholder-image">📷 Adaugă o imagine</div>
                                        )}
                                    </div>
                                    <div className="preview-content">
                                        <h3>{personalInfo.displayName || 'Numele Tău'}</h3>
                                        <span className="preview-badge">{producerInfo.specialty || 'Produse Locale'}</span>
                                        <p className="preview-desc">{producerInfo.description || 'Descrierea ta va apărea aici...'}</p>
                                        <p className="preview-location">📍 {producerInfo.location || 'Locația ta'}</p>

                                        {products.length > 0 && (
                                            <div className="preview-products">
                                                <strong>Produse:</strong>
                                                <div className="mini-products-grid">
                                                    {products.slice(0, 3).map(p => (
                                                        <div key={p.id} className="mini-product">
                                                            {p.image && <img src={p.image} alt={p.name} />}
                                                            <span>{p.name || 'Produs'}</span>
                                                        </div>
                                                    ))}
                                                    {products.length > 3 && <span className="more-products">+{products.length - 3} altele</span>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Edit Fields */}
                            <div className="announcement-editor">
                                <div className="editor-section">
                                    <label className="section-label">Imagine Principală</label>
                                    <div className="image-upload-area">
                                        {producerInfo.imageUrl && (
                                            <div className="current-image">
                                                <img src={producerInfo.imageUrl} alt="Current" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={mainImageRef}
                                            onChange={handleMainImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <div className="upload-buttons">
                                            <button type="button" className="btn btn-outline" onClick={() => mainImageRef.current.click()}>
                                                📁 Încarcă din Fișiere
                                            </button>
                                            <button type="button" className="btn btn-outline" onClick={() => {
                                                const url = prompt('Introdu URL-ul imaginii:', producerInfo.imageUrl);
                                                if (url !== null) setProducerInfo({ ...producerInfo, imageUrl: url });
                                            }}>
                                                🔗 Adaugă din URL
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="editor-section">
                                    <label className="section-label">Numele Afișat</label>
                                    <input
                                        type="text"
                                        value={personalInfo.displayName}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, displayName: e.target.value })}
                                        placeholder="Ex: Ferma Bunicii Maria"
                                        required
                                    />
                                </div>

                                <div className="editor-section">
                                    <label className="section-label">Specialitatea Ta (pentru badge)</label>
                                    <input
                                        type="text"
                                        value={producerInfo.specialty}
                                        onChange={(e) => setProducerInfo({ ...producerInfo, specialty: e.target.value })}
                                        placeholder="Ex: Legume Bio, Miere, Lactate"
                                    />
                                </div>

                                <div className="editor-section">
                                    <label className="section-label">Descriere / Povestea Ta</label>
                                    <textarea
                                        value={producerInfo.description}
                                        onChange={(e) => setProducerInfo({ ...producerInfo, description: e.target.value })}
                                        rows="4"
                                        placeholder="Povestește-le clienților despre tine, ferma ta și pasiunea ta..."
                                        className="form-textarea"
                                    />
                                </div>

                                <div className="editor-section">
                                    <label className="section-label">Locație</label>
                                    <input
                                        type="text"
                                        value={producerInfo.location}
                                        onChange={(e) => setProducerInfo({ ...producerInfo, location: e.target.value })}
                                        placeholder="Ex: Strada Principală 10, Dumbrăvița"
                                    />
                                </div>

                                {/* Products Section */}
                                <div className="editor-section products-section">
                                    <label className="section-label">Produsele Tale</label>
                                    <p className="section-hint">Adaugă produsele pe care le vinzi. Fiecare produs va apărea în anunțul tău.</p>

                                    {products.length === 0 ? (
                                        <div className="no-products">
                                            <p>Nu ai adăugat niciun produs încă.</p>
                                        </div>
                                    ) : (
                                        <div className="products-list-editor">
                                            {products.map((product, index) => (
                                                <div key={product.id} className="product-edit-card">
                                                    <div className="product-edit-header">
                                                        <span>Produs #{index + 1}</span>
                                                        <button type="button" className="btn-remove" onClick={() => removeProduct(product.id)}>
                                                            ✕ Șterge
                                                        </button>
                                                    </div>
                                                    <div className="product-edit-content">
                                                        <div className="product-image-upload">
                                                            {product.image ? (
                                                                <img src={product.image} alt={product.name} />
                                                            ) : (
                                                                <div className="product-image-placeholder">📷</div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleProductImageUpload(e, product.id)}
                                                                style={{ display: 'none' }}
                                                                ref={el => productImageRefs.current[product.id] = el}
                                                            />
                                                            <button type="button" className="btn-small" onClick={() => productImageRefs.current[product.id]?.click()}>
                                                                Încarcă Poză
                                                            </button>
                                                        </div>
                                                        <div className="product-fields">
                                                            <input
                                                                type="text"
                                                                placeholder="Nume produs (ex: Roșii Cherry)"
                                                                value={product.name}
                                                                onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Descriere scurtă"
                                                                value={product.description}
                                                                onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Preț (ex: 12 lei/kg)"
                                                                value={product.price}
                                                                onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button type="button" className="btn btn-add-product" onClick={addProduct}>
                                        ➕ Adaugă Produs Nou
                                    </button>
                                </div>
                            </div>

                            <div className="profile-actions" style={{ marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary btn-large">
                                    💾 Salvează și Publică Anunțul
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Account Data - Secondary */}
                    <div className="settings-card">
                        <h3>Datele Contului</h3>
                        <form onSubmit={handleSaveAnnouncement}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={personalInfo.email}
                                        disabled
                                        className="input-disabled"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Telefon</label>
                                    <input
                                        type="tel"
                                        value={personalInfo.phone}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="profile-actions">
                                <button type="submit" className="btn btn-secondary">Salvează</button>
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

export default ProfilePage;
