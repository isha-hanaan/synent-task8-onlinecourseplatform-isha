import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const { data } = await api.get(`http://127.0.0.1:5000/api/courses/${id}`);
                setCourse(data.data);
            } catch (error) {
                console.error("Error fetching course metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [id]);

    // Helper utility injects the dynamic Razorpay payment script overlay into the HTML layout
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
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

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Register the payment order on your backend
            const orderResponse = await axios.post(
                'http://127.0.0.1:5000/api/enrollments/order',
                { courseId: course._id },
                config
            );

            const { order_id, amount } = orderResponse.data;

            // 2. Attempt to load the official Razorpay popup script

            const scriptLoaded = await loadRazorpayScript();
            const testKeyExist = import.meta.env.VITE_RAZORPAY_KEY_ID;

            if (scriptLoaded && testKeyExist && testKeyExist !== "your_razorpay_key_id_here") {
                // OPTION A: If Razorpay keys exist later, use the real modal
                const checkoutOptions = {
                    key: testKeyExist,
                    amount: amount,
                    currency: "INR",
                    name: "ZenithAcad Portal",
                    description: `Purchase for: ${course.title}`,
                    order_id: order_id,
                    handler: async function (response) {
                        const verifyPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        };
                        const verifyRes = await axios.post('http://127.0.0.1:5000/api/enrollments/verify', verifyPayload, config);
                        if (verifyRes.data.success) {
                            alert("🎉 Payment Successful! Course unlocked.");
                            navigate('/dashboard');
                        }
                    },
                    prefill: { name: user.name, email: user.email },
                    theme: { color: "#007bff" }
                };
                const paymentWindowInstance = new window.Razorpay(checkoutOptions);
                paymentWindowInstance.open();
            } else {
                // OPTION B: Account-Free Developer Sandbox Mode (Perfect for testing!)
                const userConfirmed = window.confirm(
                    `✨ ZenithAcad Sandbox Gateway ✨\n\nCourse: ${course.title}\nAmount: ₹${course.price}\nOrder ID: ${order_id}\n\nClick "OK" to simulate a successful payment authorization.`
                );

                if (userConfirmed) {
                    // Generate a fake success signature that bypasses backend check constraints for testing
                    const mockVerifyPayload = {
                        razorpay_order_id: order_id,
                        razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substring(2, 11),
                        isMockSandboxSuccess: true // Tells backend to automatically approve
                    };

                    const verifyRes = await axios.post('http://127.0.0.1:5000/api/enrollments/verify', mockVerifyPayload, config);

                    if (verifyRes.data.success) {
                        alert("🎉 Sandbox Payment Authorized! Course unlocked successfully.");
                        navigate('/dashboard');
                    }
                }
            }

        } catch (error) {
            alert(error.response?.data?.message || "Order tracking registration failed.");
        }
    };


    if (loading) return <p style={{ padding: '2rem' }}>Parsing item schemas...</p>;
    if (!course) return <p style={{ padding: '2rem' }}>Target item data matching ID could not be parsed.</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
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
                        onClick={handleCheckoutPayment}
                        style={{ backgroundColor: '#28a745', color: 'white', fontSize: '1.1rem', border: 'none', padding: '0.75rem 2rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Enroll & Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;