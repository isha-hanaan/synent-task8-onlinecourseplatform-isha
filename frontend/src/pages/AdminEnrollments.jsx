import { useEffect, useState } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminTables.css';
import { useAuth } from '../context/AuthContext';

function AdminEnrollments() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchEnrollments();
    }, [token]);

    const fetchEnrollments = async () => {
        try {

            const { data } = await api.get(
                "/api/enrollments/admin",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEnrollments(data.enrollments);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <h2>Loading...</h2>
            </AdminLayout>
        );
    }
    return (
        <AdminLayout>

            <div className="admin-table-page">
                <h1>Enrollments</h1>

                <p className="admin-table-subtitle">
                    View all course enrollments across the platform.
                </p>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Email</th>
                            <th>Course</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {enrollments.map((enrollment) => (
                            <tr key={enrollment._id}>
                                <td>{enrollment.user?.name}</td>
                                <td>{enrollment.user?.email}</td>
                                <td>{enrollment.course?.title}</td>
                                <td>
                                    <span className={`status ${enrollment.status.toLowerCase()}`}>
                                        {enrollment.status}
                                    </span>
                                </td>
                                <td>
                                    {new Date(
                                        enrollment.createdAt
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export default AdminEnrollments;