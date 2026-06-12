// frontend/src/components/Sidebar.jsx

import '../styles/Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">

            <NavLink
                to="/dashboard"
                className="logo"
            >
                <h2>ZenithAcad</h2>
            </NavLink>

            <ul className="sidebar-menu">

                <li>
                    <NavLink to="/dashboard">
                        Dashboard
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/courses">
                        Browse Courses
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/payments">
                        Payment History
                    </NavLink>
                </li>

                {user?.role === 'admin' && (
                    <>
                        <li>
                            <NavLink to="/admin">
                                Admin Panel
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/admin/users">
                                Users
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/admin/enrollments">
                                Enrollments
                            </NavLink>
                        </li>
                    </>
                )}

                <li>
                    <button
                        className="sidebar-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </li>

            </ul>

        </aside>
    );
};

export default Sidebar;