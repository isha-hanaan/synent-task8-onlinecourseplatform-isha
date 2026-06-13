// frontend/src/pages/EditCourse.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminForms.css';

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

            const payload = {
                ...formData,
                price: Number(formData.price)
            };

            await api.put(
                `/api/courses/${id}`,
                payload,
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
        <AdminLayout>
            <div className="admin-form-page">

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

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select Category</option>

                        <option value="Web Development">Web Development</option>
                        <option value="Backend Development">Backend Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Design">Design</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Other">Other</option>
                    </select>

                    <br /><br />

                    <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                    >
                        <option value="Beginner">
                            Beginner
                        </option>

                        <option value="Intermediate">
                            Intermediate
                        </option>

                        <option value="Advanced">
                            Advanced
                        </option>
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
                        Update Course
                    </button>

                </form>

            </div>
        </AdminLayout>
    );
};

export default EditCourse;