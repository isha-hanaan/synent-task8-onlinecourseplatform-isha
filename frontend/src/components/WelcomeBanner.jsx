import '../styles/WelcomeBanner.css';

const WelcomeBanner = ({ user }) => {
    return (
        <div className="welcome-banner">
            <h1>Welcome back, {user?.name} 👋</h1>

            <p>
                Keep learning and improve your progress!
            </p>
        </div>
    );
};

export default WelcomeBanner;