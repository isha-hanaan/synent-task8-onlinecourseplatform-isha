// frontend/src/components/CourseCard.jsx

const CourseCard = ({ item, navigate }) => {
    return (
        <div className="course-card">

            <h3>{item.course?.title}</h3>

            <p>
                Instructor: {item.course?.instructor}
            </p>

            <p>
                {item.course?.level} • {item.course?.totalDuration}
            </p>


            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width: `${item.progressPercentage}%`
                    }}
                />
            </div>



            <p>
                {item.completedCount} / {item.totalLessons} lessons
            </p>

            {
                item.progressPercentage === 100
                    ? (
                        <p style={{ color: '#28a745' }}>
                            🎉 Course Completed
                        </p>
                    )
                    : (
                        <p>
                            Progress: {item.progressPercentage}%
                        </p>
                    )
            }


            <button
                className="continue-btn"
                onClick={() =>
                    navigate(`/learn/${item.course._id}`, {
                        state: {
                            completedLessons: item.completedLessons
                        }
                    })
                }
            >
                {
                    item.progressPercentage === 100
                        ? 'Review Course'
                        : 'Continue Learning →'
                }
            </button>


        </div>
    );
};

export default CourseCard;