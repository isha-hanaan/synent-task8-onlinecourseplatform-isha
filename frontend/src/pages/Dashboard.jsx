import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';
import WelcomeBanner from '../components/WelcomeBanner';
import CourseCard from '../components/CourseCard';
import DashboardStats from '../components/DashboardStats';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();

    if (user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchasedTracks = async () => {
            if (!token) return;
            try {

                const { data } = await api.get('/api/enrollments', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setEnrollments(data.data || []);
            } catch (error) {
                console.error("Failed parsing user enrollment registries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchasedTracks();
    }, [token]);

    return (
        <div className="dashboard-layout">

            <Sidebar />

            <div className="main-content">

                <WelcomeBanner user={user} />

                <DashboardStats enrollments={enrollments} />

                <div className="courses-section">

                    <h2>Your Courses</h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : enrollments.length === 0 ? (

                        <div>

                            <h3>
                                You haven't enrolled in any courses yet.
                            </h3>

                            <button
                                onClick={() => navigate('/courses')}
                            >
                                Browse Courses
                            </button>

                        </div>

                    ) : (
                        <div className="courses-grid">
                            {enrollments.map((item) => (
                                <CourseCard
                                    key={item._id}
                                    item={item}
                                    navigate={navigate}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;