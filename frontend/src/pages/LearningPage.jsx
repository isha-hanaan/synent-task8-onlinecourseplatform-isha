// frontend/src/pages/LearningPage.jsx

import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/LearningPage.css';
import { useNavigate } from 'react-router-dom';

const LearningPage = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [completedLessons, setCompletedLessons] = useState(
        location.state?.completedLessons || []
    );
    const [modules, setModules] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const allLessons = modules.flatMap(module => module.lessons || []);
    const currentIndex = allLessons.findIndex(
        lesson => lesson._id === selectedLesson?._id
    );

    const isLessonCompleted =
        completedLessons.includes(selectedLesson?._id);

    useEffect(() => {
        if (!token) return;
        fetchModules();
    }, [token, courseId]);

    const fetchModules = async () => {
        try {
            const moduleRes = await api.get(
                `/api/modules/${courseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const moduleData = moduleRes.data.data || [];

            // Load lessons for each module
            const modulesWithLessons = await Promise.all(
                moduleData.map(async (module) => {
                    const lessonRes = await api.get(
                        `/api/lessons/${module._id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    return {
                        ...module,
                        lessons: lessonRes.data.data || []
                    };
                })
            );

            setModules(modulesWithLessons);

            const enrollmentRes = await api.get(
                '/api/enrollments',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const currentEnrollment = enrollmentRes.data.data.find(
                item => item.course._id === courseId
            );

            if (currentEnrollment) {
                setCompletedLessons(currentEnrollment.completedLessons || []);
            }



            const fetchedLessons = modulesWithLessons.flatMap(
                module => module.lessons
            );

            const completed =
                currentEnrollment?.completedLessons || [];

            const nextLesson = fetchedLessons.find(
                lesson => !completed.includes(lesson._id)
            );

            if (nextLesson) {
                setSelectedLesson(nextLesson);
            } else if (fetchedLessons.length > 0) {
                setSelectedLesson(fetchedLessons[0]);
            }



        } catch (error) {
            console.error(error);
        }
    };

    const handleCompleteLesson = async () => {
        try {
            const response = await api.post(
                '/api/enrollments/lesson-complete',
                {
                    courseId,
                    lessonId: selectedLesson._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCompletedLessons(response.data.completedLessons);
            alert('Lesson marked complete!');

            if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
                setSelectedLesson(allLessons[currentIndex + 1]);
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="learning-header">

                <button
                    className="back-btn"
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back to Dashboard
                </button>

                <div className="learning-header-info">
                    <h2>
                        {selectedLesson?.title || 'Learning'}
                    </h2>

                    <p>
                        Progress: {completedLessons.length} / {allLessons.length} lessons completed
                    </p>
                </div>

            </div>

            <div className="learning-page">
                {/* Sidebar */}
                <div className="course-sidebar">
                    <h2>Course Content</h2>
                    {modules.map((module) => (

                        <div
                            key={module._id}
                            className="module-card"
                        >
                            <div className="module-title">
                                {module.title}
                            </div>

                            {module.lessons?.map((lesson) => (

                                <div
                                    key={lesson._id}
                                    className={`lesson-item ${selectedLesson?._id === lesson._id
                                        ? 'active'
                                        : ''
                                        }`}
                                    onClick={() => setSelectedLesson(lesson)}
                                >


                                    <span>{lesson.title}</span>
                                    {completedLessons.includes(lesson._id) && (

                                        <span className="lesson-check">
                                            ✓
                                        </span>

                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Video Section */}
                <div className="video-section">
                    {currentIndex === allLessons.length - 1 &&
                        isLessonCompleted ? (
                        <div className="course-complete">
                            <h1>🎉 Course Completed!</h1>
                            <h3>Congratulations on finishing this course.</h3>

                            <button
                                className="review-btn"
                                onClick={() => setSelectedLesson(allLessons[0])}
                            >

                                Review Course
                            </button>
                        </div>
                    ) : (
                        selectedLesson ? (
                            <>
                                <h2>{selectedLesson.title}</h2>

                                <iframe
                                    className="lesson-video"
                                    src={selectedLesson.videoUrl}
                                    title={selectedLesson.title}
                                    allowFullScreen
                                />

                                <button
                                    className={`complete-btn ${isLessonCompleted ? 'completed' : ''}`}
                                    onClick={handleCompleteLesson}
                                    disabled={isLessonCompleted}
                                >

                                    {isLessonCompleted
                                        ? '✓ Completed'
                                        : 'Mark Lesson Complete'}
                                </button>

                                <div className="lesson-navigation">
                                    <button
                                        disabled={currentIndex <= 0}
                                        onClick={() => setSelectedLesson(allLessons[currentIndex - 1])}
                                    >
                                        ← Previous Lesson
                                    </button>
                                    <button
                                        disabled={currentIndex === allLessons.length - 1}
                                        onClick={() => setSelectedLesson(allLessons[currentIndex + 1])}
                                    >
                                        Next Lesson →
                                    </button>
                                </div>
                            </>
                        ) : (

                            <div className="loading-state">
                                Loading course...
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default LearningPage;