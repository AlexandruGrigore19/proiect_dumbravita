
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

    deleteProducer: async (producerId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/admin/producers/${producerId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await handleResponse(response);
    },

    // Shop (Announcements) endpoints
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

    getShops: async () => {
        const response = await fetch(`${BASE_URL}/api/shops`);
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

    getMyShops: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/shops/my`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await handleResponse(response);
    },

    // Product endpoints
    getProductsByShop: async (shopId) => {
        const response = await fetch(`${BASE_URL}/api/products/shop/${shopId}`);
        return await handleResponse(response);
    },

    getProductById: async (productId) => {
        const response = await fetch(`${BASE_URL}/api/products/${productId}`);
        return await handleResponse(response);
    },

    // Admin endpoints
    adminDeleteShop: async (shopId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/admin/shops/${shopId}`, {
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
