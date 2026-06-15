import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminForms.css';

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
            const payload = {
                ...formData,
                price: Number(formData.price) || 0
            };

            await api.post('/api/courses', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

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
        <AdminLayout>
            <div className="admin-form-page">
                <h1>Add Course</h1>

                <form
                    className="admin-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        name="title"
                        placeholder="Course title"
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
                        type="text"
                        name="instructor"
                        placeholder="Instructor"
                        value={formData.instructor}
                        onChange={handleChange}
                    />

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select Category
                        </option>

                        <option value="Web Development">
                            Web Development
                        </option>

                        <option value="Backend Development">
                            Backend Development
                        </option>

                        <option value="Data Science">
                            Data Science
                        </option>

                        <option value="UI/UX Design">
                            UI/UX Design
                        </option>

                        <option value="Design">
                            Design
                        </option>

                        <option value="Mobile Development">
                            Mobile Development
                        </option>

                        <option value="Cybersecurity">
                            Cybersecurity
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </select>

                    <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>

                    <input
                        type="number"
                        name="price"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Create Course
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddCourse;