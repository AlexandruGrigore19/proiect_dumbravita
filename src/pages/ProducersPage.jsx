import { Link } from 'react-router-dom';
import { producers } from '../data/producers';
import './ProducersPage.css';

const ProducersPage = () => {
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
                {producers.map(producer => (
                    <div key={producer.id} className="producer-card-detailed">
                        <div className="producer-image-wrapper">
                            <img src={producer.image} alt={producer.name} className="producer-profile-img" />
                        </div>
                        <div className="producer-details">
                            <div className="producer-head">
                                <h2 className="producer-name">{producer.name}</h2>
                                <span className="producer-badge">{producer.specialty}</span>
                            </div>
                            <p className="producer-desc">{producer.description}</p>

                            <div className="producer-products-list">
                                <h3>Ce poți cumpăra de la {producer.name.split(' ')[0]}:</h3>
                                <ul>
                                    {producer.products.map((prod) => (
                                        <li key={prod.id}>✓ {prod.name}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="producer-footer">
                                <span className="location-tag">📍 {producer.location}</span>
                                <Link to={`/producatori/${producer.id}`} className="btn btn-primary">
                                    Vezi Toate Produsele
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProducersPage;
