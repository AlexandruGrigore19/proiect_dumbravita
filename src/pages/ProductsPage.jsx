import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './ProductsPage.css';

const ProductsPage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            setLoading(true);

            // Get all shops
            const data = await api.getShops();
            const shopsList = Array.isArray(data) ? data : (data.data || data.shops || []);

            // Collect all products from all shops using the API
            const products = [];

            // Fetch products for each shop using GET /api/products/shop/:shopId
            for (const shop of shopsList) {
                try {
                    const productData = await api.getProductsByShop(shop.id);
                    const shopProducts = productData.products || [];

                    // Add shop info to each product
                    shopProducts.forEach(product => {
                        products.push({
                            ...product,
                            image: product.image_url || product.image,
                            shopId: shop.id,
                            shopName: shop.name || shop.title,
                            shopSpecialty: shop.specialty,
                            shopLocation: shop.location
                        });
                    });
                } catch (err) {
                    console.error(`Failed to fetch products for shop ${shop.id}:`, err);
                }
            }

            setAllProducts(products);
        } catch (err) {
            console.error("Failed to load products", err);
            setError('Nu am putut incarca produsele.');
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories from products
    const categories = ['all', ...new Set(allProducts.map(p => p.category || p.shopSpecialty).filter(Boolean))];

    // Filter products
    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = !searchTerm ||
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.shopName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'all' ||
            product.category === selectedCategory ||
            product.shopSpecialty === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="loading-screen">Se incarca produsele...</div>;

    return (
        <div className="products-page">
            <div className="products-header">
                <div className="container">
                    <h1 className="page-title">🥬 Toate Produsele</h1>
                    <p className="page-subtitle">
                        Descopera produse proaspete de la toti producatorii nostri locali.
                    </p>
                </div>
            </div>

            <div className="container">
                {/* Search and Filter Bar */}
                <div className="products-toolbar">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Cauta produse..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="category-filter">
                        {categories.slice(0, 6).map(cat => (
                            <button
                                key={cat}
                                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat === 'all' ? 'Toate' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                {/* Products count */}
                <p className="products-count">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'produs gasit' : 'produse gasite'}
                </p>

                {filteredProducts.length === 0 && !error && (
                    <div className="no-products">
                        <span className="no-products-icon">📦</span>
                        <h3>Nu am gasit produse</h3>
                        <p>Incearca sa modifici filtrul sau termenul de cautare.</p>
                    </div>
                )}

                {/* Products Grid */}
                <div className="products-grid">
                    {filteredProducts.map((product, index) => {
                        // Track view on card click
                        const handleCardClick = () => {
                            const key = `product_views_${product.shopId}_${product.id}`;
                            const currentViews = parseInt(localStorage.getItem(key) || '0');
                            localStorage.setItem(key, (currentViews + 1).toString());
                        };

                        return (
                            <div
                                key={`${product.shopId}-${product.id || index}`}
                                className="product-card"
                                onClick={handleCardClick}
                            >
                                <div className="product-image-wrapper">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="product-image" />
                                    ) : (
                                        <div className="product-image-placeholder">
                                            <span>🥕</span>
                                        </div>
                                    )}
                                    {product.price && (
                                        <div className="product-price-badge">
                                            {product.price}
                                        </div>
                                    )}
                                </div>

                                <div className="product-content">
                                    <h3 className="product-name">{product.name || 'Produs'}</h3>

                                    {product.description && (
                                        <p className="product-description">{product.description}</p>
                                    )}

                                    <div className="product-shop-info">
                                        <span className="shop-badge">
                                            🏪 {product.shopName}
                                        </span>
                                        {product.shopLocation && (
                                            <span className="shop-location">
                                                📍 {product.shopLocation}
                                            </span>
                                        )}
                                    </div>

                                    <Link
                                        to={`/product/${product.id}`}
                                        className="view-shop-btn"
                                    >
                                        Vezi Produsul →
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
