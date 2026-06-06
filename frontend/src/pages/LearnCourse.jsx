import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LearnCourse = () => {
    const { id } = useParams();
    const { token } = useAuth();

    const [modules, setModules] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const moduleRes = await api.get(
                `/api/modules/${id}`,
                config
            );

            setModules(moduleRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Course Learning Page</h2>

            {modules.map((module) => (
                <div key={module._id}>
                    <h3>{module.title}</h3>
                </div>
            ))}
        </div>
    );
};

export default LearnCourse;