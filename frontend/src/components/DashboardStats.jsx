const DashboardStats = ({ enrollments }) => {

    const totalCourses = enrollments.length;

    const completedCourses = enrollments.filter(
        item => item.progressPercentage === 100
    ).length;

    const overallProgress =
        totalCourses > 0
            ? Math.round(
                enrollments.reduce(
                    (sum, item) => sum + item.progressPercentage,
                    0
                ) / totalCourses
            )
            : 0;

    return (
        <div className="stats-grid">

            <div className="stat-card">
                <h3>{totalCourses}</h3>
                <p>Enrolled Courses</p>
            </div>

            <div className="stat-card">
                <h3>{completedCourses}</h3>
                <p>Completed Courses</p>
            </div>

            <div className="stat-card">
                <h3>{overallProgress}%</h3>
                <p>Overall Progress</p>
            </div>

        </div>
    );
};

export default DashboardStats;