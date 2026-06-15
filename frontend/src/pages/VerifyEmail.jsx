import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const hasVerified = useRef(false);

    const [message, setMessage] = useState('Verifying email...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (hasVerified.current) return;
        hasVerified.current = true;

        const verify = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/auth/verify/${token}`
                );

                setMessage(res.data.message);

                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);

            } catch (err) {
                setMessage(
                    err.response?.data?.message ||
                    'Verification failed'
                );
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [token]);

    return (
        <div style={{ padding: '40px' }}>
            <h2>Email Verification</h2>
            <p>{loading ? 'Please wait...' : message}</p>
        </div>
    );
};

export default VerifyEmail;