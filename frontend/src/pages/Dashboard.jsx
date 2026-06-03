import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-left">
                    <h1>ZenithAcad</h1>
                </div>
                <div className="nav-right">
                    <span className="user-info">Welcome, {user?.name}!</span>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">
                <h2>Student Dashboard</h2>

                <div className="dashboard-cards">
                    <div className="card">
                        <h3>📚 Enrolled Courses</h3>
                        <p>Coming in Phase 3</p>
                    </div>

                    <div className="card">
                        <h3>📈 Your Progress</h3>
                        <p>Coming in Phase 3</p>
                    </div>

                    <div className="card">
                        <h3>🎓 Browse Courses</h3>
                        <p>Coming in Phase 3</p>
                    </div>

                    <div className="card">
                        <h3>⚙️ Account Settings</h3>
                        <p>Coming in Phase 3</p>
                    </div>
                </div>

                <div className="dashboard-info">
                    <h3>Your Account Information</h3>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role || 'Student'}</p>
                    <p><strong>Member Since:</strong> Today</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
