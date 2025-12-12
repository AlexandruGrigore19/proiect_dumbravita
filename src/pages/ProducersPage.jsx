import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './ProducersPage.css';

const ProducersPage = () => {
    const [producers, setProducers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducers = async () => {
            try {
                const data = await api.getProducers();
                const producersList = Array.isArray(data) ? data : (data.data || data.producers || []);

                // Enrich with localStorage products for each producer
                const enrichedProducers = producersList.map(producer => {
                    const userId = producer.userId || producer.user_id || (producer.user && producer.user.id);
                    const storedProducts = JSON.parse(localStorage.getItem(`producer_products_${userId}`) || '[]');
                    return { ...producer, products: storedProducts };
                });

                setProducers(enrichedProducers);
            } catch (err) {
                console.error("Failed to load producers", err);
                setError('Nu am putut încărca lista de producători.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducers();
    }, []);

    if (loading) return <div className="loading-screen">Se încarcă producătorii...</div>;

    return (
        <div className="producers-page">
            <div className="producers-header">
                <div className="container">
                    <h1 className="page-title">Producătorii Noștri de Încredere</h1>
                    <p className="page-subtitle">
                        Cunoaște oamenii gospodari din spatele produselor tale preferate.
                    </p>
                </div>
            </div>

            <div className="container producers-list">
                {error && <p className="error-message">{error}</p>}

                {producers.length === 0 && !error && (
                    <p className="no-data-message">Momentan nu sunt producători înregistrați.</p>
                )}

                {producers.map(producer => (
                    <div key={producer.id} className="producer-card-detailed">
                        <div className="producer-image-wrapper">
                            <img
                                src={producer.imageUrl || producer.image_url || 'https://via.placeholder.com/400x300?text=Fermier+Local'}
                                alt={producer.user ? (producer.user.fullName || producer.user.full_name) : 'Producator'}
                                className="producer-profile-img"
                            />
                        </div>
                        <div className="producer-details">
                            <div className="producer-head">
                                <h2 className="producer-name">
                                    {producer.user ? (producer.user.fullName || producer.user.full_name) : 'Nume Indisponibil'}
                                </h2>
                                <span className="producer-badge">{producer.specialty || 'Produse Locale'}</span>
                            </div>
                            <p className="producer-desc">
                                {producer.description || 'Acest producător nu a adăugat încă o descriere.'}
                            </p>

                            {/* Products Display */}
                            {producer.products && producer.products.length > 0 ? (
                                <div className="producer-products-grid">
                                    {producer.products.map(product => (
                                        <div key={product.id} className="product-mini-card">
                                            {product.image && <img src={product.image} alt={product.name} />}
                                            <div className="product-mini-info">
                                                <strong>{product.name}</strong>
                                                {product.price && <span className="product-price">{product.price}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="producer-products-list">
                                    <h3>Ce poți cumpăra:</h3>
                                    {producer.specialty ? (
                                        <ul>
                                            {producer.specialty.split(',').map((item, idx) => (
                                                item.trim() && <li key={idx}>✓ {item.trim()}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p style={{ fontStyle: 'italic', color: '#666' }}>Lista de produse nu este specificată.</p>
                                    )}
                                </div>
                            )}

                            <div className="producer-footer">
                                <span className="location-tag">📍 {producer.location || 'Dumbrăvița'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProducersPage;
