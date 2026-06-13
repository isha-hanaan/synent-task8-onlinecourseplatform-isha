// frontend/src/pages/Courses.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

import Sidebar from '../components/Sidebar';
import '../styles/Courses.css';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);

                let url = `/api/courses?search=${encodeURIComponent(search)}`;
                if (category) url += `&category=${encodeURIComponent(category)}`;

                const { data } = await api.get(url);
                setCourses(data.data || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchCourses();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search, category]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <div className="courses-container">

                    <div className="page-header">
                        <h1>Explore Courses</h1>
                        <p>Find the right course to advance your skills and career.</p>
                    </div>

                    <div className="courses-filters">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="courses-search"
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="courses-select"
                        >
                            <option value="">All Categories</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {loading ? (

                        <div className="empty-state">
                            <h3>Loading courses...</h3>
                            <p>Please wait a moment.</p>
                        </div>

                    ) : courses.length === 0 ? (

                        <div className="empty-state">
                            <h3>No courses found</h3>
                            <p>Try changing your search or category filter.</p>
                        </div>

                    ) : (
                        <div className="course-list-grid">
                            {courses.map((course) => (

                                <div
                                    key={course._id}
                                    className="course-list-card"
                                >

                                    <div className="course-list-content">

                                        <span className="course-category">
                                            {course.category || 'General'}
                                        </span>

                                        <h3 className="course-title">
                                            {course.title || 'Untitled Course'}
                                        </h3>

                                        <p className="course-description">
                                            {course.description || 'No description available.'}
                                        </p>

                                        <div className="course-footer">

                                            <span className="course-price">
                                                ₹{course.price || 0}
                                            </span>

                                            <button
                                                className="course-btn"
                                                onClick={() => navigate(`/courses/${course._id}`)}
                                            >
                                                Explore Course →
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Courses;