import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [course, setCourse] = useState(null); // 💡 Start as null instead of empty object
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const { data } = await api.get(`/api/courses/${id}`);
                setCourse(data?.data || null);

                if (token) {
                    const enrollmentsRes = await api.get('/api/enrollments');

                    const enrolled = enrollmentsRes.data.data.some(
                        (item) => item.course._id === id
                    );

                    setAlreadyEnrolled(enrolled);
                }

            } catch (error) {
                console.error("Error fetching course metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [id]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);

            const existingScript = document.querySelector(
                'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
            );

            if (existingScript) {
                existingScript.onload = () => resolve(true);
                existingScript.onerror = () => resolve(false);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckoutPayment = async () => {
        if (!user || !token) {
            alert("Please log in to enroll and purchase courses.");
            return navigate('/login');
        }

        if (paying || !course?._id) return;
        setPaying(true);

        try {
            // 💡 Cleanup: Rely on the shared Axios instance headers managed by your AuthContext
            const orderResponse = await api.post('/api/enrollments/order', {
                courseId: course._id
            });

            const { order_id, amount, currency, mode } = orderResponse.data;
            const isMockMode = mode === "mock";

            if (isMockMode) {
                const confirmMock = window.confirm(
                    `🧪 TEST MODE ACTIVE\n\nCourse: ${course.title}\nAmount: ₹${course.price}\n\nSimulate successful payment?`
                );

                if (confirmMock) {
                    const verifyRes = await api.post('/api/enrollments/verify', {
                        razorpay_order_id: order_id,
                        razorpay_payment_id: "pay_mock_" + Date.now(),
                        isMockSandboxSuccess: true
                    });

                    if (verifyRes.data.success) {
                        alert("🎉 Mock Payment Successful!");
                        navigate('/dashboard');
                    }
                }
                return;
            }

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert("Razorpay SDK failed to load");
                return;
            }

            const options = {
                key: RAZORPAY_KEY,
                amount: amount,
                currency: currency || "INR",
                name: "ZenithAcad Portal",
                description: `Purchase: ${course.title}`,
                order_id: order_id,
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/api/enrollments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            alert("🎉 Payment Successful!");
                            navigate('/dashboard');
                        }
                    } catch (err) {
                        alert("Payment verification failed");
                    }
                },
                prefill: { name: user.name, email: user.email },
                theme: { color: "#007bff" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            alert(error.response?.data?.message || "Order creation failed.");
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <p style={{ padding: '2rem' }}>Loading course...</p>;
    if (!course) return <p style={{ padding: '2rem' }}>Course not found.</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
            <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <h2>{course.title}</h2>
                <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.6' }}>{course.description}</p>
                <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ margin: '0', color: '#666' }}>Instructor: <strong>{course.instructor}</strong></p>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#28a745', fontSize: '1.4rem', fontWeight: 'bold' }}>₹{course.price}</p>
                    </div>


                    <button
                        onClick={() => {
                            if (alreadyEnrolled) {
                                navigate(`/learn/${course._id}`);
                            } else {
                                handleCheckoutPayment();
                            }
                        }}
                        disabled={paying}
                        style={{
                            backgroundColor: paying
                                ? '#6c757d'
                                : alreadyEnrolled
                                    ? '#007bff'
                                    : '#28a745',
                            color: 'white',
                            fontSize: '1.1rem',
                            border: 'none',
                            padding: '0.75rem 2rem',
                            borderRadius: '6px',
                            cursor: paying ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {paying
                            ? 'Processing...'
                            : alreadyEnrolled
                                ? 'Go To Course'
                                : 'Enroll & Pay Now'}
                    </button>


                </div>
            </div>
        </div>
    );
};

export default CourseDetail;