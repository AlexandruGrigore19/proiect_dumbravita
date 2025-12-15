
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

    // My shops
    const [myShops, setMyShops] = useState([]);
    const [editingShop, setEditingShop] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    // Form states for personal info
    const [personalInfo, setPersonalInfo] = useState({
        displayName: '',
        phone: '',
        email: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: ''
    });

    // Shop form state
    const [shopForm, setShopForm] = useState({
        title: '',
        description: '',
        specialty: '',
        location: '',
        imageUrl: '',
        products: []
    });

    // File input ref
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

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            setPersonalInfo({
                displayName: userData.fullName || userData.full_name || '',
                phone: userData.phone || '',
                email: userData.email || ''
            });

            // Load my shops
            await loadMyShops();

        } catch (err) {
            setError('Nu s-au putut incarca datele profilului.');
        } finally {
            setLoading(false);
        }
    };

    const loadMyShops = async () => {
        try {
            const data = await api.getMyShops();
            const shops = Array.isArray(data) ? data : (data.data || data.shops || []);
            setMyShops(shops);
        } catch (err) {
            console.log('Could not load shops:', err);
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
            setShopForm({ ...shopForm, imageUrl: base64 });
        });
    };

    const handleProductImageUpload = (e, productId) => {
        handleFileUpload(e, (base64) => {
            setShopForm({
                ...shopForm,
                products: shopForm.products.map(p =>
                    p.id === productId ? { ...p, image: base64 } : p
                )
            });
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
        setShopForm({
            ...shopForm,
            products: [...shopForm.products, newProduct]
        });
    };

    const removeProduct = (productId) => {
        setShopForm({
            ...shopForm,
            products: shopForm.products.filter(p => p.id !== productId)
        });
    };

    const updateProduct = (productId, field, value) => {
        setShopForm({
            ...shopForm,
            products: shopForm.products.map(p =>
                p.id === productId ? { ...p, [field]: value } : p
            )
        });
    };

    const startNewShop = () => {
        setIsCreatingNew(true);
        setEditingShop(null);
        setShopForm({
            title: personalInfo.displayName || '',
            description: '',
            specialty: '',
            location: '',
            imageUrl: '',
            products: []
        });
    };

    const startEditShop = (shop) => {
        setEditingShop(shop);
        setIsCreatingNew(false);
        setShopForm({
            title: shop.name || shop.title || '',
            description: shop.description || '',
            specialty: shop.specialty || '',
            location: shop.location || '',
            imageUrl: shop.imageUrl || shop.image_url || '',
            products: shop.products || []
        });
    };

    const cancelEditing = () => {
        setIsCreatingNew(false);
        setEditingShop(null);
        setShopForm({
            title: '',
            description: '',
            specialty: '',
            location: '',
            imageUrl: '',
            products: []
        });
    };

    const handleSaveShop = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            const shopData = {
                name: shopForm.title,
                description: shopForm.description,
                specialty: shopForm.specialty,
                location: shopForm.location,
                // Try multiple field names for image
                imageUrl: shopForm.imageUrl,
                image_url: shopForm.imageUrl,
                image: shopForm.imageUrl,
                coverImage: shopForm.imageUrl,
                products: shopForm.products
            };

            let savedShopId;

            if (editingShop) {
                // UPDATE existing shop (PUT)
                await api.updateShop(editingShop.id, shopData);
                savedShopId = editingShop.id;
                setSuccessMsg('Shop-ul a fost actualizat cu succes!');
            } else {
                // CREATE new shop (POST)
                const result = await api.createShop(shopData);
                // Try to get the new shop ID from response
                savedShopId = result.shop?.id || result.id || result.shopId;
                setSuccessMsg('Shop-ul a fost creat si publicat cu succes!');
            }

            // Save products to localStorage (backend doesn't support products yet)
            if (savedShopId && shopForm.products.length > 0) {
                localStorage.setItem(`shop_products_${savedShopId}`, JSON.stringify(shopForm.products));
            } else if (savedShopId) {
                // Clear products if empty
                localStorage.removeItem(`shop_products_${savedShopId}`);
            }

            // Also save by name as fallback (in case we don't get ID back)
            if (shopForm.title && shopForm.products.length > 0) {
                localStorage.setItem(`shop_products_name_${shopForm.title}`, JSON.stringify(shopForm.products));
            }

            // Refresh shops list
            await loadMyShops();
            cancelEditing();

        } catch (err) {
            setError(err.message || 'Eroare la salvarea shop-ului');
        }
    };

    const handleDeleteShop = async (shopId) => {
        if (!window.confirm('Esti sigur ca vrei sa stergi acest shop?')) return;

        try {
            await api.deleteShop(shopId);
            setSuccessMsg('Shop-ul a fost sters!');
            await loadMyShops();
        } catch (err) {
            setError(err.message || 'Eroare la stergerea shop-ului');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            await api.changePassword(passwordData);
            setSuccessMsg('Parola a fost schimbata cu succes!');
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (err) {
            setError(err.message || 'Eroare la schimbarea parolei');
        }
    };

    if (loading) return <div className="loading-screen">Se incarca profilul...</div>;
    if (!user) return null;

    const showShopForm = isCreatingNew || editingShop;

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Header Section */}
                <div className="profile-header">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {personalInfo.displayName ? personalInfo.displayName.charAt(0).toUpperCase() : 'P'}
                        </div>
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{personalInfo.displayName || 'Producator'}</h1>
                        <span className="profile-role">Partener Producator</span>
                    </div>
                </div>

                {/* Messages */}
                {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
                {successMsg && <div className="form-success" style={{ textAlign: 'center', color: 'green', marginBottom: '1rem', padding: '1rem', background: '#dcfce7', borderRadius: '8px' }}>{successMsg}</div>}

                <div className="settings-grid">
                    {/* MY SHOPS SECTION */}
                    <div className="settings-card full-width-card">
                        <h3>🛒 Shop-urile Mele</h3>
                        <p className="card-subtitle">Creaza si gestioneaza shop-urile tale care vor aparea pe pagina Producatori.</p>

                        {/* List of existing shops */}
                        {myShops.length > 0 && !showShopForm && (
                            <div className="my-announcements-list">
                                {myShops.map(shop => (
                                    <div key={shop.id} className="announcement-item">
                                        <div className="announcement-item-image">
                                            {(shop.imageUrl || shop.image_url) ? (
                                                <img src={shop.imageUrl || shop.image_url} alt={shop.name || shop.title} />
                                            ) : (
                                                <div className="placeholder-thumb">📷</div>
                                            )}
                                        </div>
                                        <div className="announcement-item-info">
                                            <h4>{shop.name || shop.title}</h4>
                                            <p>{shop.description?.substring(0, 100)}...</p>
                                            <span className="announcement-badge">{shop.specialty || 'Produse'}</span>
                                        </div>
                                        <div className="announcement-item-actions">
                                            <button className="btn btn-outline" onClick={() => startEditShop(shop)}>
                                                ✏️ Editeaza
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDeleteShop(shop.id)}>
                                                🗑️ Sterge
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Create new button */}
                        {!showShopForm && (
                            <button className="btn btn-add-product" onClick={startNewShop} style={{ marginTop: '1rem' }}>
                                ➕ Creaza Shop Nou
                            </button>
                        )}

                        {/* Shop Form */}
                        {showShopForm && (
                            <form onSubmit={handleSaveShop} className="announcement-form">
                                <div className="form-header-row">
                                    <h4>{editingShop ? '✏️ Editeaza Shop-ul' : '➕ Shop Nou'}</h4>
                                    <button type="button" className="btn-cancel" onClick={cancelEditing}>✕ Anuleaza</button>
                                </div>

                                {/* Preview */}
                                <div className="announcement-preview">
                                    <h5>Previzualizare</h5>
                                    <div className="producer-card-preview">
                                        <div className="preview-image-section">
                                            {shopForm.imageUrl ? (
                                                <img src={shopForm.imageUrl} alt="Preview" />
                                            ) : (
                                                <div className="placeholder-image">📷 Adauga o imagine</div>
                                            )}
                                        </div>
                                        <div className="preview-content">
                                            <h3>{shopForm.title || 'Titlu Shop'}</h3>
                                            <span className="preview-badge">{shopForm.specialty || 'Specialitate'}</span>
                                            <p className="preview-desc">{shopForm.description || 'Descrierea ta...'}</p>
                                            <p className="preview-location">📍 {shopForm.location || 'Locatia'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="announcement-editor">
                                    <div className="editor-section">
                                        <label className="section-label">Imagine Principala</label>
                                        <div className="image-upload-area">
                                            {shopForm.imageUrl && (
                                                <div className="current-image">
                                                    <img src={shopForm.imageUrl} alt="Current" />
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
                                                    📁 Incarca din Fisiere
                                                </button>
                                                <button type="button" className="btn btn-outline" onClick={() => {
                                                    const url = prompt('Introdu URL-ul imaginii:', shopForm.imageUrl);
                                                    if (url !== null) setShopForm({ ...shopForm, imageUrl: url });
                                                }}>
                                                    🔗 Adauga din URL
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="editor-section">
                                        <label className="section-label">Titlu Shop</label>
                                        <input
                                            type="text"
                                            value={shopForm.title}
                                            onChange={(e) => setShopForm({ ...shopForm, title: e.target.value })}
                                            placeholder="Ex: Ferma Bunicii Maria"
                                            required
                                        />
                                    </div>

                                    <div className="editor-section">
                                        <label className="section-label">Specialitate (pentru badge)</label>
                                        <input
                                            type="text"
                                            value={shopForm.specialty}
                                            onChange={(e) => setShopForm({ ...shopForm, specialty: e.target.value })}
                                            placeholder="Ex: Legume Bio, Miere, Lactate"
                                        />
                                    </div>

                                    <div className="editor-section">
                                        <label className="section-label">Descriere</label>
                                        <textarea
                                            value={shopForm.description}
                                            onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                                            rows="4"
                                            placeholder="Povesteste despre produsele tale..."
                                            className="form-textarea"
                                        />
                                    </div>

                                    <div className="editor-section">
                                        <label className="section-label">Locatie</label>
                                        <input
                                            type="text"
                                            value={shopForm.location}
                                            onChange={(e) => setShopForm({ ...shopForm, location: e.target.value })}
                                            placeholder="Ex: Strada Principala 10, Dumbravita"
                                        />
                                    </div>

                                    {/* Products */}
                                    <div className="editor-section products-section">
                                        <label className="section-label">Produse</label>

                                        {shopForm.products.length === 0 ? (
                                            <p className="no-products-text">Nu ai adaugat produse inca.</p>
                                        ) : (
                                            <div className="products-list-editor">
                                                {shopForm.products.map((product, index) => (
                                                    <div key={product.id} className="product-edit-card">
                                                        <div className="product-edit-header">
                                                            <span>Produs #{index + 1}</span>
                                                            <button type="button" className="btn-remove" onClick={() => removeProduct(product.id)}>
                                                                ✕ Sterge
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
                                                                    Incarca
                                                                </button>
                                                            </div>
                                                            <div className="product-fields">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Nume produs"
                                                                    value={product.name}
                                                                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Descriere scurta"
                                                                    value={product.description}
                                                                    onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Pret (ex: 12 lei/kg)"
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
                                            ➕ Adauga Produs
                                        </button>
                                    </div>
                                </div>

                                <div className="profile-actions" style={{ marginTop: '2rem' }}>
                                    <button type="submit" className="btn btn-primary btn-large">
                                        {editingShop ? '💾 Salveaza Modificarile' : '🚀 Publica Shop-ul'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Account Data */}
                    <div className="settings-card">
                        <h3>Datele Contului</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={personalInfo.email} disabled className="input-disabled" />
                            </div>
                            <div className="form-group">
                                <label>Nume</label>
                                <input type="text" value={personalInfo.displayName} disabled className="input-disabled" />
                            </div>
                            <div className="form-group">
                                <label>Telefon</label>
                                <input type="tel" value={personalInfo.phone} disabled className="input-disabled" />
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="settings-card">
                        <h3>Securitate</h3>
                        <form onSubmit={handlePasswordChange}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Parola Curenta</label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Parola Noua</label>
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
                                    Schimba Parola
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
