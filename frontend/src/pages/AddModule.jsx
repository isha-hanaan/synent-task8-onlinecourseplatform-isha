// frontend/src/pages/AddModule.jsx

import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminForms.css';

const AddModule = () => {

    const { token } = useAuth();
    const [courses, setCourses] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        course: '',
        order: 1
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {

        try {

            const { data } = await api.get(
                '/api/courses',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCourses(data.data || []);

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
                '/api/modules',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert('Module created');

            setFormData({
                title: '',
                course: '',
                order: 1
            });

        } catch (error) {

            alert(
                error.response?.data?.message ||
                'Failed'
            );

        }

    };

    return (
        <AdminLayout>

            <div className="admin-form-page">

                <h1>Add Module</h1>

                <form
                    className="admin-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        name="title"
                        placeholder="Module title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                    <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Course
                        </option>

                        {courses.map(course => (

                            <option
                                key={course._id}
                                value={course._id}
                            >
                                {course.title}
                            </option>

                        ))}

                    </select>

                    <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Create Module
                    </button>

                </form>
            </div>
        </AdminLayout>
    );
};

export default AddModule;