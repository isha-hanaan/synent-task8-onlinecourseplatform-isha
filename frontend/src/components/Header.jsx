import '../styles/Header.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="dashboard-header">
            <input
                type="text"
                placeholder="Search..."
                className="search-bar"
            />

            <div className="profile-section">
                <span>{user?.name}</span>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;