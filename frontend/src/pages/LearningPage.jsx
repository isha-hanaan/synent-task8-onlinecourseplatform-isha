import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LearningPage = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const { token } = useAuth();

    const [completedLessons, setCompletedLessons] = useState(
        location.state?.completedLessons || []
    );
    const [modules, setModules] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

    // 1. Move helper derivations up so handlers can safely reference them
    const allLessons = modules.flatMap(module => module.lessons || []);
    const currentIndex = allLessons.findIndex(
        lesson => lesson._id === selectedLesson?._id
    );

    useEffect(() => {
        fetchModules();
    }, []);

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

            const fetchedLessons = modulesWithLessons.flatMap(
                module => module.lessons
            );

            const nextLesson = fetchedLessons.find(
                lesson => !completedLessons.includes(lesson._id)
            );

            if (nextLesson) {
                setSelectedLesson(nextLesson);
            } else if (fetchedLessons.length > 0) {
                // all lessons completed, default to first
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

            // 2. Now safely accesses top-level values without initialization errors
            if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
                setSelectedLesson(allLessons[currentIndex + 1]);
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '30px', padding: '20px' }}>
            {/* Sidebar */}
            <div style={{ width: '300px' }}>
                <h2>Course Content</h2>
                {modules.map((module) => (
                    <div key={module._id}>
                        <h3>{module.title}</h3>
                        {module.lessons?.map((lesson) => (
                            <div
                                key={lesson._id}
                                style={{
                                    cursor: 'pointer',
                                    padding: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: selectedLesson?._id === lesson._id ? '#dbeafe' : 'transparent',
                                    border: selectedLesson?._id === lesson._id ? '1px solid #3b82f6' : '1px solid transparent',
                                    borderRadius: '6px'
                                }}
                                onClick={() => setSelectedLesson(lesson)}
                            >
                                <span>{lesson.title}</span>
                                {completedLessons.includes(lesson._id) && (
                                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Video Section */}
            <div style={{ flex: 1 }}>
                {currentIndex === allLessons.length - 1 && completedLessons.includes(selectedLesson?._id) ? (
                    <div style={{ textAlign: 'center', padding: '80px' }}>
                        <h1>🎉 Course Completed!</h1>
                        <h3>Congratulations on finishing this course.</h3>
                        <button
                            onClick={() => setSelectedLesson(allLessons[0])}
                            style={{ marginTop: '20px', padding: '15px 25px' }}
                        >
                            Review Course
                        </button>
                    </div>
                ) : (
                    selectedLesson ? (
                        <>
                            <h2>{selectedLesson.title}</h2>
                            <iframe
                                width="100%"
                                height="500"
                                src={selectedLesson.videoUrl}
                                title={selectedLesson.title}
                                allowFullScreen
                            />
                            <button
                                onClick={handleCompleteLesson}
                                style={{ marginTop: '20px', padding: '12px 20px' }}
                            >
                                Mark Lesson Complete
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
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
                        <h2>Select a lesson</h2>
                    )
                )}
            </div>
        </div>
    );
};

export default LearningPage;