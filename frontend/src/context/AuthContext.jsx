import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Initialize from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    // Register function
    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, {
                name,
                email,
                password,
            });
            setError(null);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password,
            });

            const { token: newToken, user: userData } = response.data;

            // Store in localStorage
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update state
            setToken(newToken);
            setUser(userData);

            // Set default axios header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            setError(null);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Login failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        setError(null);
    };

    // Forgot Password function
    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
                email,
            });
            setError(null);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to send reset email';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Reset Password function
    const resetPassword = async (token, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_URL}/api/auth/reset-password/${token}`, {
                password,
            });
            setError(null);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to reset password';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Clear error
    const clearError = () => setError(null);

    const value = {
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        clearError,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
