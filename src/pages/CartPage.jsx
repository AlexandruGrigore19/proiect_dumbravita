import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
    const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const totalPrice = getTotal();

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h1 className="cart-title">🛒 Coșul Tău</h1>

                {items.length === 0 ? (
                    <div className="cart-empty-state">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Coșul tău este gol</h2>
                        <p>Adaugă produse din piața noastră pentru a începe cumpărăturile.</p>
                        <Link to="/produse" className="btn btn-primary">
                            🥕 Vezi Produsele
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-items-list">
                            {items.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-image">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/120x120?text=Produs'}
                                            alt={item.name}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/120x120?text=Produs'; }}
                                        />
                                    </div>
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        {item.shopName && (
                                            <p className="cart-item-shop">🏪 {item.shopName}</p>
                                        )}
                                        <p className="cart-item-price">{item.price || 'Preț la cerere'}</p>
                                    </div>
                                    <div className="cart-item-quantity">
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="cart-item-remove"
                                        onClick={() => removeItem(item.id)}
                                        title="Elimină din coș"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="cart-summary-row">
                                <span>Produse în coș:</span>
                                <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                            </div>
                            <div className="cart-summary-row cart-total">
                                <span>Total estimat:</span>
                                <span>{totalPrice > 0 ? `${totalPrice.toFixed(2)} lei` : 'Contactează producătorii'}</span>
                            </div>

                            <div className="cart-actions">
                                <button className="btn btn-secondary" onClick={clearCart}>
                                    🗑️ Golește Coșul
                                </button>
                                <button className="btn btn-primary btn-checkout">
                                    📞 Contactează Producătorii
                                </button>
                            </div>

                            <p className="cart-notice">
                                💡 Pentru a finaliza comanda, contactează direct producătorii.
                                Prețurile pot varia în funcție de disponibilitate.
                            </p>
                        </div>

                        <Link to="/produse" className="continue-shopping">
                            ← Continuă cumpărăturile
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;
