import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addItem, isInCart, getItemQuantity, updateQuantity } = useCart();

    const [product, setProduct] = useState(null);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (product && isInCart(product.id)) {
            setQuantity(getItemQuantity(product.id));
        }
    }, [product]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            
            // Use GET /api/products/:id to fetch product details
            const data = await api.getProductById(productId);
            
            if (data.product) {
                const productData = data.product;
                // Map image_url to image for consistency
                setProduct({
                    ...productData,
                    image: productData.image_url || productData.image
                });
                
                // Set shop info from the product response
                setShop({
                    id: productData.shop_id,
                    name: productData.shop_name,
                    owner_id: productData.owner_id
                });
            } else {
                setError('Produsul nu a fost găsit.');
            }

        } catch (err) {
            console.error("Error fetching product:", err);
            setError('A apărut o eroare la încărcarea produsului.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            shopId: shop?.id,
            shopName: shop?.name
        };

        if (isInCart(product.id)) {
            updateQuantity(product.id, quantity);
        } else {
            addItem(cartProduct, quantity);
        }

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>Se încarcă detaliile produsului...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-page">
                <div className="error-screen">
                    <h2>Ups!</h2>
                    <p>{error || 'Produsul nu a fost găsit.'}</p>
                    <Link to="/producatori" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none' }}>
                        Înapoi la Producători
                    </Link>
                </div>
            </div>
        );
    }

    const shopImageKey = shop ? `shop_image_${shop.id}` : null;
    const shopImageLocal = shopImageKey ? localStorage.getItem(shopImageKey) : null;
    const shopImage = shop?.imageUrl || shopImageLocal || 'https://via.placeholder.com/100x100?text=Shop';
    const alreadyInCart = isInCart(product.id);

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                <button onClick={() => navigate(-1)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '1rem' }}>
                    ← Înapoi
                </button>

                <div className="product-content-wrapper">
                    <div className="product-image-section">
                        <img
                            src={product.image || 'https://via.placeholder.com/500x500?text=Produs'}
                            alt={product.name}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500?text=Fara+Imagine'; }}
                        />
                    </div>

                    <div className="product-info-section">
                        {product.category && (
                            <span className="product-category-badge">
                                {product.category}
                            </span>
                        )}

                        <h1 className="product-title-large">{product.name}</h1>
                        <div className="product-price-large">
                            {product.price || 'Preț la cerere'}
                        </div>

                        <div className="product-description-container">
                            <p>{product.description || 'Fără descriere disponibilă.'}</p>
                        </div>

                        {/* Add to Cart Section */}
                        <div className="add-to-cart-section">
                            <div className="quantity-selector">
                                <button className="qty-btn" onClick={decrementQuantity}>−</button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    className="qty-input"
                                />
                                <button className="qty-btn" onClick={incrementQuantity}>+</button>
                            </div>
                            <button
                                className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                onClick={handleAddToCart}
                            >
                                {addedToCart ? '✓ Adăugat!' : (alreadyInCart ? '🛒 Actualizează coșul' : '🛒 Adaugă în coș')}
                            </button>
                        </div>

                        <div className="product-meta-divider"></div>

                        {shop && (
                            <div className="shop-info-box">
                                <div className="shop-info-thumb">
                                    <img src={shopImage} alt={shop.name} />
                                </div>
                                <div className="shop-info-text">
                                    <h4>Vândut de {shop.name || shop.title}</h4>
                                    <p>📍 {shop.location || 'Locație necunoscută'}</p>
                                    <Link to={`/shop/${shop.id}`} className="link-to-shop">
                                        Vezi profilul producătorului →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
