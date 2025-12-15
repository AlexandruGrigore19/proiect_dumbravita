import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    });

    // Persist to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product, quantity = 1) => {
        setItems(prev => {
            const existingIndex = prev.findIndex(item => item.id === product.id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeItem = (productId) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        setItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
    };

    const getItemCount = () => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotal = () => {
        return items.reduce((sum, item) => {
            const price = parseFloat(item.price?.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
            return sum + (price * item.quantity);
        }, 0);
    };

    const isInCart = (productId) => {
        return items.some(item => item.id === productId);
    };

    const getItemQuantity = (productId) => {
        const item = items.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getItemCount,
            getTotal,
            isInCart,
            getItemQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
