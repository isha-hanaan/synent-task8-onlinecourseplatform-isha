import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WelcomeBanner from '../components/WelcomeBanner';
import CourseCard from '../components/CourseCard';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth(); // Destructured token alongside user context metrics
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchasedTracks = async () => {
            if (!token) return;
            try {

                console.log("Current User:", user);
                console.log("Token:", token);

                const { data } = await api.get('/api/enrollments', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Enrollments Response:", data);

                console.log(data.data);

                setEnrollments(data.data || []);
            } catch (error) {
                console.error("Failed parsing user enrollment registries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchasedTracks();
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };





    return (
        <div className="dashboard-layout">

            <Sidebar />

            <div className="main-content">

                <Header user={user} />

                <WelcomeBanner user={user} />

                <div className="courses-section">

                    <h2>Your Courses</h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : enrollments.length === 0 ? (
                        <p>No enrolled courses</p>
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