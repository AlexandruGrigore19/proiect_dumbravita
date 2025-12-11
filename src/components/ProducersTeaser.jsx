import { useNavigate } from 'react-router-dom';

const ProducersTeaser = () => {
    const navigate = useNavigate();

    return (
        <section className="section-light" style={{ padding: '5rem 0', textAlign: 'center' }}>
            <div className="container">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Cunoaște-ți Producătorii
                </h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', opacity: '0.8' }}>
                    În spatele fiecărui produs natural stă un om gospodar. Descoperă poveștile lor și vezi de unde vine hrana ta.
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/producatori')}
                    style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}
                >
                    👨‍🌾 Vezi Producătorii de Încredere
                </button>
            </div>
        </section>
    );
};

export default ProducersTeaser;
