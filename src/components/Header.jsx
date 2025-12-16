import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [showCartPopup, setShowCartPopup] = useState(false);
    const navigate = useNavigate();
    const { items, getItemCount, removeItem } = useCart();

    useEffect(() => {
        // Initial check
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        const handleAuthChange = () => {
            const storedUser = localStorage.getItem('user');
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('auth-change', handleAuthChange);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('auth-change', handleAuthChange);
        };
    }, [scrolled]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const itemCount = getItemCount();

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
                        <li><Link to="/produse" className="nav-link">Produse</Link></li>
                        <li><Link to="/producatori" className="nav-link">Producători</Link></li>

                        {/* Cart Icon */}
                        <li
                            className="cart-icon-wrapper"
                            onMouseEnter={() => setShowCartPopup(true)}
                            onMouseLeave={() => setShowCartPopup(false)}
                        >
                            <Link to="/cos" className="cart-icon">
                                🛒
                                {itemCount > 0 && (
                                    <span className="cart-badge">{itemCount}</span>
                                )}
                            </Link>

                            {/* Cart Popup on Hover */}
                            {showCartPopup && (
                                <div className="cart-popup">
                                    <h4>Coșul tău</h4>
                                    {items.length === 0 ? (
                                        <p className="cart-empty">Coșul este gol</p>
                                    ) : (
                                        <>
                                            <ul className="cart-popup-items">
                                                {items.slice(0, 5).map(item => (
                                                    <li key={item.id} className="cart-popup-item">
                                                        <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} />
                                                        <div className="cart-item-info">
                                                            <span className="cart-item-name">{item.name}</span>
                                                            <span className="cart-item-qty">x{item.quantity}</span>
                                                        </div>
                                                        <button
                                                            className="cart-item-remove"
                                                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                                        >×</button>
                                                    </li>
                                                ))}
                                            </ul>
                                            {items.length > 5 && (
                                                <p className="cart-more">+{items.length - 5} produse...</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </li>

                        {user ? (
                            <li className="user-profile-menu">
                                {user.role === 'producer' ? (
                                    <Link to="/profil" className="user-profile" style={{ textDecoration: 'none' }}>
                                        <div className="user-avatar">
                                            {(user.imageUrl || (user.producer && (user.producer.imageUrl || user.producer.image_url))) ? (
                                                <img src={user.imageUrl || user.producer.imageUrl || user.producer.image_url} alt="Avatar" />
                                            ) : (
                                                user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'
                                            )}
                                        </div>
                                        <span className="user-name">{user.fullName || user.email}</span>
                                    </Link>
                                ) : (
                                    <Link to="/profil-client" className="user-profile" style={{ textDecoration: 'none' }}>
                                        <div className="user-avatar">
                                            {(user.imageUrl || (user.producer && (user.producer.imageUrl || user.producer.image_url))) ? (
                                                <img src={user.imageUrl || user.producer.imageUrl || user.producer.image_url} alt="Avatar" />
                                            ) : (
                                                user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'
                                            )}
                                        </div>
                                        <span className="user-name">{user.fullName || user.email}</span>
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="btn-logout" title="Delogare">
                                    🚪
                                </button>
                            </li>
                        ) : (
                            <li><Link to="/autentificare" className="nav-link nav-link-auth">🔐 Autentificare</Link></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
