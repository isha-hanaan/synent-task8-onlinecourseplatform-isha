import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

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

            const { data } = await api.get('/api/courses');

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

            await api.post(
                '/api/modules',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert('Module created');

        } catch (error) {

            alert(
                error.response?.data?.message ||
                'Failed'
            );

        }

    };

    return (
        <div style={{ padding: '2rem' }}>

            <h1>Add Module</h1>

            <form onSubmit={handleSubmit}>

                <input
                    name="title"
                    placeholder="Module title"
                    value={formData.title}
                    onChange={handleChange}
                />

                <br /><br />

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

                <br /><br />

                <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                />

                <br /><br />

                <button>
                    Create Module
                </button>

            </form>

        </div>
    );
};

export default AddModule;