// frontend/src/pages/LearnCourse.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LearnCourse = () => {


    const { courseId } = useParams();
    const { token } = useAuth();

    const [modules, setModules] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lessonsByModule, setLessonsByModule] = useState({});
    const [completedLessons, setCompletedLessons] = useState([]);
    const [totalLessons, setTotalLessons] = useState(0);



    useEffect(() => {
        if (token) {
            fetchModules();
        }
    }, [token]);



    const fetchModules = async () => {


        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const moduleRes = await api.get(
                `/api/modules/${courseId}`,
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

            const firstModule = moduleRes.data.data[0];

            if (
                firstModule &&
                lessonsMap[firstModule._id]?.length > 0
            ) {
                setSelectedLesson(
                    lessonsMap[firstModule._id][0]
                );
            }

            let lessonCount = 0;

            Object.values(lessonsMap).forEach(
                lessons => lessonCount += lessons.length
            );

            setTotalLessons(lessonCount);

            const enrollmentRes = await api.get(
                '/api/enrollments',
                config
            );

            const currentEnrollment = enrollmentRes.data.data.find(
                (item) => item.course._id === courseId
            );

            if (currentEnrollment) {
                setCompletedLessons(currentEnrollment.completedLessons || []);
            }


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
                    courseId: courseId,
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

    const progressPercentage =
        totalLessons > 0
            ? Math.round(
                (completedLessons.length / totalLessons) * 100
            )
            : 0;




    if (loading) {
        return (
            <div
                style={{
                    padding: '2rem',
                    textAlign: 'center'
                }}
            >
                <h2>Loading course...</h2>
            </div>
        );
    }



    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '30px',
                padding: '2rem'
            }}
        >
            {/* LEFT SIDE */}
            <div>

                <h2>Course Learning Page</h2>

                <div
                    style={{
                        marginBottom: '30px'
                    }}
                >

                    <h3>
                        Progress: {progressPercentage}%
                    </h3>

                    <div
                        style={{
                            background: '#ddd',
                            height: '10px',
                            borderRadius: '10px'
                        }}
                    >
                        <div
                            style={{
                                width: `${progressPercentage}%`,
                                height: '100%',
                                background: '#6c63ff',
                                borderRadius: '10px'
                            }}
                        />
                    </div>
                </div>
                {selectedLesson && (
                    <div
                        style={{
                            background: '#24293c',
                            padding: '25px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 12px rgba(0,0,0,.1)',
                            marginBottom: '30px'
                        }}
                    >
                        <h2
                            style={{
                                color: 'white'
                            }}
                        >
                            {selectedLesson.title}
                        </h2>

                        <video
                            controls
                            style={{
                                width: '100%',
                                borderRadius: '10px'
                            }}
                        >
                            <source
                                src={selectedLesson.videoUrl}
                                type="video/mp4"
                            />

                            Your browser does not support the video tag.
                        </video>

                        <p
                            style={{
                                color: '#d1d5db'
                            }}
                        >
                            {selectedLesson.description}
                        </p>

                        <button
                            onClick={markLessonComplete}
                            disabled={completedLessons.includes(selectedLesson._id)}

                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',

                                backgroundColor:
                                    completedLessons.includes(selectedLesson._id)
                                        ? '#6c757d'
                                        : '#28a745',
                                cursor:
                                    completedLessons.includes(selectedLesson._id)
                                        ? 'default'
                                        : 'pointer'
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
            </div>

            {/* RIGHT SIDE */}
            <div
                style={{
                    position: 'sticky',
                    top: '20px',
                    alignSelf: 'start'
                }}
            >
                <h2>Course Content</h2>

                <p
                    style={{
                        color: '#666',
                        marginBottom: '20px'
                    }}
                >
                    {completedLessons.length} / {totalLessons} lessons completed
                </p>

                {modules.map((module) => (

                    <div
                        key={module._id}
                        style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            marginBottom: '20px',
                            borderRadius: '10px'
                        }}
                    >
                        <h3>{module.title}</h3>

                        {lessonsByModule[module._id]?.map((lesson) => (



                            <div
                                key={lesson._id}
                                style={{
                                    marginLeft: '20px',
                                    cursor: 'pointer',
                                    padding: '12px',
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor:
                                        selectedLesson?._id === lesson._id
                                            ? '#dbe4ff'
                                            : completedLessons.includes(lesson._id)
                                                ? '#e8f9ee'
                                                : 'white'
                                }}
                                onClick={() => setSelectedLesson(lesson)}
                            >




                                {
                                    completedLessons.includes(lesson._id)
                                        ? '✔ '
                                        : '▶ '
                                }

                                {lesson.title}

                                <span
                                    style={{
                                        float: 'right',
                                        color: '#888',
                                        fontSize: '14px'
                                    }}
                                >
                                    {lesson.duration}
                                </span>

                            </div>
                        ))}

                    </div>
                ))}

            </div >
        </div >

    );
};

export default LearnCourse;