import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import './ShopDetailPage.css';

const ShopDetailPage = () => {
    const { shopId } = useParams();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchShopDetails();
    }, [shopId]);

    const fetchShopDetails = async () => {
        try {
            setLoading(true);

            // Get all shops and find the one we need
            const data = await api.getShops();
            const shopsList = Array.isArray(data) ? data : (data.data || data.shops || []);

            const foundShop = shopsList.find(s => s.id === parseInt(shopId));

            if (!foundShop) {
                setError('Shop-ul nu a fost gasit.');
                setLoading(false);
                return;
            }

            // Get products from localStorage
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

            // Fallback: try by name
            if (!localProducts && foundShop.name) {
                const storedByName = localStorage.getItem(`shop_products_name_${foundShop.name}`);
                if (storedByName) {
                    try {
                        localProducts = JSON.parse(storedByName);
                    } catch (e) {
                        console.error('Error parsing products by name', e);
                    }
                }
            }

            // Get local image
            const localImage = localStorage.getItem(`shop_image_${foundShop.id}`);

            const enrichedShop = {
                ...foundShop,
                localImageUrl: localImage
            };

            const shopProducts = (foundShop.products && foundShop.products.length > 0)
                ? foundShop.products
                : (localProducts || []);

            setShop(enrichedShop);
            setProducts(shopProducts);

        } catch (err) {
            console.error("Failed to load shop", err);
            setError('Nu am putut incarca detaliile shop-ului.');
        } finally {
            setLoading(false);
        }
    };

    // Track product view
    const trackProductView = (productId) => {
        const key = `product_views_${shopId}_${productId}`;
        const currentViews = parseInt(localStorage.getItem(key) || '0');
        localStorage.setItem(key, (currentViews + 1).toString());
    };

    if (loading) {
        return <div className="loading-screen">Se incarca shop-ul...</div>;
    }

    if (error || !shop) {
        return (
            <div className="shop-detail-page">
                <div className="container">
                    <div className="error-container">
                        <h2>😕 {error || 'Shop-ul nu a fost gasit'}</h2>
                        <Link to="/producatori" className="btn btn-primary">
                            ← Inapoi la Producatori
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const imgSrc = shop.localImageUrl || shop.imageUrl || shop.image_url || shop.image || shop.coverImage;

    return (
        <div className="shop-detail-page">
            {/* Hero Section with Shop Image */}
            <div className="shop-hero">
                <div className="shop-hero-image">
                    {imgSrc ? (
                        <img src={imgSrc} alt={shop.name || shop.title} />
                    ) : (
                        <div className="shop-hero-placeholder">
                            <span>🏪</span>
                        </div>
                    )}
                    <div className="shop-hero-overlay"></div>
                </div>
                <div className="container shop-hero-content">
                    <Link to="/producatori" className="back-link">
                        ← Inapoi la Producatori
                    </Link>
                    <h1 className="shop-title">{shop.name || shop.title || 'Shop'}</h1>
                    <div className="shop-meta">
                        {shop.specialty && (
                            <span className="shop-specialty-badge">{shop.specialty}</span>
                        )}
                        {shop.location && (
                            <span className="shop-location">📍 {shop.location}</span>
                        )}
                    </div>
                    <Link to={`/shop/${shopId}/abonare`} className="btn btn-subscribe">
                        🔔 Abonează-te la acest shop
                    </Link>
                </div>
            </div>

            <div className="container">
                {/* Shop Description */}
                {shop.description && (
                    <div className="shop-description-section">
                        <h2>Despre Shop</h2>
                        <p>{shop.description}</p>
                    </div>
                )}

                {/* Owner Info */}
                {(shop.owner_name || shop.owner_email) && (
                    <div className="shop-owner-section">
                        <h3>Contact</h3>
                        {shop.owner_name && <p>👤 {shop.owner_name}</p>}
                        {shop.owner_email && <p>✉️ {shop.owner_email}</p>}
                        {shop.owner_phone && <p>📞 {shop.owner_phone}</p>}
                    </div>
                )}

                {/* Products Section */}
                <div className="shop-products-section">
                    <h2>🛒 Produsele Noastre ({products.length})</h2>

                    {products.length === 0 ? (
                        <div className="no-products-message">
                            <span>📦</span>
                            <p>Acest shop nu are produse momentan.</p>
                        </div>
                    ) : (
                        <div className="shop-products-grid">
                            {products.map((product, index) => (
                                <div
                                    key={product.id || index}
                                    className="shop-product-card"
                                    onClick={() => trackProductView(product.id)}
                                >
                                    <div className="product-image-container">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} />
                                        ) : (
                                            <div className="product-placeholder">
                                                <span>🥕</span>
                                            </div>
                                        )}
                                        {product.price && (
                                            <div className="product-price-tag">
                                                {product.price}
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-details">
                                        <h3>{product.name || 'Produs'}</h3>
                                        {product.description && (
                                            <p className="product-desc">{product.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA */}
                <div className="shop-cta-section">
                    <Link to="/produse" className="btn btn-outline-large">
                        Vezi Toate Produsele din Piata →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ShopDetailPage;
