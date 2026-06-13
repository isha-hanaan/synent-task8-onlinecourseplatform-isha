// frontend/src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false); // Can safely start as false now
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`${API_URL}/api/auth/register`, {
                name,
                email,
                password,
            });
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`${API_URL}/api/auth/login`, {
                email,
                password,
            });

            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(newToken);
            setUser(userData);

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

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        setError(null);
    };

    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`${API_URL}/api/auth/forgot-password`, { email });
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to send reset email';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (resetToken, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`${API_URL}/api/auth/reset-password/${resetToken}`, { password });
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to reset password';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};