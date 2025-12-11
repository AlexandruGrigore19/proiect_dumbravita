import { useRef, useEffect, useState } from 'react';
import './AboutSection.css';

const AboutSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className="about-section section-white" ref={sectionRef}>
            <div className="container">
                <div className="about-grid">
                    <div className={`about-content ${isVisible ? 'animate-slide-right' : ''}`}>
                        <span className="section-label">Despre Noi</span>
                        <h2 className="about-title">
                            Povestea Comunei Dumbrăvița
                        </h2>
                        <div className="about-text-content">
                            <p className="about-text">
                                Dumbrăvița este mai mult decât o simplă comună de lângă Timișoara;
                                este un loc unde tradiția se împletește cu viitorul, străjuită de
                                legendara Pădure Verde.
                            </p>
                            <p className="about-text">
                                <strong>"Piața din Dumbro"</strong> s-a născut din dorința de a aduce
                                pe mesele tuturor roadele muncii localnicilor. De la miere pură de
                                albine, la lactate proaspete și legume de grădină.
                            </p>
                        </div>
                        <div className="about-features">
                            <div className="feature">
                                <span className="feature-icon">🌱</span>
                                <span className="feature-text">100% Natural</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">🏡</span>
                                <span className="feature-text">Producători Locali</span>
                            </div>
                        </div>
                    </div>
                    <div className={`about-visual ${isVisible ? 'animate-slide-left' : ''}`}>
                        <div className="visual-card">
                            <div className="visual-icon">🌳</div>
                            <h3>Pădurea Verde</h3>
                            <p>Simbolul comunei noastre, sursa inspirației pentru designul platformei.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
