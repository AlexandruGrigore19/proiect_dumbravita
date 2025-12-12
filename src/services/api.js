
const BASE_URL = 'https://piata-dumbravita-api-production.up.railway.app';

export const api = {
    // Auth endpoints
    registerUser: async (userData) => {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return await handleResponse(response);
    },

    registerProducer: async (producerData) => {
        const response = await fetch(`${BASE_URL}/api/auth/register/producer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producerData),
        });
        return await handleResponse(response);
    },

    login: async (credentials) => {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return await handleResponse(response);
    },

    getCurrentUser: async (token) => {
        const response = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await handleResponse(response);
    },

    updateProfile: async (userId, userData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        return await handleResponse(response);
    },

    changePassword: async (passwordData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/users/password/change`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(passwordData)
        });
        return await handleResponse(response);
    },

    updateProducer: async (producerId, producerData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/producers/${producerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(producerData)
        });
        return await handleResponse(response);
    },

    getProducers: async () => {
        const response = await fetch(`${BASE_URL}/api/producers`);
        return await handleResponse(response);
    },

    // ========== SHOPS (Buticuri) ==========
    
    getShops: async () => {
        const response = await fetch(`${BASE_URL}/api/shops`);
        return await handleResponse(response);
    },

    getShopById: async (shopId) => {
        const response = await fetch(`${BASE_URL}/api/shops/${shopId}`);
        return await handleResponse(response);
    },

    getMyShops: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/shops/my/all`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await handleResponse(response);
    },

    createShop: async (shopData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/shops`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(shopData)
        });
        return await handleResponse(response);
    },

    updateShop: async (shopId, shopData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/shops/${shopId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(shopData)
        });
        return await handleResponse(response);
    },

    deleteShop: async (shopId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/shops/${shopId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await handleResponse(response);
    },

    // ========== PRODUCTS (Produse) ==========

    getProductsByShop: async (shopId) => {
        const response = await fetch(`${BASE_URL}/api/products/shop/${shopId}`);
        return await handleResponse(response);
    },

    createProduct: async (shopId, productData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/products/shop/${shopId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        return await handleResponse(response);
    },

    syncProducts: async (shopId, products) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/products/shop/${shopId}/sync`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ products })
        });
        return await handleResponse(response);
    },

    updateProduct: async (productId, productData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        return await handleResponse(response);
    },

    deleteProduct: async (productId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await handleResponse(response);
    }
};

async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        // If there are validation details, format them
        if (data.details) {
            const messages = data.details.map(d => d.message).join('. ');
            throw new Error(messages || data.error || 'A apărut o eroare');
        }
        throw new Error(data.error || 'A apărut o eroare');
    }
    return data;
}
