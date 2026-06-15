import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import '../styles/PaymentHistory.css';

const PaymentHistory = () => {

    const navigate = useNavigate();
    const { token } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetchPayments();
    }, [token]);

    const fetchPayments = async () => {
        try {

            const { data } = await api.get(
                '/api/enrollments',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPayments(data.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <div className="page-header">
                    <h1>Payment History</h1>
                    <p>View all your course purchases and transactions.</p>
                </div>


                {loading ? (
                    <div className="empty-state">
                        <h3>Loading your transactions...</h3>
                        <p>Please wait a moment.</p>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="empty-state">
                        <h3>No payments found</h3>
                        <p>You haven't purchased any courses yet.</p>
                        <button
                            className="browse-btn"
                            onClick={() => navigate('/courses')}
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (

                    <div className="payment-card">

                        <table className="payment-table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {payments.map(payment => (
                                    <tr key={payment._id}>
                                        <td>{payment.course?.title || 'Course unavailable'}</td>
                                        <td>₹{payment.course?.price || 0}</td>
                                        <td>
                                            <span className="status-badge">
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;