// frontend/src/pages/AdminDashboard.jsx

import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <AdminLayout>

            <h1 className="admin-title">
                Admin Panel
            </h1>

            <p className="admin-subtitle">
                Manage courses, modules, lessons, users, and enrollments.
            </p>

<div className="admin-stats">

    <div className="stat-box">
        <h3>Courses</h3>
        <p>Manage all available courses</p>
    </div>

    <div className="stat-box">
        <h3>Modules</h3>
        <p>Create course modules</p>
    </div>

    <div className="stat-box">
        <h3>Users</h3>
        <p>View registered users</p>
    </div>

    <div className="stat-box">
        <h3>Enrollments</h3>
        <p>Track student enrollments</p>
    </div>

</div>





            <div className="admin-grid">

                <div className="admin-card">
                    <h2>📚 Course Management</h2>
                    <p>Create, edit, and delete courses.</p>

                    <div className="admin-actions">
                        <button onClick={() => navigate('/admin/add-course')}>
                            Add Course
                        </button>

                        <button onClick={() => navigate('/admin/courses')}>
                            Manage Courses
                        </button>
                    </div>
                </div>

                <div className="admin-card">
                    <h2>📝 Content Management</h2>
                    <p>Add modules and lessons to courses.</p>

                    <div className="admin-actions">
                        <button onClick={() => navigate('/admin/add-module')}>
                            Add Module
                        </button>

                        <button onClick={() => navigate('/admin/add-lesson')}>
                            Add Lesson
                        </button>
                    </div>
                </div>

                <div className="admin-card">
                    <h2>👥 User Management</h2>
                    <p>View platform users and enrollments.</p>

                    <div className="admin-actions">
                        <button onClick={() => navigate('/admin/users')}>
                            View Users
                        </button>

                        <button onClick={() => navigate('/admin/enrollments')}>
                            View Enrollments
                        </button>
                    </div>
                </div>

            </div>

        </AdminLayout>
    );
};

export default AdminDashboard;