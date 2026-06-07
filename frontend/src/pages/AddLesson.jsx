import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

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
    }, []);

    const fetchModules = async () => {

        try {

            const { data } = await api.get('/api/modules');

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

            await api.post(
                '/api/lessons',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert('Lesson created');

        } catch (error) {

            alert(
                error.response?.data?.message ||
                'Failed to create lesson'
            );

        }

    };

    return (
        <div style={{ padding: '2rem' }}>

            <h1>Add Lesson</h1>

            <form onSubmit={handleSubmit}>

                <input
                    name="title"
                    placeholder="Lesson title"
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
                    name="videoUrl"
                    placeholder="Youtube Embed URL"
                    value={formData.videoUrl}
                    onChange={handleChange}
                />

                <br /><br />

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

                <br /><br />

                <input
                    name="duration"
                    placeholder="10:00"
                    value={formData.duration}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                />

                <br /><br />

                <button>
                    Create Lesson
                </button>

            </form>

        </div>
    );
};

export default AddLesson;