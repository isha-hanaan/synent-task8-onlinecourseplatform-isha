// frontend/src/components/WelcomeBanner.jsx

import '../styles/WelcomeBanner.css';

const WelcomeBanner = ({ user }) => {
    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? 'Good Morning'
            : hour < 16
                ? 'Good Afternoon'
                : 'Good Evening';

    return (
        <div className="welcome-banner">
            <h1>
                {greeting}, {user?.name || 'Learner'} 👋
            </h1>

            <p>
                Ready to continue learning today?
            </p>
        </div>
    );
};

export default WelcomeBanner;