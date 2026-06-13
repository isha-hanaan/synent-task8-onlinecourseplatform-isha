// frontend/src/pages/AddLesson.jsx

import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminForms.css';

const AddLesson = () => {

    const { token } = useAuth();
    const [modules, setModules] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        module: '',
        duration: '',
        order: 1
    });

    useEffect(() => {
        fetchModules();
    }, [token]);

    const fetchModules = async () => {

        try {

            const { data } = await api.get(
                '/api/modules',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setModules(data.data || []);

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
                order: Number(formData.order)
            };

            await api.post(
                '/api/lessons',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert('Lesson created');

            setFormData({
                title: '',
                description: '',
                videoUrl: '',
                module: '',
                duration: '',
                order: 1
            });

        } catch (error) {

            alert(
                error.response?.data?.message ||
                'Failed to create lesson'
            );

        }
    };

    return (
        <AdminLayout>

            <div className="admin-form-page">

                <h1>Add Lesson</h1>

                <form
                    className="admin-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        name="title"
                        placeholder="Lesson title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <input
                        name="videoUrl"
                        placeholder="Youtube Embed URL"
                        value={formData.videoUrl}
                        onChange={handleChange}
                    />

                    <select
                        name="module"
                        value={formData.module}
                        onChange={handleChange}
                    >
                        <option value="">Select Module</option>

                        {modules.map(module => (

                            <option
                                key={module._id}
                                value={module._id}
                            >
                                {module.title}
                            </option>

                        ))}

                    </select>

                    <input
                        name="duration"
                        placeholder="10:00"
                        value={formData.duration}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Create Lesson
                    </button>
                </form>

            </div>
        </AdminLayout>
    );
};

export default AddLesson;