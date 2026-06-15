import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminSidebar.css';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="admin-sidebar">

            <div className="admin-logo">
                <h2>ZenithAcad</h2>
                <span>Admin Portal</span>
            </div>

            <nav className="admin-menu">

                <NavLink to="/admin">
                    Dashboard
                </NavLink>

                <NavLink to="/admin/courses">
                    Courses
                </NavLink>

                <NavLink to="/admin/add-course">
                    Add Course
                </NavLink>

                <NavLink to="/admin/add-module">
                    Add Module
                </NavLink>

                <NavLink to="/admin/add-lesson">
                    Add Lesson
                </NavLink>

                <NavLink to="/admin/users">
                    Users
                </NavLink>

                <NavLink to="/admin/enrollments">
                    Enrollments
                </NavLink>

            </nav>

            <button
                className="admin-logout-btn"
                onClick={handleLogout}
            >
                Logout
            </button>

        </aside>
    );
};

export default AdminSidebar;