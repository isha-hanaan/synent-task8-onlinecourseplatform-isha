const CourseCard = ({ item, navigate }) => {
    return (
        <div className="course-card">
            <h3>{item.course?.title}</h3>

            <p>Instructor: {item.course?.instructor}</p>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width: `${item.progressPercentage}%`
                    }}
                />
            </div>

            <p>
                {item.completedCount} / {item.totalLessons} lessons completed
            </p>

            <p>{item.progressPercentage}% Complete</p>

            <button
                onClick={() =>
                    navigate(`/learn/${item.course._id}`, {
                        state: {
                            completedLessons: item.completedLessons
                        }
                    })
                }
            >
                Continue Learning
            </button>
        </div>
    );
};

export default CourseCard;