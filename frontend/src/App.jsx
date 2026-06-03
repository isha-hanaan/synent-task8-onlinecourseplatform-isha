import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Courses from './pages/Courses';       // Added Phase 5
import CourseDetail from './pages/CourseDetail'; // Added Phase 5
import LearningPage from './pages/LearningPage';

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Course Discovery Routes */}
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Protected Student Dashboard */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learn/:courseId"
                        element={
                            <ProtectedRoute>
                                <LearningPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Default redirect - sends unauthenticated users to the marketplace */}
                    <Route path="/" element={<Navigate to="/courses" replace />} />

                    {/* Catch-all fallback */}
                    <Route path="*" element={<Navigate to="/courses" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;