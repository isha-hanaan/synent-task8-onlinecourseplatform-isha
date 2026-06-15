import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/CourseDetail.css';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const CourseDetail = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const { user, token } = useAuth();
    const [course, setCourse] = useState(null);
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

                    const enrolled = enrollmentsRes.data?.data?.some(
                        (item) => item.course?._id === id
                    ) || false;

                    setAlreadyEnrolled(enrolled);
                }

            } catch (error) {
                console.error("Error fetching course metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [id, token]);

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

            return navigate('/login', {
                state: { from: `/courses/${id}` }
            });
        }

        if (paying || !course?._id) return;
        setPaying(true);

        try {
            const orderResponse = await api.post('/api/enrollments/order', {
                courseId: course._id
            });

            const { order_id, amount, currency, mode } = orderResponse.data;
            const isMockMode = mode === "mock";

            if (isMockMode) {
                const confirmMock = window.confirm(
                    `🧪 TEST MODE ACTIVE\n\nCourse: ${course.title}\nAmount: ₹${course.price}\n\nSimulate successful payment?`
                );

                if (!confirmMock) {
                    setPaying(false);
                    return;
                }

                try {
                    const verifyRes = await api.post('/api/enrollments/verify', {
                        razorpay_order_id: order_id,
                        razorpay_payment_id: "pay_mock_" + Date.now(),
                        isMockSandboxSuccess: true
                    });

                    if (verifyRes.data.success) {
                        setAlreadyEnrolled(true);

                        alert("🎉 Payment Successful!");

                        navigate(`/learn/${course._id}`);
                    }

                } catch (err) {
                    alert("Mock payment verification failed");
                } finally {
                    setPaying(false);
                }
                return;
            }

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setPaying(false);
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
                            setAlreadyEnrolled(true);
                            setPaying(false);

                            alert("🎉 Payment Successful!");

                            navigate(`/learn/${course._id}`);
                        }

                    } catch (err) {
                        setPaying(false);
                        alert("Payment verification failed");
                    }
                },
                prefill: { name: user.name, email: user.email },
                theme: { color: "#007bff" },

                modal: {
                    ondismiss: function () {
                        setPaying(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response) {
                setPaying(false);

                console.error(response.error);

                alert(
                    response.error.description ||
                    "Payment failed. Please try again."
                );
            });

            rzp.open();

        } catch (error) {
            setPaying(false);
            alert(error.response?.data?.message ||
                "Order creation failed."
            );
        }
    };

    if (loading) return <div className="loading-state">
        Loading course...
    </div>;

    if (!course)
        return (
            <div className="loading-state">
                Course not found.
            </div>
        );

    return (
        <div className="course-detail-page">
            <div className="course-detail-header">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Go Back
                </button>

            </div>

            <div className="course-detail-card">
                <div className="course-info">

                    <h2>{course.title}</h2>

                    <p>{course.description}</p>

                    <hr />

                    <p>Instructor: <strong>{course.instructor}</strong></p>

                    <p>₹{Number(course.price || 0).toLocaleString('en-IN')}</p>

                </div>

                <div className="course-actions">

                    <button
                        className={`course-action-btn ${alreadyEnrolled ? 'enrolled' : ''
                            } ${paying ? 'processing' : ''
                            }`}

                        onClick={() => {
                            if (alreadyEnrolled) {
                                navigate(`/learn/${course._id}`);
                            } else {
                                handleCheckoutPayment();
                            }
                        }}
                        disabled={paying}

                    >
                        {paying
                            ? 'Processing...'
                            : alreadyEnrolled
                                ? 'Go To Course'
                                : 'Enroll & Pay Now'}
                    </button>

                </div>
            </div>
        </div >
    );
};

export default CourseDetail;