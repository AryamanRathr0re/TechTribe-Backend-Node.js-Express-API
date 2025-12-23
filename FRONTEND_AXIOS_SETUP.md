# Frontend Axios Setup Guide

This guide shows how to set up a centralized Axios instance with automatic JWT token attachment for your React frontend.

## 1. Create `src/api/axios.js` (or `src/utils/api.js`)

```javascript
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://techtribe-backend-node-js-express-api.onrender.com',
  withCredentials: true, // Still send cookies for backward compatibility
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Prevent requests if no token (except for public routes)
    const publicRoutes = ['/login', '/signup'];
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
    
    if (!token && !isPublicRoute) {
      // Cancel the request
      return Promise.reject(new Error('No authentication token found'));
    }
    
    // Attach token to Authorization header if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      
      // Optional: Redirect to login (uncomment if needed)
      // window.location.href = '/login';
      
      // Or dispatch a logout action if using Redux/Context
      // store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 2. Update Login/Signup to Store Token

```javascript
// In your Login component
import api from '../api/axios';

const handleLogin = async (Email, password) => {
  try {
    const response = await api.post('/login', { Email, password });
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    // Handle successful login
    console.log('Logged in:', response.data);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

## 3. Refactor All API Calls

Replace all direct `axios` calls with your `api` instance:

### Before:
```javascript
import axios from 'axios';

axios.get('/profile')
axios.get('/feed')
axios.get('/user/connections')
```

### After:
```javascript
import api from '../api/axios';

api.get('/profile')
api.get('/feed')
api.get('/user/connections')
```

## 4. Example: Protected Route Component

```javascript
import { useEffect, useState } from 'react';
import api from '../api/axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setUser(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired or invalid - redirect to login
          window.location.href = '/login';
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render user profile */}</div>;
}
```

## 5. Logout Function

```javascript
import api from '../api/axios';

const handleLogout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear token from localStorage
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};
```

## Key Points:

1. ✅ **Token Storage**: Tokens are stored in `localStorage` after login/signup
2. ✅ **Automatic Attachment**: Request interceptor automatically adds `Authorization: Bearer <token>` header
3. ✅ **Request Prevention**: Requests are blocked if no token exists (except public routes)
4. ✅ **Error Handling**: 401 responses automatically clear invalid tokens
5. ✅ **Backward Compatible**: Still sends cookies for backward compatibility
6. ✅ **No Breaking Changes**: Public routes (login/signup) work without tokens

## Environment Variable

Add to your `.env` file:
```
VITE_API_BASE_URL=https://techtribe-backend-node-js-express-api.onrender.com
```

