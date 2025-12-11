import { useParams, Link } from 'react-router-dom';
import { producers } from '../data/producers';
import './ProducerDetails.css';

const ProducerDetails = () => {
    const { id } = useParams();
    const producer = producers.find(p => p.id === id);

    if (!producer) {
        return (
            <div className="producer-not-found container">
                <h2>Producătorul nu a fost găsit</h2>
                <Link to="/producatori" className="btn btn-primary">Înapoi la Producători</Link>
            </div>
        );
    }

    return (
        <div className="producer-details-page">
            <div className="producer-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${producer.image})` }}>
                <div className="container producer-hero-content">
                    <span className="specialty-badge">{producer.specialty}</span>
                    <h1 className="producer-hero-title">{producer.name}</h1>
                    <p className="producer-hero-location">📍 {producer.location}</p>
                </div>
            </div>

            <div className="container producer-main">
                <div className="producer-bio-section">
                    <h2>Povestea Producătorului</h2>
                    <p>{producer.description}</p>
                </div>

                <div className="producer-products-section">
                    <h3 className="section-title">Produsele lui {producer.name.split(' ')[0]}</h3>
                    <div className="producer-products-grid">
                        {producer.products.map(product => (
                            <div key={product.id} className="product-card card">
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                    {product.badge && (
                                        <span className="product-badge badge badge-accent">
                                            {product.badge}
                                        </span>
                                    )}
                                </div>
                                <div className="product-info">
                                    <div className="product-header">
                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="product-price">
                                            <span className="price-value">{product.price}</span>
                                            <span className="price-unit">/ {product.unit}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary product-btn">
                                        Adaugă în Coș
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subscription Section */}
                <div className="subscription-promo-section">
                    <div className="subscription-promo-content">
                        <div className="promo-icon">📦</div>
                        <div className="promo-text">
                            <h3>Abonează-te la {producer.name.split(' ')[0]}</h3>
                            <p>Primește lunar produse proaspete direct de la acest producător, cu 10% reducere!</p>
                        </div>
                    </div>
                    <Link to={`/producatori/${producer.id}/abonament`} className="btn btn-accent btn-promo">
                        📬 Află Mai Multe
                    </Link>
                </div>

                <div className="back-link-wrapper">
                    <Link to="/producatori" className="btn btn-secondary">← Înapoi la Lista de Producători</Link>
                </div>
            </div>
        </div>
    );
};

export default ProducerDetails;
