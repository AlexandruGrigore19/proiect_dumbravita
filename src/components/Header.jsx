import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    return (
        <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
            <div className="container header-inner">
                <Link to="/" className="logo">
                    <span className="logo-icon">🌿</span>
                    <span className="logo-text">Piața din Dumbro</span>
                </Link>
                <nav className="nav">
                    <ul className="nav-list">
                        <li><Link to="/" className="nav-link">Acasă</Link></li>
                        <li><a href="/#story" className="nav-link">Poveste</a></li>
                        <li><a href="/#products" className="nav-link">Produse</a></li>
                        <li><Link to="/producatori" className="nav-link">Producători</Link></li>
                        <li><a href="#" className="nav-link">Contact</a></li>
                        <li><Link to="/autentificare" className="nav-link nav-link-auth">🔐 Autentificare</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
