import '../styles/Sidebar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="sidebar">
            <div className="logo">
                <h2>ZenithAcad</h2>
            </div>

            <ul className="sidebar-menu">

                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>

                <li>
                    <Link to="/courses">All Courses</Link>
                </li>

                <li>
                    <Link to="/settings">Settings</Link>
                </li>

                {user?.role === 'admin' && (
                    <li>
                        <Link to="/admin">
                            Admin Panel
                        </Link>
                    </li>
                )}

            </ul>
        </aside>
    );
};

export default Sidebar;