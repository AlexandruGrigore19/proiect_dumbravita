import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import './ShopSubscribePage.css';

const ShopSubscribePage = () => {
    const { shopId } = useParams();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    // Subscription data
    const [subscriptionData, setSubscriptionData] = useState({
        description: '',
        selectedProducts: [],
        price: '',
        isActive: false
    });
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Get current user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        fetchShopDetails();
    }, [shopId]);

    const fetchShopDetails = async () => {
        try {
            setLoading(true);
            const data = await api.getShops();
            const shopsList = Array.isArray(data) ? data : (data.data || data.shops || []);
            const foundShop = shopsList.find(s => s.id === parseInt(shopId));

            if (!foundShop) {
                setError('Shop-ul nu a fost găsit.');
                return;
            }

            // Get local image
            const localImage = localStorage.getItem(`shop_image_${foundShop.id}`);

            // Get products
            let localProducts = null;
            if (foundShop.id) {
                const storedById = localStorage.getItem(`shop_products_${foundShop.id}`);
                if (storedById) {
                    try {
                        localProducts = JSON.parse(storedById);
                    } catch (e) {
                        console.error('Error parsing products', e);
                    }
                }
            }

            const shopProducts = (foundShop.products && foundShop.products.length > 0)
                ? foundShop.products
                : (localProducts || []);

            setShop({
                ...foundShop,
                localImageUrl: localImage
            });
            setProducts(shopProducts);

            // Load saved subscription data
            const savedSubscription = localStorage.getItem(`shop_subscription_${shopId}`);
            if (savedSubscription) {
                setSubscriptionData(JSON.parse(savedSubscription));
            }
        } catch (err) {
            console.error("Failed to load shop", err);
            setError('Nu am putut încărca detaliile shop-ului.');
        } finally {
            setLoading(false);
        }
    };

    // Check if current user is the shop owner
    const isOwner = () => {
        if (!currentUser || !shop) return false;
        const shopUserId = shop.user_id || shop.userId || (shop.user && shop.user.id);
        return currentUser.id === shopUserId;
    };

    const handleSaveSubscription = () => {
        setSaving(true);
        // Save to localStorage
        localStorage.setItem(`shop_subscription_${shopId}`, JSON.stringify(subscriptionData));
        setTimeout(() => {
            setSaving(false);
            setIsEditing(false);
            alert('Abonamentul a fost salvat cu succes!');
        }, 500);
    };

    const toggleProduct = (productId) => {
        const selected = subscriptionData.selectedProducts || [];
        if (selected.includes(productId)) {
            setSubscriptionData({
                ...subscriptionData,
                selectedProducts: selected.filter(id => id !== productId)
            });
        } else {
            setSubscriptionData({
                ...subscriptionData,
                selectedProducts: [...selected, productId]
            });
        }
    };

    const isProductSelected = (productId) => {
        return (subscriptionData.selectedProducts || []).includes(productId);
    };

    if (loading) {
        return (
            <div className="subscribe-page">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>Se încarcă...</p>
                </div>
            </div>
        );
    }

    if (error || !shop) {
        return (
            <div className="subscribe-page">
                <div className="container">
                    <div className="error-container">
                        <h2>😕 {error || 'Shop-ul nu a fost găsit'}</h2>
                        <Link to="/producatori" className="btn btn-primary">
                            ← Înapoi la Producători
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const imgSrc = shop.localImageUrl || shop.imageUrl || shop.image_url || shop.image;
    const selectedProductsList = products.filter(p => (subscriptionData.selectedProducts || []).includes(p.id));

    return (
        <div className="subscribe-page">
            <div className="subscribe-container">
                <Link to={`/shop/${shopId}`} className="back-link">
                    ← Înapoi la {shop.name || 'Shop'}
                </Link>

                <div className="subscribe-header">
                    <div className="shop-avatar">
                        {imgSrc ? (
                            <img src={imgSrc} alt={shop.name} />
                        ) : (
                            <span>🏪</span>
                        )}
                    </div>
                    <h1>Abonament {shop.name || shop.title}</h1>
                    <p className="subscribe-subtitle">
                        Primește lunar produse proaspete direct de la producător.
                    </p>
                </div>

                {/* Owner Edit Mode Toggle */}
                {isOwner() && !isEditing && (
                    <div className="owner-actions">
                        <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
                            ✏️ Editează Detaliile Abonamentului
                        </button>
                    </div>
                )}

                {/* Edit Mode for Owner */}
                {isOwner() && isEditing && (
                    <div className="subscription-edit-form">
                        <h2>📝 Configurează Abonamentul</h2>

                        <div className="form-group">
                            <label>Descrierea Abonamentului</label>
                            <textarea
                                value={subscriptionData.description}
                                onChange={(e) => setSubscriptionData({ ...subscriptionData, description: e.target.value })}
                                placeholder="Descrie ce primesc abonații lunar. Ex: Coș săptămânal cu legume proaspete de sezon, ouă de țară, lactate..."
                                rows="4"
                            />
                        </div>

                        <div className="form-group">
                            <label>Preț Lunar (opțional)</label>
                            <input
                                type="text"
                                value={subscriptionData.price}
                                onChange={(e) => setSubscriptionData({ ...subscriptionData, price: e.target.value })}
                                placeholder="Ex: 150 lei/lună"
                            />
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={subscriptionData.isActive}
                                    onChange={(e) => setSubscriptionData({ ...subscriptionData, isActive: e.target.checked })}
                                />
                                Abonamentul este activ și acceptă comenzi
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Produse incluse în abonament ({subscriptionData.selectedProducts?.length || 0} selectate)</label>
                            <p className="form-hint">Selectează produsele care vor fi incluse în pachetul lunar:</p>

                            {products.length === 0 ? (
                                <p className="no-products-hint">Nu ai produse adăugate. Adaugă produse în shop-ul tău mai întâi.</p>
                            ) : (
                                <div className="products-select-grid">
                                    {products.map(product => (
                                        <div
                                            key={product.id}
                                            className={`product-select-item ${isProductSelected(product.id) ? 'selected' : ''}`}
                                            onClick={() => toggleProduct(product.id)}
                                        >
                                            <div className="product-select-img">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} />
                                                ) : (
                                                    <span>🥕</span>
                                                )}
                                            </div>
                                            <div className="product-select-info">
                                                <strong>{product.name}</strong>
                                                {product.price && <span>{product.price}</span>}
                                            </div>
                                            <div className="product-select-check">
                                                {isProductSelected(product.id) ? '✓' : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={saving}>
                                Anulează
                            </button>
                            <button className="btn btn-primary" onClick={handleSaveSubscription} disabled={saving}>
                                {saving ? 'Se salvează...' : '💾 Salvează Abonamentul'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Visitor View / Display Mode */}
                {(!isOwner() || !isEditing) && (
                    <div className="subscription-display">
                        {/* Show subscription details if description exists */}
                        {subscriptionData.description ? (
                            <>
                                {/* Status Badge */}
                                <div className={`subscription-status ${subscriptionData.isActive ? 'active' : 'inactive'}`}>
                                    {subscriptionData.isActive ? '✅ Abonament Activ' : '⏸️ Momentan Indisponibil'}
                                </div>

                                {/* Main Info Card */}
                                <div className="subscription-hero-card">
                                    <div className="hero-card-header">
                                        <span className="hero-icon">📦</span>
                                        <h2>Pachet Lunar de la {shop.name || 'Producător'}</h2>
                                    </div>

                                    <div className="subscription-description-box">
                                        <h3>🌿 Ce conține abonamentul:</h3>
                                        <p>{subscriptionData.description}</p>
                                    </div>

                                    {subscriptionData.price && (
                                        <div className="subscription-price-box">
                                            <div className="price-icon">💰</div>
                                            <div className="price-details">
                                                <span className="price-label">Preț lunar</span>
                                                <span className="price-amount">{subscriptionData.price}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Products Grid */}
                                {selectedProductsList.length > 0 && (
                                    <div className="subscription-products-card">
                                        <h3>🛒 Produse incluse în pachet ({selectedProductsList.length})</h3>
                                        <p className="products-subtitle">Iată ce vei primi lunar de la noi:</p>

                                        <div className="subscription-products-showcase">
                                            {selectedProductsList.map(product => (
                                                <div key={product.id} className="showcase-product">
                                                    <div className="showcase-img">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} />
                                                        ) : (
                                                            <div className="showcase-placeholder">🥕</div>
                                                        )}
                                                    </div>
                                                    <div className="showcase-info">
                                                        <span className="showcase-name">{product.name}</span>
                                                        {product.price && (
                                                            <span className="showcase-price">{product.price}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Benefits Section */}
                                <div className="subscription-benefits">
                                    <h3>✨ De ce să te abonezi?</h3>
                                    <div className="benefits-grid">
                                        <div className="benefit-item">
                                            <span className="benefit-icon">🚚</span>
                                            <span className="benefit-text">Livrare lunară</span>
                                        </div>
                                        <div className="benefit-item">
                                            <span className="benefit-icon">🌱</span>
                                            <span className="benefit-text">Produse proaspete</span>
                                        </div>
                                        <div className="benefit-item">
                                            <span className="benefit-icon">👨‍🌾</span>
                                            <span className="benefit-text">Direct de la fermă</span>
                                        </div>
                                        <div className="benefit-item">
                                            <span className="benefit-icon">💚</span>
                                            <span className="benefit-text">Susții localul</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="subscription-cta-section">
                                    {subscriptionData.isActive ? (
                                        <>
                                            <button className="btn btn-subscribe-main">
                                                🔔 Vreau să mă abonez
                                            </button>
                                            <p className="cta-hint">
                                                Apasă butonul și te vom contacta pentru a finaliza abonamentul.
                                            </p>
                                        </>
                                    ) : (
                                        <div className="cta-unavailable">
                                            <p>Abonamentul nu acceptă comenzi momentan. Revino în curând!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Contact Info */}
                                {(shop.owner_phone || shop.owner_email) && (
                                    <div className="subscription-contact">
                                        <h4>📞 Sau contactează-ne direct:</h4>
                                        {shop.owner_phone && <p>Telefon: {shop.owner_phone}</p>}
                                        {shop.owner_email && <p>Email: {shop.owner_email}</p>}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="subscription-empty">
                                <span className="empty-icon">📋</span>
                                <h2>Detalii în curs de completare</h2>
                                <p>Producătorul va adăuga în curând informații despre oferta de abonament.</p>
                                <Link to={`/shop/${shopId}`} className="btn btn-outline">
                                    ← Vezi produsele shop-ului
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopSubscribePage;
