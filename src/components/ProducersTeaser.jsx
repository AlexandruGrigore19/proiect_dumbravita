import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './ProducersTeaser.css';

const ProducersTeaser = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            const data = await api.getShops();
            const shopsList = Array.isArray(data) ? data : (data.data || data.shops || []);
            setShops(shopsList.filter(shop => shop.imageUrl || shop.image_url));
        } catch (err) {
            console.error('Error fetching shops for teaser:', err);
        }
    };

    // Duplicate shops array for seamless infinite scroll effect
    const duplicatedShops = [...shops, ...shops, ...shops];

    return (
        <section className="producers-teaser-section">
            <div className="container">
                <h2 className="teaser-title">
                    Cunoaște-ți Producătorii
                </h2>
                <p className="teaser-subtitle">
                    În spatele fiecărui produs natural stă un om gospodar. Descoperă poveștile lor și vezi de unde vine hrana ta.
                </p>

                {/* Infinite Scrolling Shop Images */}
                {shops.length > 0 && (
                    <div className="shops-marquee-container">
                        <div className="shops-marquee-track">
                            {duplicatedShops.map((shop, index) => (
                                <div key={`${shop.id}-${index}`} className="marquee-shop-item">
                                    <img
                                        src={shop.imageUrl || shop.image_url}
                                        alt={shop.name || 'Shop'}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    className="btn btn-primary teaser-btn"
                    onClick={() => navigate('/producatori')}
                >
                    👨‍🌾 Vezi Producătorii de Încredere
                </button>
            </div>
        </section>
    );
};

export default ProducersTeaser;
