import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/LearnCourse.css';

const LearnCourse = () => {
    const { courseId } = useParams();
    const { token } = useAuth();

    const [modules, setModules] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lessonsByModule, setLessonsByModule] = useState({});
    const [completedLessons, setCompletedLessons] = useState([]);
    const [totalLessons, setTotalLessons] = useState(0);
    const [expandedModules, setExpandedModules] = useState({});

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

            const expanded = {};

            moduleRes.data.data.forEach(module => {
                expanded[module._id] = true;
            });

            setExpandedModules(expanded);

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

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return "";

        const regExp =
            /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;

        const match = url.match(regExp);

        return match
            ? `https://www.youtube.com/embed/${match[1]}`
            : "";
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
            goToNextLesson();

        } catch (err) {
            console.error(err);
            alert('Failed to update lesson progress');
        }
    };

    const goToPreviousLesson = () => {

        if (currentLessonIndex > 0) {
            setSelectedLesson(
                allLessons[currentLessonIndex - 1]
            );
        }

        const goToNextLesson = () => {

            if (currentLessonIndex < allLessons.length - 1) {

                const nextLesson = allLessons[currentLessonIndex + 1];

                setSelectedLesson(nextLesson);

                const parentModule = modules.find(module =>
                    lessonsByModule[module._id]?.some(
                        lesson => lesson._id === nextLesson._id
                    )
                );

                if (parentModule) {
                    setExpandedModules(prev => ({
                        ...prev,
                        [parentModule._id]: true
                    }));
                }
            }

        };
    };

    const progressPercentage =
        totalLessons > 0
            ? Math.round(
                (completedLessons.length / totalLessons) * 100
            )
            : 0;

    if (loading) {
        return (
            <div className="learn-loading">
                <h2>Loading course...</h2>
            </div>
        );
    }

    const allLessons = modules.flatMap(
        module => lessonsByModule[module._id] || []
    );

    const currentLessonIndex = allLessons.findIndex(
        lesson => lesson._id === selectedLesson?._id
    );

    const isLastLesson =
        currentLessonIndex === allLessons.length - 1;

    return (
        <div className="learn-page">
            <div className="learn-layout">
                <div className="lesson-section">
                    <div className="learn-header">

                        <div>
                            <span className="course-label">
                                Continue Learning
                            </span>

                            <h1 className="course-title">
                                {selectedLesson?.title || "Course"}
                            </h1>

                            <p className="course-subtitle">
                                Lesson {currentLessonIndex + 1} of {allLessons.length}
                            </p>
                        </div>

                        <div className="progress-circle">
                            <span>{progressPercentage}%</span>
                        </div>
                    </div>

                    <div className="progress-card-modern">

                        <div className="progress-top">
                            <h3>Your Progress</h3>
                            <span>{progressPercentage}%</span>
                        </div>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>

                        <p>
                            {completedLessons.length} of {totalLessons} lessons completed
                        </p>

                    </div>

                    {progressPercentage === 100 && (

                        <div className="course-complete-banner">

                            🎉 Congratulations!

                            <p>
                                You've completed this course.
                            </p>

                        </div>
                    )}

                    {selectedLesson && (
                        <div className="lesson-card">

                            <div className="lesson-info-bar">

                                <span>
                                    📚 Lesson {currentLessonIndex + 1}
                                </span>

                                <span>
                                    ⏱ {selectedLesson.duration}
                                </span>

                            </div>

                            <div className="video-wrapper">
                                <iframe
                                    src={getYoutubeEmbedUrl(selectedLesson.videoUrl)}
                                    title={selectedLesson.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>

                            <p className="lesson-description">
                                {selectedLesson.description}
                            </p>
                            <div className="lesson-actions">

                                <button
                                    className={
                                        completedLessons.includes(selectedLesson._id)
                                            ? "lesson-button completed"
                                            : "lesson-button"
                                    }
                                    onClick={markLessonComplete}
                                    disabled={completedLessons.includes(selectedLesson._id)}
                                >
                                    {completedLessons.includes(selectedLesson._id)
                                        ? "Completed ✓"
                                        : "Mark Lesson Complete"}
                                </button>

                                <button
                                    className="secondary-btn"
                                    onClick={goToPreviousLesson}
                                    disabled={currentLessonIndex === 0}
                                >
                                    ← Previous
                                </button>

                                <button
                                    className="next-lesson-btn"
                                    onClick={goToNextLesson}
                                    disabled={isLastLesson}
                                >
                                    {isLastLesson ? "Last Lesson" : "Next →"}
                                </button>

                            </div>
                        </div>
                    )}
                </div>

                <div className="course-sidebar">
                    <h2 className="sidebar-title">
                        Course Content
                    </h2>
                    <p className="sidebar-progress">
                        {completedLessons.length} / {totalLessons} lessons completed
                    </p>

                    {modules.map((module) => {

                        const moduleLessons =
                            lessonsByModule[module._id] || [];

                        const completedCount =
                            moduleLessons.filter(lesson =>
                                completedLessons.includes(lesson._id)
                            ).length;

                        const moduleCompleted =
                            moduleLessons.length > 0 &&
                            completedCount === moduleLessons.length;

                        return (

                            <div
                                key={module._id}
                                className={
                                    moduleCompleted
                                        ? "module-card completed-module"
                                        : "module-card"
                                }                        >
                                <div
                                    className="module-header"
                                    onClick={() =>
                                        setExpandedModules(prev => ({
                                            ...prev,
                                            [module._id]: !prev[module._id]
                                        }))
                                    }
                                >

                                    <div>

                                        <h3 className="module-title">
                                            {module.title}
                                        </h3>

                                        <span className="module-count">
                                            {lessonsByModule[module._id]?.length || 0} Lessons
                                        </span>

                                    </div>

                                    <span className="module-arrow">
                                        {expandedModules[module._id] ? "⌄" : "›"}
                                    </span>

                                </div>
                                {expandedModules[module._id] &&
                                    lessonsByModule[module._id]?.map((lesson, index) => (
                                        <div
                                            key={lesson._id}
                                            className={
                                                selectedLesson?._id === lesson._id
                                                    ? "lesson-item active"
                                                    : completedLessons.includes(lesson._id)
                                                        ? "lesson-item completed"
                                                        : "lesson-item"
                                            }
                                            onClick={() => setSelectedLesson(lesson)}
                                        >

                                            <div className="lesson-left">

                                                <div className="lesson-number">

                                                    {completedLessons.includes(lesson._id)
                                                        ? "✔"
                                                        : index + 1}

                                                </div>

                                                <div>
                                                    <div className="lesson-name">
                                                        {lesson.title}
                                                    </div>

                                                    <div className="lesson-meta">
                                                        {lesson.duration}
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="lesson-status">

                                                {selectedLesson?._id === lesson._id
                                                    ? "Watching"
                                                    : completedLessons.includes(lesson._id)
                                                        ? "Done"
                                                        : ""}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div >
    );
};

export default LearnCourse;