import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminDashboard.css';

const AdminCourses = () => {

    const [courses, setCourses] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, [token]);

    const fetchCourses = async () => {
        try {

            const { data } = await api.get(
                '/api/courses',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCourses(data.data || []);

        } catch (error) {
            console.error(error);
        }
    };

    const deleteCourse = async (id) => {

        if (!window.confirm('Delete this course?')) {
            return;
        }

        try {

            await api.delete(
                `/api/courses/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCourses(
                courses.filter(course => course._id !== id)
            );

            alert('Course deleted');

        } catch (error) {

            alert(
                error.response?.data?.message ||
                'Failed to delete course'
            );
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header">

                    <div>
                        <h1>Manage Courses</h1>
                        <p>Create, edit and remove courses.</p>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={() => navigate('/admin/add-course')}
                    >
                        + Add Course
                    </button>

                </div>
                <div className="admin-table-wrapper">

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Instructor</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {courses.map(course => (
                                <tr key={course._id}>
                                    <td>{course.title}</td>
                                    <td>{course.instructor}</td>
                                    <td>{course.category}</td>
                                    <td>₹{course.price}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => navigate(`/admin/edit-course/${course._id}`)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteCourse(course._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCourses;