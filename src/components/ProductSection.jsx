import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './ProductSection.css';

const ProductSection = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopProducts();
    }, []);

    const fetchTopProducts = async () => {
        try {
            // Get all shops
            const data = await api.getShops();
            const shopsList = Array.isArray(data) ? data : (data.data || data.shops || []);

            // Collect all products from all shops
            const allProducts = [];

            shopsList.forEach((shop) => {
                // Get products from localStorage (by ID)
                let localProducts = null;

                if (shop.id) {
                    const storedById = localStorage.getItem(`shop_products_${shop.id}`);
                    if (storedById) {
                        try {
                            localProducts = JSON.parse(storedById);
                        } catch (e) {
                            console.error('Error parsing products', e);
                        }
                    }
                }

                // Fallback: try by name
                if (!localProducts && shop.name) {
                    const storedByName = localStorage.getItem(`shop_products_name_${shop.name}`);
                    if (storedByName) {
                        try {
                            localProducts = JSON.parse(storedByName);
                        } catch (e) {
                            console.error('Error parsing products by name', e);
                        }
                    }
                }

                // Get products from API or localStorage
                const shopProducts = (shop.products && shop.products.length > 0)
                    ? shop.products
                    : (localProducts || []);

                // Add shop info to each product
                shopProducts.forEach(product => {
                    // Get view count from localStorage
                    const viewCount = parseInt(localStorage.getItem(`product_views_${shop.id}_${product.id}`) || '0');

                    allProducts.push({
                        ...product,
                        shopId: shop.id,
                        shopName: shop.name || shop.title,
                        shopLocation: shop.location,
                        viewCount
                    });
                });
            });

            // Sort by view count (most viewed first) and take top 6
            const sorted = allProducts.sort((a, b) => b.viewCount - a.viewCount);

            // If no views yet, just show first 6 products
            setTopProducts(sorted.slice(0, 6));
        } catch (err) {
            console.error("Failed to load products", err);
        } finally {
            setLoading(false);
        }
    };

    // Track product view
    const trackProductView = (shopId, productId) => {
        const key = `product_views_${shopId}_${productId}`;
        const currentViews = parseInt(localStorage.getItem(key) || '0');
        localStorage.setItem(key, (currentViews + 1).toString());
    };

    if (loading) {
        return (
            <section className="product-section section-green">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label-light">Produse Populare</span>
                        <h2 className="section-title-light">Cele Mai Căutate</h2>
                    </div>
                    <div className="loading-products">Se încarcă produsele...</div>
                </div>
            </section>
        );
    }

    if (topProducts.length === 0) {
        return (
            <section className="product-section section-green">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label-light">Produse Populare</span>
                        <h2 className="section-title-light">Cele Mai Căutate</h2>
                        <p className="section-subtitle-light">
                            Explorează produsele de la producătorii noștri locali
                        </p>
                    </div>
                    <div className="no-products-home">
                        <p>Încă nu sunt produse disponibile.</p>
                        <Link to="/producatori" className="btn btn-light">
                            Vezi Producătorii
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="product-section section-green">
            <div className="container">
                <div className="section-header">
                    <span className="section-label-light">🔥 Produse Populare</span>
                    <h2 className="section-title-light">
                        Cele Mai Căutate
                    </h2>
                    <p className="section-subtitle-light">
                        Descoperă produsele preferate de comunitatea noastră
                    </p>
                </div>

                <div className="products-grid">
                    {topProducts.map((product, index) => (
                        <Link
                            to="/produse"
                            key={`${product.shopId}-${product.id || index}`}
                            className="product-card card"
                            style={{ textDecoration: 'none' }}
                            onClick={() => trackProductView(product.shopId, product.id)}
                        >
                            <div className="product-image">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} />
                                ) : (
                                    <div className="product-image-placeholder">
                                        <span>🥕</span>
                                    </div>
                                )}
                                {product.viewCount > 0 && (
                                    <span className="product-badge badge badge-accent">
                                        👁 {product.viewCount}
                                    </span>
                                )}
                            </div>
                            <div className="product-info">
                                <div className="product-header">
                                    <h3 className="product-name">{product.name || 'Produs'}</h3>
                                    {product.price && (
                                        <div className="product-price">
                                            <span className="price-value">{product.price}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="product-seller">
                                    <span className="seller-icon">🏪</span>
                                    <span className="seller-name">{product.shopName}</span>
                                    {product.shopLocation && (
                                        <span className="seller-location">• {product.shopLocation}</span>
                                    )}
                                </div>
                                <button className="btn btn-primary product-btn">
                                    Vezi Produsul
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="section-cta">
                    <Link to="/produse" className="btn btn-light btn-lg">
                        Vezi Toate Produsele →
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
