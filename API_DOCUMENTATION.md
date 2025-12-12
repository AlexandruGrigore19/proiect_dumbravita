# 📚 API Documentation - Piața din Dumbro Backend

**Base URL:** `https://piata-dumbravita-api-production.up.railway.app`

---

## 🔐 Autentificare

### 1. Înregistrare User Normal

**Endpoint:** `POST /api/auth/register`

**URL Complet:** 
```
https://piata-dumbravita-api-production.up.railway.app/api/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "parola123",
  "fullName": "Ion Popescu",
  "phone": "0712345678"
}
```

**Câmpuri obligatorii:** `email`, `password` (min 8 caractere), `fullName`
**Câmpuri opționale:** `phone`

**Response Success (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Ion Popescu",
    "phone": "0712345678",
    "role": "user"
  }
}
```

**Response Error (400 - Validare eșuată):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    },
    {
      "field": "fullName",
      "message": "Full name is required"
    }
  ]
}
```

**Response Error (409 - Email deja există):**
```json
{
  "error": "Email already registered"
}
```

**Response Error (500 - Server Error):**
```json
{
  "error": "Internal Server Error"
}
```

---

### 2. Înregistrare Producător

**Endpoint:** `POST /api/auth/register/producer`

**URL Complet:**
```
https://piata-dumbravita-api-production.up.railway.app/api/auth/register/producer
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "producator@example.com",
  "password": "parola123",
  "fullName": "Maria Ionescu",
  "phone": "0723456789",
  "specialty": "Legume Bio",
  "location": "Strada Fermei nr. 5, Dumbrăvița",
  "description": "Legume proaspete cultivate organic de peste 10 ani."
}
```

**Câmpuri obligatorii:** `email`, `password` (min 8 caractere), `fullName`, `specialty`, `location`
**Câmpuri opționale:** `phone`, `description`

**Response Success (201):**
```json
{
  "message": "Producer registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "producator@example.com",
    "fullName": "Maria Ionescu",
    "phone": "0723456789",
    "role": "producer"
  }
}
```

**Response Error (400 - Validare eșuată):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    },
    {
      "field": "fullName",
      "message": "Full name is required"
    },
    {
      "field": "specialty",
      "message": "Specialty is required"
    },
    {
      "field": "location",
      "message": "Location is required"
    }
  ]
}
```

**Response Error (409 - Email deja există):**
```json
{
  "error": "Email already registered"
}
```

---

### 3. Login (User sau Producător)

**Endpoint:** `POST /api/auth/login`

**URL Complet:**
```
https://piata-dumbravita-api-production.up.railway.app/api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "user@demo.com",
  "password": "password123"
}
```

**Response Success (200) - User:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@demo.com",
    "fullName": "Ion Popescu",
    "phone": "0712345678",
    "role": "user"
  }
}
```

**Response Success (200) - Producător:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "gigel@demo.com",
    "fullName": "Gigel Frone",
    "phone": "0723456789",
    "role": "producer",
    "producer": {
      "id": 1,
      "specialty": "Miere Naturală",
      "description": "Gigel Frone este un apicultor pasionat...",
      "location": "Strada Albinelor, Nr. 12",
      "is_verified": true
    }
  }
}
```

**Response Error (400 - Validare eșuată):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    },
    {
      "field": "password",
      "message": "Password is required"
    }
  ]
}
```

**Response Error (401 - Credențiale invalide):**
```json
{
  "error": "Invalid email or password"
}
```

---

### 4. Get Current User (Protected)

**Endpoint:** `GET /api/auth/me`

**URL Complet:**
```
https://piata-dumbravita-api-production.up.railway.app/api/auth/me
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:** Nu este necesar

**Response Success (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@demo.com",
    "fullName": "Ion Popescu",
    "phone": "0712345678",
    "role": "user",
    "createdAt": "2025-12-11T17:28:00.000Z"
  }
}
```

**Response Error (401 - Token lipsă):**
```json
{
  "error": "Access denied. No token provided."
}
```

**Response Error (401 - Token invalid/expirat):**
```json
{
  "error": "Invalid or expired token."
}
```

**Response Error (404 - User nu există):**
```json
{
  "error": "User not found"
}
```

---

## 👥 Users

### 5. Update User Profile (Protected)

**Endpoint:** `PUT /api/users/:id`

**URL Complet (exemplu pentru user cu id=1):**
```
https://piata-dumbravita-api-production.up.railway.app/api/users/1
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (JSON):**
```json
{
  "fullName": "Ion Popescu Updated",
  "phone": "0799999999"
}
```

**Response Success (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "email": "user@demo.com",
    "full_name": "Ion Popescu Updated",
    "phone": "0799999999",
    "role": "user",
    "updated_at": "2025-12-11T18:00:00.000Z"
  }
}
```

**Response Error (400 - Validare eșuată):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "fullName",
      "message": "Full name cannot be empty"
    }
  ]
}
```

**Response Error (401 - Token lipsă/invalid):**
```json
{
  "error": "Access denied. No token provided."
}
```

**Response Error (403 - Nu ai permisiuni):**
```json
{
  "error": "Access denied"
}
```

**Response Error (404 - User nu există):**
```json
{
  "error": "User not found"
}
```

---

### 6. Change Password (Protected)

**Endpoint:** `PUT /api/users/password/change`

**URL Complet:**
```
https://piata-dumbravita-api-production.up.railway.app/api/users/password/change
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (JSON):**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response Success (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Response Error (400 - Validare eșuată):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "currentPassword",
      "message": "Current password is required"
    },
    {
      "field": "newPassword",
      "message": "New password must be at least 8 characters"
    }
  ]
}
```

**Response Error (401 - Token lipsă/invalid):**
```json
{
  "error": "Access denied. No token provided."
}
```

**Response Error (401 - Parolă curentă greșită):**
```json
{
  "error": "Current password is incorrect"
}
```

**Response Error (404 - User nu există):**
```json
{
  "error": "User not found"
}
```

---

### 7. Delete User Account (Protected)

**Endpoint:** `DELETE /api/users/:id`

**URL Complet (exemplu pentru user cu id=1):**
```
https://piata-dumbravita-api-production.up.railway.app/api/users/1
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:** Nu este necesar

**Response Success (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Response Error (401 - Token lipsă/invalid):**
```json
{
  "error": "Access denied. No token provided."
}
```

**Response Error (403 - Nu ai permisiuni):**
```json
{
  "error": "Access denied"
}
```

**Response Error (404 - User nu există):**
```json
{
  "error": "User not found"
}
```

---

## 🌾 Producători

### 8. Get All Producers (Public)

**Endpoint:** `GET /api/producers`

**URL Complet:**
```
https://piata-dumbravita-api-production.up.railway.app/api/producers
```

**Headers:** Nu sunt necesare

**Body:** Nu este necesar

**Response Success (200):**
```json
{
  "producers": [
    {
      "id": 1,
      "userId": 2,
      "fullName": "Gigel Frone",
      "email": "gigel@demo.com",
      "phone": "0723456789",
      "specialty": "Miere Naturală",
      "description": "Gigel Frone este un apicultor pasionat cu peste 15 ani de experiență...",
      "location": "Strada Albinelor, Nr. 12",
      "imageUrl": null,
      "isVerified": true,
      "createdAt": "2025-12-11T17:28:00.000Z"
    },
    {
      "id": 2,
      "userId": 3,
      "fullName": "Klaus Iohannis",
      "email": "klaus@demo.com",
      "phone": "0734567890",
      "specialty": "Lactate Tradiționale",
      "description": "Klaus produce lactate artizanale după rețete vechi săsești...",
      "location": "Aleea Palatului, Nr. 1",
      "imageUrl": null,
      "isVerified": true,
      "createdAt": "2025-12-11T17:28:00.000Z"
    }
  ]
}
```

---

### 9. Get Producer by ID (Public)

**Endpoint:** `GET /api/producers/:id`

**URL Complet (exemplu pentru producer cu id=1):**
```
https://piata-dumbravita-api-production.up.railway.app/api/producers/1
```

**Headers:** Nu sunt necesare

**Body:** Nu este necesar

**Response Success (200):**
```json
{
  "producer": {
    "id": 1,
    "userId": 2,
    "fullName": "Gigel Frone",
    "email": "gigel@demo.com",
    "phone": "0723456789",
    "specialty": "Miere Naturală",
    "description": "Gigel Frone este un apicultor pasionat cu peste 15 ani de experiență...",
    "location": "Strada Albinelor, Nr. 12",
    "imageUrl": null,
    "isVerified": true,
    "createdAt": "2025-12-11T17:28:00.000Z"
  }
}
```

**Response Error (404 - Producător nu există):**
```json
{
  "error": "Producer not found"
}
```

**Response Error (500 - Server Error):**
```json
{
  "error": "Internal Server Error"
}
```

---

### 10. Update Producer Profile (Protected - doar producători)

**Endpoint:** `PUT /api/producers/:id`

**URL Complet (exemplu pentru producer cu id=1):**
```
https://piata-dumbravita-api-production.up.railway.app/api/producers/1
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (JSON):**
```json
{
  "specialty": "Miere și Produse Apicole",
  "description": "Descriere actualizată...",
  "location": "Noua adresă",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response Success (200):**
```json
{
  "message": "Producer updated successfully",
  "producer": {
    "id": 1,
    "user_id": 2,
    "specialty": "Miere și Produse Apicole",
    "description": "Descriere actualizată...",
    "location": "Noua adresă",
    "image_url": "https://example.com/image.jpg",
    "is_verified": true,
    "updated_at": "2025-12-11T18:00:00.000Z"
  }
}
```

**Response Error (400 - Validare eșuată):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "imageUrl",
      "message": "Invalid image URL"
    }
  ]
}
```

**Response Error (401 - Token lipsă/invalid):**
```json
{
  "error": "Access denied. No token provided."
}
```

**Response Error (403 - Nu ești producător sau nu e profilul tău):**
```json
{
  "error": "Access denied. Insufficient permissions."
}
```

**Response Error (404 - Producător nu există):**
```json
{
  "error": "Producer not found"
}
```

---

## 🏥 Health Check

### 11. Health Check (Public)

**Endpoint:** `GET /health`

**URL Complet:**
```
https://piata-dumbravita-api-production.up.railway.app/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T17:29:14.697Z",
  "service": "piata-dumbravita-api"
}
```

---

## 🧪 Conturi Demo pentru Testare

| Tip | Email | Parolă |
|-----|-------|--------|
| User | `user@demo.com` | `password123` |
| Producer | `gigel@demo.com` | `password123` |
| Producer | `klaus@demo.com` | `password123` |

---

## ⚠️ Coduri de Eroare

| Cod | Descriere |
|-----|-----------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validare eșuată) |
| 401 | Unauthorized (token invalid/lipsă) |
| 403 | Forbidden (permisiuni insuficiente) |
| 404 | Not Found |
| 409 | Conflict (ex: email deja există) |
| 500 | Internal Server Error |

---

## 🔑 Cum să folosești Token-ul JWT

1. După login/register primești un `token`
2. Salvează token-ul în localStorage sau state
3. Pentru rutele protejate, adaugă header-ul:
```
Authorization: Bearer <token>
```

Token-ul expiră în **7 zile**.

---

## 📝 Exemplu Fetch în JavaScript

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('https://piata-dumbravita-api-production.up.railway.app/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Get producers
const getProducers = async () => {
  const response = await fetch('https://piata-dumbravita-api-production.up.railway.app/api/producers');
  return response.json();
};

// Get current user (protected)
const getMe = async (token) => {
  const response = await fetch('https://piata-dumbravita-api-production.up.railway.app/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```
