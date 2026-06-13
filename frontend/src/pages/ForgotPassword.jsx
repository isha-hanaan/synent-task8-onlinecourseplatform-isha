// frontend/src/pages/ForgotPassword.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const ForgotPassword = () => {
   const { forgotPassword, loading, error, clearError } = useAuth();
   const [email, setEmail] = useState('');
   const [success, setSuccess] = useState('');
   const [localError, setLocalError] = useState('');

   useEffect(() => {
      clearError();
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLocalError('');
      setSuccess('');

      if (!email) {
         setLocalError('Please enter your email address.');
         return;
      }

      try {
         const result = await forgotPassword(email);
         setSuccess(result?.message || 'Reset link sent successfully!');
         setEmail('');
      } catch (err) {
         if (!error) {
            setLocalError(err.response?.data?.message || 'Failed to send reset email');
         }
      }
   };

   const activeErrorMsg = localError || error;

   return (
      <div className="auth-container">
         <div className="auth-card">
            <h1>Reset Password</h1>
            <p className="auth-subtitle">Enter your email to receive a reset link</p>

            {activeErrorMsg && (
               <div className="error-message">
                  {activeErrorMsg}
               </div>
            )}

            {success && (
               <div className="success-message">
                  {success}
               </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
               <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                     type="email"
                     id="email"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     disabled={loading}
                  />
               </div>

               <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
               </button>
            </form>
         </div>
      </div>
   );
};

export default ForgotPassword;