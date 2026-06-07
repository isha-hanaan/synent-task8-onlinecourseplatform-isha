import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddCourse = () => {

    const { token } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        category: '',
        level: 'Beginner',
        price: 0
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await api.post(
                '/api/courses',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert('Course created successfully');

            setFormData({
                title: '',
                description: '',
                instructor: '',
                category: '',
                level: 'Beginner',
                price: 0
            });

        } catch (error) {

            alert(
                error.response?.data?.message ||
                'Failed to create course'
            );

        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Add Course</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="title"
                    placeholder="Course title"
                    value={formData.title}
                    onChange={handleChange}
                />

                <br /><br />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="instructor"
                    placeholder="Instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                />

                <br /><br />

                <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </select>

                <br /><br />

                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">
                    Create Course
                </button>

            </form>
        </div>
    );
};

export default AddCourse;