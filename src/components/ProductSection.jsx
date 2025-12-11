import { Link } from 'react-router-dom';
import { producers } from '../data/producers';
import './ProductSection.css';

const ProductSection = () => {
    // Flatten products from all producers to show a mixed selection on homepage
    // We'll take the first 2 products from each producer to show a variety
    const homepageProducts = producers.flatMap(producer =>
        producer.products.slice(0, 2).map(product => ({
            ...product,
            producerName: producer.name,
            producerId: producer.id,
            producerLocation: producer.location
        }))
    );

    return (
        <section className="product-section section-green">
            <div className="container">
                <div className="section-header">
                    <span className="section-label-light">Produse Proaspete</span>
                    <h2 className="section-title-light">
                        Bunătățile Săptămânii
                    </h2>
                    <p className="section-subtitle-light">
                        Alege din cele mai proaspete produse, recoltate și preparate de localnicii din Dumbrăvița
                    </p>
                </div>

                <div className="products-grid">
                    {homepageProducts.map(product => (
                        <Link
                            to={`/producatori/${product.producerId}`}
                            key={product.id}
                            className="product-card card"
                            style={{ textDecoration: 'none' }}
                        >
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
                                <div className="product-seller">
                                    <span className="seller-icon">👤</span>
                                    <span className="seller-name">{product.producerName}</span>
                                    <span className="seller-location">• {product.producerLocation}</span>
                                </div>
                                <button className="btn btn-primary product-btn">
                                    Vezi Producătorul
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
