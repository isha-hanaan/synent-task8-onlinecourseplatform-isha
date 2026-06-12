// frontend/src/pages/EditCourse.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EditCourse = () => {

    const { id } = useParams();
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        category: '',
        level: '',
        price: ''
    });

    useEffect(() => {
        fetchCourse();
    }, []);

    const fetchCourse = async () => {

        try {

            const { data } = await api.get(`/api/courses/${id}`);

            setFormData({
                title: data.data.title || '',
                description: data.data.description || '',
                instructor: data.data.instructor || '',
                category: data.data.category || '',
                level: data.data.level || '',
                price: data.data.price || ''
            });

        } catch (error) {
            console.error(error);
        }

    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.put(
                `/api/courses/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert('Course updated successfully');

        } catch (error) {

            alert(
                error.response?.data?.message ||
                'Update failed'
            );

        }

    };

    return (
        <div style={{ padding: '2rem' }}>

            <h1>Edit Course</h1>

            <form onSubmit={handleSubmit}>

                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />

                <br /><br />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">
                    Update Course
                </button>

            </form>

        </div>
    );
};

export default EditCourse;