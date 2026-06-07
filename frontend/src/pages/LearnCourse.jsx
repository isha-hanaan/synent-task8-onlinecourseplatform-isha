import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LearnCourse = () => {

    console.log("LearnCourse rendered");

    const { id } = useParams();
    const { token } = useAuth();

    const [modules, setModules] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lessonsByModule, setLessonsByModule] = useState({});
    const [completedLessons, setCompletedLessons] = useState([]);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {

        console.log("fetchModules called");

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const moduleRes = await api.get(
                `/api/modules/${id}`,
                config
            );

            setModules(moduleRes.data.data);

            const lessonsMap = {};

            for (const module of moduleRes.data.data) {
                const lessonRes = await api.get(
                    `/api/lessons/${module._id}`,
                    config
                );

                lessonsMap[module._id] = lessonRes.data.data;
            }

            setLessonsByModule(lessonsMap);

            const enrollmentRes = await api.get(
                '/api/enrollments',
                config
            );

            const currentEnrollment = enrollmentRes.data.data.find(
                (item) => item.course._id === id
            );

            if (currentEnrollment) {
                setCompletedLessons(currentEnrollment.completedLessons || []);
            }

            console.log("Enrollment:", currentEnrollment);
            console.log("Completed Lessons:", currentEnrollment?.completedLessons);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markLessonComplete = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await api.post(
                '/api/enrollments/lesson-complete',
                {
                    courseId: id,
                    lessonId: selectedLesson._id
                },
                config
            );

            setCompletedLessons(data.completedLessons);

            alert('Lesson marked completed!');
        } catch (err) {
            console.error(err);
            alert('Failed to update lesson progress');
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Course Learning Page</h2>

            {selectedLesson && (
                <div
                    style={{
                        marginBottom: '30px'
                    }}
                >
                    <h2>{selectedLesson.title}</h2>

                    <video
                        width="800"
                        controls
                    >
                        <source
                            src={selectedLesson.videoUrl}
                            type="video/mp4"
                        />

                        Your browser does not support the video tag.
                    </video>

                    <p>{selectedLesson.description}</p>

                    <button
                        onClick={markLessonComplete}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {
                            completedLessons.includes(selectedLesson._id)
                                ? '✔ Completed'
                                : 'Mark Lesson Complete'
                        }
                    </button>

                </div>
            )}

            {modules.map((module) => (
                <div key={module._id}>
                    <h3>{module.title}</h3>

                    {lessonsByModule[module._id]?.map((lesson) => (
                        <div
                            key={lesson._id}
                            style={{
                                marginLeft: '20px',
                                cursor: 'pointer',
                                padding: '8px'
                            }}
                            onClick={() => setSelectedLesson(lesson)}
                        >
                            {completedLessons.includes(lesson._id)
                                ? '✔ '
                                : '📹 '}
                            {lesson.title}
                        </div>
                    ))}

                </div>
            ))}

        </div>
    );
};

export default LearnCourse;