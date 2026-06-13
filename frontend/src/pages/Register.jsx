// frontend/src/pages/Register.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading, error } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
    });
    const [localError, setLocalError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setLocalError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setSuccess('');

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.confirmEmail.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setLocalError('All fields are required');
            return;
        }

        if (
            formData.email.trim().toLowerCase() !==
            formData.confirmEmail.trim().toLowerCase()
        ) {
            setLocalError('Email addresses do not match');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        try {
            await register(
                formData.name.trim(),
                formData.email.trim().toLowerCase(),
                formData.password
            );
            setSuccess("Registration successful! We've sent a verification link to your email. Please verify your account before logging in.");
            setFormData({
                name: '',
                email: '',
                confirmEmail: '',
                password: '',
                confirmPassword: '',
            });
            setTimeout(() => navigate('/login'), 4000);
        } catch (err) {
            setLocalError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Join ZenithAcad</h1>
                <p className="auth-subtitle">Create your account to start learning</p>

                {(error || localError) && (
                    <div className="error-message">
                        {error || localError}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            required
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            required
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
                        <label htmlFor="confirmEmail">
                            Confirm Email Address
                        </label>
                        <input
                            required
                            type="email"
                            id="confirmEmail"
                            name="confirmEmail"
                            value={formData.confirmEmail}
                            onChange={handleChange}
                            placeholder="Confirm your email"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            required
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            required
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login" className="link">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
