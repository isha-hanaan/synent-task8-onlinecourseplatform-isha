// frontend/src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [localError, setLocalError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setLocalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!formData.email || !formData.password) {
            setLocalError('Email and password are required');
            return;
        }

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setLocalError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Welcome Back to ZenithAcad</h1>
                <p className="auth-subtitle">Login to your account</p>

                {(error || localError) && (
                    <div className="error-message">
                        {error || localError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/forgot-password" className="link">
                        Forgot Password?
                    </Link>
                </div>

                <div className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/register" className="link">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
