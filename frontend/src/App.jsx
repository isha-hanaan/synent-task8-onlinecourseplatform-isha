/* frontend/src/App.jsx */

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LearningPage from './pages/LearningPage';
import AdminDashboard from './pages/AdminDashboard';
import AddCourse from './pages/AddCourse';
import AdminCourses from './pages/AdminCourses';
import EditCourse from './pages/EditCourse';
import AddModule from './pages/AddModule';
import AddLesson from './pages/AddLesson';
import AdminUsers from "./pages/AdminUsers";
import AdminEnrollments from "./pages/AdminEnrollments";
import PaymentHistory from './pages/PaymentHistory';
import VerifyEmail from './pages/VerifyEmail';

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
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />
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
                        path="/payments"
                        element={
                            <ProtectedRoute>
                                <PaymentHistory />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/add-course"
                        element={
                            <ProtectedRoute adminOnly>
                                <AddCourse />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/courses"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminCourses />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/edit-course/:id"
                        element={
                            <ProtectedRoute adminOnly>
                                <EditCourse />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/add-module"
                        element={
                            <ProtectedRoute adminOnly>
                                <AddModule />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/add-lesson"
                        element={
                            <ProtectedRoute adminOnly>
                                <AddLesson />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminUsers />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/enrollments"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminEnrollments />
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