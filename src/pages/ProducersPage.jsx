import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './ProducersPage.css';

const ProducersPage = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    // Edit modal state
    const [editingShop, setEditingShop] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        specialty: '',
        location: '',
        imageUrl: '',
        products: []
    });
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState('');

    const mainImageRef = useRef(null);
    const productImageRefs = useRef({});

    useEffect(() => {
        // Check current user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            setLoading(true);
            // 1. Get list of shops
            const data = await api.getShops();
            const shopsList = Array.isArray(data) ? data : (data.data || data.shops || []);

            // 2. Enrich each shop with products from API
            const enrichedShops = await Promise.all(shopsList.map(async (shop) => {
                // Fetch products from API using GET /api/products/shop/:shopId
                let apiProducts = [];
                try {
                    const productData = await api.getProductsByShop(shop.id);
                    apiProducts = (productData.products || []).map(p => ({
                        ...p,
                        image: p.image_url || p.image
                    }));
                } catch (err) {
                    console.error(`Failed to fetch products for shop ${shop.id}:`, err);
                }

                // Get local image if exists
                let localImage = localStorage.getItem(`shop_image_${shop.id}`);

                return {
                    ...shop,
                    products: apiProducts,
                    localImageUrl: localImage
                };
            }));

            setShops(enrichedShops);
        } catch (err) {
            console.error("Failed to load shops", err);
            setError('Nu am putut incarca lista de shop-uri.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteShop = async (shopId, title) => {
        if (!window.confirm(`Esti sigur ca vrei sa stergi shop-ul "${title}"? Aceasta actiune nu poate fi anulata.`)) {
            return;
        }

        try {
            // Admin uses admin endpoint, regular users use normal endpoint
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role === 'admin') {
                await api.adminDeleteShop(shopId);
            } else {
                await api.deleteShop(shopId);
            }
            setShops(shops.filter(s => s.id !== shopId));
            // Clean up localStorage
            localStorage.removeItem(`shop_products_${shopId}`);
            localStorage.removeItem(`shop_image_${shopId}`);
            alert('Shop-ul a fost sters cu succes!');
        } catch (err) {
            alert('Eroare la stergerea shop-ului: ' + (err.message || 'Eroare necunoscuta'));
        }
    };

    // Check if current user owns this shop
    const isOwner = (shop) => {
        if (!currentUser) return false;
        // Check user_id match
        const shopUserId = shop.user_id || shop.userId || (shop.user && shop.user.id);
        return currentUser.id === shopUserId;
    };

    // Start editing a shop
    const startEditing = (shop) => {
        setEditingShop(shop);
        setEditForm({
            title: shop.name || shop.title || '',
            description: shop.description || '',
            specialty: shop.specialty || '',
            location: shop.location || '',
            imageUrl: shop.localImageUrl || shop.imageUrl || shop.image_url || shop.image || '',
            products: shop.products || []
        });
        setEditError('');
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingShop(null);
        setEditForm({
            title: '',
            description: '',
            specialty: '',
            location: '',
            imageUrl: '',
            products: []
        });
        setEditError('');
    };

    // Compress image to reduce localStorage usage
    const compressImage = (file, maxWidth = 400, quality = 0.6) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Scale down if larger than maxWidth
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to compressed JPEG
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedDataUrl);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    // Handle file upload for main image (compressed)
    const handleMainImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const compressedImage = await compressImage(file, 600, 0.7);
                setEditForm({ ...editForm, imageUrl: compressedImage });
            } catch (err) {
                console.error('Error compressing image', err);
                // Fallback to original
                const reader = new FileReader();
                reader.onloadend = () => {
                    setEditForm({ ...editForm, imageUrl: reader.result });
                };
                reader.readAsDataURL(file);
            }
        }
    };

    // Handle file upload for product image (compressed)
    const handleProductImageUpload = async (e, productId) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const compressedImage = await compressImage(file, 300, 0.6);
                setEditForm({
                    ...editForm,
                    products: editForm.products.map(p =>
                        p.id === productId ? { ...p, image: compressedImage } : p
                    )
                });
            } catch (err) {
                console.error('Error compressing product image', err);
                // Fallback
                const reader = new FileReader();
                reader.onloadend = () => {
                    setEditForm({
                        ...editForm,
                        products: editForm.products.map(p =>
                            p.id === productId ? { ...p, image: reader.result } : p
                        )
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    };

    // Add product
    const addProduct = () => {
        const newProduct = {
            id: Date.now(),
            name: '',
            description: '',
            price: '',
            image: ''
        };
        setEditForm({
            ...editForm,
            products: [...editForm.products, newProduct]
        });
    };

    // Remove product
    const removeProduct = (productId) => {
        setEditForm({
            ...editForm,
            products: editForm.products.filter(p => p.id !== productId)
        });
    };

    // Update product field
    const updateProduct = (productId, field, value) => {
        setEditForm({
            ...editForm,
            products: editForm.products.map(p =>
                p.id === productId ? { ...p, [field]: value } : p
            )
        });
    };

    // Save edited shop
    const handleSaveEdit = async () => {
        setSaving(true);
        setEditError('');

        try {
            // 1. Update shop info
            const shopData = {
                name: editForm.title,
                description: editForm.description,
                specialty: editForm.specialty,
                location: editForm.location,
                imageUrl: editForm.imageUrl,
                image_url: editForm.imageUrl,
                image: editForm.imageUrl
            };

            await api.updateShop(editingShop.id, shopData);

            // 2. Get existing products from API to compare
            let existingProducts = [];
            try {
                const productData = await api.getProductsByShop(editingShop.id);
                existingProducts = productData.products || [];
            } catch (err) {
                console.warn('Could not fetch existing products:', err);
            }

            const existingIds = existingProducts.map(p => p.id);
            const formIds = editForm.products.map(p => p.id);

            // 3. Delete products that are no longer in the form
            for (const existingProduct of existingProducts) {
                if (!formIds.includes(existingProduct.id)) {
                    try {
                        await api.deleteProduct(existingProduct.id);
                    } catch (err) {
                        console.warn('Could not delete product:', err);
                    }
                }
            }

            // 4. Create or update products
            for (const product of editForm.products) {
                if (!product.name) continue; // Skip empty products

                if (existingIds.includes(product.id)) {
                    // Update existing product
                    try {
                        await api.updateProduct(product.id, {
                            name: product.name,
                            description: product.description || '',
                            price: product.price,
                            image: product.image
                        });
                    } catch (err) {
                        console.warn('Could not update product:', err);
                    }
                } else {
                    // Create new product
                    try {
                        await api.createProduct(editingShop.id, {
                            name: product.name,
                            description: product.description || '',
                            price: product.price,
                            image: product.image
                        });
                    } catch (err) {
                        console.warn('Could not create product:', err);
                    }
                }
            }

            // 5. Save image to localStorage (for fallback display)
            if (editForm.imageUrl) {
                try {
                    localStorage.setItem(`shop_image_${editingShop.id}`, editForm.imageUrl);
                } catch (storageErr) {
                    console.warn('Could not save image to localStorage:', storageErr);
                }
            }

            // Refresh shops
            await fetchShops();
            cancelEditing();
            alert('Shop-ul a fost actualizat cu succes!');

        } catch (err) {
            setEditError(err.message || 'Eroare la salvarea modificarilor');
        } finally {
            setSaving(false);
        }
    };

    const isAdmin = currentUser && currentUser.role === 'admin';

    if (loading) return <div className="loading-screen">Se incarca shop-urile...</div>;

    return (
        <div className="producers-page">
            <div className="producers-header">
                <div className="container">
                    <h1 className="page-title">Producatorii Nostri de Incredere</h1>
                    <p className="page-subtitle">
                        Cunoaste oamenii gospodari din spatele produselor tale preferate.
                    </p>
                    {isAdmin && (
                        <p className="admin-notice">🔑 Mod Administrator - Poti sterge shop-uri</p>
                    )}
                </div>
            </div>

            <div className="container producers-list">
                {error && <p className="error-message">{error}</p>}

                {shops.length === 0 && !error && (
                    <p className="no-data-message">Momentan nu sunt shop-uri de la producatori.</p>
                )}

                {shops.map(shop => {
                    const imgSrc = shop.localImageUrl || shop.imageUrl || shop.image_url || shop.image || shop.coverImage || shop.cover_image;
                    const ownsShop = isOwner(shop);

                    return (
                        <div key={shop.id} className="producer-card-detailed">
                            {/* Owner Edit Button */}
                            {ownsShop && (
                                <button
                                    className="owner-edit-btn"
                                    onClick={() => startEditing(shop)}
                                    title="Editeaza shop-ul tau"
                                >
                                    ✏️ Editeaza
                                </button>
                            )}

                            {/* Admin Delete Button */}
                            {isAdmin && (
                                <button
                                    className="admin-delete-btn"
                                    onClick={() => handleDeleteShop(shop.id, shop.name || shop.title)}
                                    title="Sterge acest shop"
                                >
                                    🗑️
                                </button>
                            )}

                            {/* Shop Header: Image + Info */}
                            <div className="shop-card-header">
                                <div className="shop-thumb">
                                    <img
                                        src={imgSrc || 'https://via.placeholder.com/100x100?text=🏪'}
                                        alt={shop.name || shop.title}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/100x100?text=🏪';
                                        }}
                                    />
                                </div>
                                <div className="shop-header-info">
                                    <div className="shop-header-top">
                                        <h2 className="producer-name">{shop.name || shop.title || 'Shop'}</h2>
                                        <span className="producer-badge">{shop.specialty || 'Produse Locale'}</span>
                                    </div>
                                    <p className="producer-desc">
                                        {shop.description || 'Descriere indisponibila.'}
                                    </p>
                                    <div className="shop-header-meta">
                                        <span className="location-tag">📍 {shop.location || 'Dumbravita'}</span>
                                        <Link to={`/shop/${shop.id}`} className="btn btn-shop-detail">
                                            Vezi Shop-ul →
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Products Section */}
                            {shop.products && shop.products.length > 0 && (
                                <div className="shop-card-products">
                                    <div className="producer-products-grid">
                                        {shop.products.slice(0, 3).map(product => (
                                            <Link
                                                to={`/product/${product.id}`}
                                                key={product.id}
                                                className="product-mini-card"
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                {product.image && <img src={product.image} alt={product.name} />}
                                                <div className="product-mini-info">
                                                    <strong>{product.name}</strong>
                                                    {product.price && <span className="product-price">{product.price}</span>}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {shop.products.length > 3 && (
                                        <p className="more-products-notice">
                                            +{shop.products.length - 3} produse în plus
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Edit Modal */}
            {editingShop && (
                <div className="edit-modal-overlay" onClick={cancelEditing}>
                    <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="edit-modal-header">
                            <h2>✏️ Editeaza Shop-ul</h2>
                            <button className="close-btn" onClick={cancelEditing}>✕</button>
                        </div>

                        {editError && <p className="form-error">{editError}</p>}

                        <div className="edit-modal-body">
                            {/* Preview */}
                            <div className="edit-preview">
                                <h4>Previzualizare</h4>
                                <div className="preview-card">
                                    {editForm.imageUrl ? (
                                        <img src={editForm.imageUrl} alt="Preview" className="preview-img" />
                                    ) : (
                                        <div className="preview-placeholder">📷</div>
                                    )}
                                    <div className="preview-info">
                                        <h3>{editForm.title || 'Titlu Shop'}</h3>
                                        <span className="preview-badge">{editForm.specialty || 'Specialitate'}</span>
                                        <p>{editForm.description || 'Descriere...'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="edit-form">
                                <div className="form-section">
                                    <label>Imagine Shop</label>
                                    <div className="image-upload-area">
                                        {editForm.imageUrl && (
                                            <img src={editForm.imageUrl} alt="Current" className="current-thumb" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={mainImageRef}
                                            onChange={handleMainImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <button type="button" className="btn btn-outline" onClick={() => mainImageRef.current.click()}>
                                            📁 Incarca Imagine
                                        </button>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <label>Nume Shop</label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        placeholder="Ex: Ferma Bunicii"
                                    />
                                </div>

                                <div className="form-section">
                                    <label>Specialitate</label>
                                    <input
                                        type="text"
                                        value={editForm.specialty}
                                        onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                                        placeholder="Ex: Legume Bio, Lactate"
                                    />
                                </div>

                                <div className="form-section">
                                    <label>Descriere</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        rows="3"
                                        placeholder="Descrie shop-ul tau..."
                                    />
                                </div>

                                <div className="form-section">
                                    <label>Locatie</label>
                                    <input
                                        type="text"
                                        value={editForm.location}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        placeholder="Ex: Dumbravita"
                                    />
                                </div>

                                {/* Products Section */}
                                <div className="form-section products-edit-section">
                                    <label>Produse ({editForm.products.length})</label>

                                    {editForm.products.map((product, idx) => (
                                        <div key={product.id} className="product-edit-item">
                                            <div className="product-edit-header">
                                                <span>Produs #{idx + 1}</span>
                                                <button type="button" className="btn-remove-small" onClick={() => removeProduct(product.id)}>
                                                    ✕
                                                </button>
                                            </div>
                                            <div className="product-edit-row">
                                                <div className="product-img-upload">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} />
                                                    ) : (
                                                        <div className="product-img-placeholder">📷</div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleProductImageUpload(e, product.id)}
                                                        style={{ display: 'none' }}
                                                        ref={el => productImageRefs.current[product.id] = el}
                                                    />
                                                    <button type="button" className="btn-tiny" onClick={() => productImageRefs.current[product.id]?.click()}>
                                                        📁
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
                                                        placeholder="Pret (ex: 10 lei/kg)"
                                                        value={product.price}
                                                        onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                                                    />
                                                    <textarea
                                                        placeholder="Descriere produs (optional)"
                                                        value={product.description || ''}
                                                        onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                                                        rows="2"
                                                        className="product-description-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button type="button" className="btn btn-add" onClick={addProduct}>
                                        ➕ Adauga Produs
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="edit-modal-footer">
                            {/* Delete button - only for shop owner */}
                            {editingShop && isOwner(editingShop) && (
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        handleDeleteShop(editingShop.id, editForm.title);
                                        cancelEditing();
                                    }}
                                    disabled={saving}
                                >
                                    🗑️ Șterge Shop-ul
                                </button>
                            )}
                            <div className="modal-footer-spacer"></div>
                            <button className="btn btn-secondary" onClick={cancelEditing} disabled={saving}>
                                Anuleaza
                            </button>
                            <button className="btn btn-primary" onClick={handleSaveEdit} disabled={saving}>
                                {saving ? 'Se salveaza...' : '💾 Salveaza Modificarile'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProducersPage;
