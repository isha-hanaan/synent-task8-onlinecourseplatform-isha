import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminCourses = () => {

    const [courses, setCourses] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {

            const { data } = await api.get('/api/courses');

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
        <div style={{ padding: '2rem' }}>

            <h1>Manage Courses</h1>

            <table border="1" cellPadding="10">

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

                                <button
                                    onClick={() => navigate(`/admin/edit-course/${course._id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteCourse(course._id)}
                                >
                                    Delete
                                </button>

                            </td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default AdminCourses;