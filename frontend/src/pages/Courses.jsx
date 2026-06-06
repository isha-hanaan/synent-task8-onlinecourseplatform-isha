import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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

                // 💡 BUG FIX: Removed hardcoded localhost:5000 absolute string. 
                // Let the api service structure hook your env VITE_API_URL variables natively.
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
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Explore Available Courses</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
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
                <p>Loading course catalogue...</p>
            ) : courses.length === 0 ? (
                <p>No courses found matching your criteria.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: '#fff' }}
                        >
                            <div style={{ padding: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#007bff', fontWeight: 'bold', textTransform: 'uppercase' }}>{course.category}</span>
                                <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>{course.title}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', height: '60px', overflow: 'hidden', lineHeight: '1.4' }}>{course.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{course.price}</span>
                                    <button
                                        onClick={() => navigate(`/courses/${course._id}`)}
                                        style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Courses;