import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth(); // Destructured token alongside user context metrics
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchasedTracks = async () => {
            if (!token) return;
            try {
                const { data } = await api.get('http://127.0.0.1:5000/api/enrollments', {
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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-left">
                    <h1 onClick={() => navigate('/courses')} style={{ cursor: 'pointer' }}>ZenithAcad</h1>
                </div>
                <div className="nav-right">
                    <span className="user-info">Welcome, {user?.name}!</span>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">
                <h2>Student Dashboard</h2>

                {/* Main Dynamic Cards Panel */}
                <div className="dashboard-cards">
                    <div className="card">
                        <h3>📚 Enrolled Courses</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {loading ? '...' : enrollments.length}
                        </p>
                    </div>

                    <div className="card">
                        <h3>📈 Overall Progress</h3>
                        <p style={{ margin: '0.5rem 0', color: '#666' }}>
                            {enrollments.length === 0
                                ? 'No courses started'
                                : `${enrollments.filter(e => e.completedLessons?.length > 0).length} Course(s) in progress`
                            }
                        </p>
                    </div>

                    <div className="card" onClick={() => navigate('/courses')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                        <h3>🎓 Browse Courses</h3>
                        <p style={{ color: '#007bff', textDecoration: 'underline' }}>Explore Marketplace →</p>
                    </div>

                    <div className="card">
                        <h3>⚙️ Account Status</h3>
                        <p style={{ color: '#28a745', fontWeight: 'bold' }}>Verified Active</p>
                    </div>
                </div>

                {/* Course Access Progress Blocks Layout */}
                <div style={{ marginTop: '2.5rem' }}>
                    <h3>My Live Curriculum</h3>
                    {loading ? (
                        <p>Parsing active user data...</p>
                    ) : enrollments.length === 0 ? (
                        <div style={{ padding: '2rem', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ccc', textAlign: 'center' }}>
                            <p style={{ margin: 0, color: '#777' }}>You haven't purchased or enrolled in any courses yet.</p>
                            <button onClick={() => navigate('/courses')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Find a Course</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                            {enrollments.map((item) => (
                                <div key={item._id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.25rem', background: '#fff' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.course?.title}</h4>
                                    <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Instructor: {item.course?.instructor}</p>

                                    {/* Visual dynamic progress engine tracking lesson array lengths */}
                                    <div style={{ background: '#e9ecef', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                        <div style={{
                                            background: '#28a745',
                                            height: '100%',
                                            width: item.completedLessons?.length > 0 ? `${Math.min(item.completedLessons.length * 20, 100)}%` : '0%'
                                        }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#555' }}>
                                        <span>Status: <strong style={{ color: '#28a745' }}>Enrolled</strong></span>
                                        <span>{item.completedLessons?.length || 0} Lessons Finished</span>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/learn/${item.course._id}`)}
                                        style={{
                                            marginTop: '15px',
                                            padding: '10px',
                                            width: '100%',
                                            background: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Continue Learning
                                    </button>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Static Account Information Block */}
                <div className="dashboard-info" style={{ marginTop: '2.5rem' }}>
                    <h3>Your Account Information</h3>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{user?.role || 'Student'}</span></p>
                    <p><strong>Member Since:</strong> Active</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;