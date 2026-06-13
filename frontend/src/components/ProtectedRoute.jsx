// frontend/src/components/ProtectedRoute.jsx

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ProtectedRoute.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="auth-loading">
                Loading...
            </div>
        );
    }

    if (
        adminOnly &&
        isAuthenticated &&
        user?.role !== 'admin'
    ) {
        return <Navigate to="/dashboard" replace />;
    }

    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default ProtectedRoute;