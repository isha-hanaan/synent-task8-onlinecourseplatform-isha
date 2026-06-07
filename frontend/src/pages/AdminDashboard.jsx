import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {

    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">

                <h1>Admin Dashboard</h1>

                <div>
                    <h2>Course Management</h2>

                    <button
                        onClick={() => navigate('/admin/add-course')}
                    >
                        Add Course
                    </button>

                    <button
                        onClick={() => navigate('/admin/courses')}
                    >
                        Manage Courses
                    </button>
                </div>

                <br />

                <div>
                    <h2>Content Management</h2>

                    <button
                        onClick={() => navigate('/admin/add-module')}
                    >
                        Add Module
                    </button>

                    <button
                        onClick={() => navigate('/admin/add-lesson')}
                    >
                        Add Lesson
                    </button>
                </div>

                <br />

                <div>
                    <h2>User Management</h2>

                    <button>View Users</button>

                    <button>View Enrollments</button>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
