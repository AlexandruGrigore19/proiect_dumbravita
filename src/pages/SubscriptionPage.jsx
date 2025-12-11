import { useParams, Link } from 'react-router-dom';
import { producers } from '../data/producers';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
    const { id } = useParams();
    const producer = producers.find(p => p.id === id);

    if (!producer) {
        return (
            <div className="subscription-not-found container">
                <h2>Producătorul nu a fost găsit</h2>
                <Link to="/producatori" className="btn btn-primary">Înapoi la Producători</Link>
            </div>
        );
    }

    return (
        <div className="subscription-page">
            <div className="subscription-header">
                <div className="container">
                    <span className="sub-badge">📦 Abonament Lunar</span>
                    <h1 className="sub-title">Abonează-te la {producer.name}</h1>
                    <p className="sub-subtitle">
                        Primește lunar cele mai proaspete produse direct de la producător, fără griji.
                    </p>
                </div>
            </div>

            <div className="container subscription-content">
                <div className="subscription-intro">
                    <div className="producer-mini-card">
                        <img src={producer.image} alt={producer.name} className="mini-producer-img" />
                        <div>
                            <h3>{producer.name}</h3>
                            <p>{producer.specialty}</p>
                        </div>
                    </div>

                    <div className="subscription-benefits">
                        <h2>🎁 Ce primești cu abonamentul?</h2>
                        <ul>
                            <li>✓ Livrare <strong>lunară</strong> la ușa ta</li>
                            <li>✓ Produse <strong>proaspete</strong> direct de la sursă</li>
                            <li>✓ <strong>10% reducere</strong> față de prețul individual</li>
                            <li>✓ Posibilitate de <strong>personalizare</strong> a coșului</li>
                            <li>✓ <strong>Anulare oricând</strong>, fără obligații</li>
                        </ul>
                    </div>
                </div>

                <div className="subscription-products">
                    <h2>📋 Produse disponibile în abonament</h2>
                    <p className="products-intro">Alege ce dorești să primești lunar din selecția de mai jos:</p>

                    <div className="sub-products-grid">
                        {producer.products.map(product => (
                            <div key={product.id} className="sub-product-item">
                                <img src={product.image} alt={product.name} />
                                <div className="sub-product-info">
                                    <h4>{product.name}</h4>
                                    <p>{product.price} / {product.unit}</p>
                                </div>
                                <label className="checkbox-container">
                                    <input type="checkbox" defaultChecked />
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="subscription-cta">
                    <div className="cta-content">
                        <h3>Gata să te abonezi?</h3>
                        <p>Vei primi primul coș în maxim 7 zile de la confirmare.</p>
                    </div>
                    <button className="btn btn-primary btn-large">
                        🛒 Abonează-te Acum
                    </button>
                </div>

                <div className="back-link-wrapper">
                    <Link to={`/producatori/${producer.id}`} className="btn btn-secondary">
                        ← Înapoi la Profilul Producătorului
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
