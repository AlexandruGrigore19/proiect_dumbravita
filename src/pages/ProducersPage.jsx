import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './ProducersPage.css';

const ProducersPage = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Check current user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        const fetchShops = async () => {
            try {
                const data = await api.getShops();
                const shopsList = Array.isArray(data) ? data : (data.data || data.shops || []);
                setShops(shopsList);
            } catch (err) {
                console.error("Failed to load shops", err);
                setError('Nu am putut incarca lista de shop-uri.');
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

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
            alert('Shop-ul a fost sters cu succes!');
        } catch (err) {
            alert('Eroare la stergerea shop-ului: ' + (err.message || 'Eroare necunoscuta'));
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

                {shops.map(shop => (
                    <div key={shop.id} className="producer-card-detailed">
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

                        <div className="producer-image-wrapper">
                            {(() => {
                                const imgSrc = shop.imageUrl || shop.image_url || shop.image || shop.coverImage || shop.cover_image;
                                console.log('Shop image data:', shop.id, imgSrc, shop);
                                return (
                                    <img
                                        src={imgSrc || 'https://via.placeholder.com/400x300?text=Fermier+Local'}
                                        alt={shop.name || shop.title}
                                        className="producer-profile-img"
                                        onError={(e) => {
                                            console.log('Image load error for:', imgSrc);
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Imagine+Indisponibila';
                                        }}
                                    />
                                );
                            })()}
                        </div>
                        <div className="producer-details">
                            <div className="producer-head">
                                <h2 className="producer-name">{shop.name || shop.title || 'Shop'}</h2>
                                <span className="producer-badge">{shop.specialty || 'Produse Locale'}</span>
                            </div>
                            <p className="producer-desc">
                                {shop.description || 'Descriere indisponibila.'}
                            </p>

                            {/* Products Display */}
                            {shop.products && shop.products.length > 0 && (
                                <div className="producer-products-grid">
                                    {shop.products.map(product => (
                                        <div key={product.id} className="product-mini-card">
                                            {product.image && <img src={product.image} alt={product.name} />}
                                            <div className="product-mini-info">
                                                <strong>{product.name}</strong>
                                                {product.description && <p className="product-desc-mini">{product.description}</p>}
                                                {product.price && <span className="product-price">{product.price}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="producer-footer">
                                <span className="location-tag">📍 {shop.location || 'Dumbravita'}</span>
                                {shop.producer && shop.producer.user && (
                                    <span className="producer-author">
                                        De: {shop.producer.user.fullName || shop.producer.user.full_name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProducersPage;
