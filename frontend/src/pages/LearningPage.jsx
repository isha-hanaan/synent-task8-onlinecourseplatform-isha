import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LearningPage = () => {
    const { courseId } = useParams();
    const { token } = useAuth();

    const [modules, setModules] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const moduleRes = await axios.get(
                `http://localhost:5000/api/modules/${courseId}`
            );

            const moduleData = moduleRes.data.data;

            // Load lessons for each module
            const modulesWithLessons = await Promise.all(
                moduleData.map(async (module) => {
                    const lessonRes = await axios.get(
                        `http://localhost:5000/api/lessons/${module._id}`
                    );

                    return {
                        ...module,
                        lessons: lessonRes.data.data
                    };
                })
            );

            setModules(modulesWithLessons);

            // Select first lesson automatically
            if (
                modulesWithLessons.length > 0 &&
                modulesWithLessons[0].lessons.length > 0
            ) {
                setSelectedLesson(
                    modulesWithLessons[0].lessons[0]
                );
            }

        } catch (error) {
            console.error(error);
        }
    };

    const handleCompleteLesson = async () => {
        try {
            await axios.post(
                'http://localhost:5000/api/enrollments/lesson-complete',
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

            alert('Lesson marked complete!');
        }
        catch (error) {
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

                        {module.lessons.map((lesson) => (
                            <div
                                key={lesson._id}
                                style={{
                                    cursor: 'pointer',
                                    padding: '8px'
                                }}
                                onClick={() => setSelectedLesson(lesson)}
                            >
                                {lesson.title}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Video Section */}
            <div style={{ flex: 1 }}>
                {selectedLesson ? (
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
                            style={{
                                marginTop: '20px',
                                padding: '12px 20px'
                            }}
                        >
                            Mark Lesson Complete
                        </button>

                    </>
                ) : (
                    <h2>Select a lesson</h2>
                )}
            </div>

        </div>
    );
};

export default LearningPage;