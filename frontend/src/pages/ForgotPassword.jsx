import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const ForgotPassword = () => {
   const { forgotPassword, loading, error } = useAuth();
   const [email, setEmail] = useState('');
   const [success, setSuccess] = useState('');
   const [localError, setLocalError] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLocalError('');
      setSuccess('');

      if (!email) {
         setLocalError('Please enter your email');
         return;
      }

      try {
         const result = await forgotPassword(email);
         setSuccess(result.message);
         setEmail('');
      } catch (err) {
         setLocalError(err.response?.data?.message || 'Failed to send reset email');
      }
   };

   return (
      <div className="auth-container">
         <div className="auth-card">
            <h1>Reset Password</h1>
            <p className="auth-subtitle">Enter your email to receive a reset link</p>

            {(error || localError) && (
               <div className="error-message">
                  {error || localError}
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