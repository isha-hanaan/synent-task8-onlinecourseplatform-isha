const courseData = [
    {
        id: "course_001",
        title: "React for Beginners",
        description: "Learn React from scratch with hands-on projects.",
        instructor: "John Doe",
        price: 499,
        category: "Web Development",
        level: "Beginner",
        language: "English",
        totalDuration: "1h 45m",
        isWishlisted: false,
        courseProgress: 35,
        isAdminApproved: true,
        modules: [
            {
                title: "Getting Started",
                order: 1,
                lessons: [
                    {
                        title: "Introduction",
                        order: 1,
                        duration: "10:15",
                        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk"
                    },
                    {
                        title: "Installing React",
                        order: 2,
                        duration: "15:30",
                        videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8"
                    },
                    {
                        title: "Project Setup",
                        order: 3,
                        duration: "12:45",
                        videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8"
                    }
                ]
            },
            {
                title: "Core Concepts",
                order: 2,
                lessons: [
                    {
                        title: "Components",
                        order: 1,
                        duration: "18:20",
                        videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8"
                    },
                    {
                        title: "Props",
                        order: 2,
                        duration: "14:10",
                        videoUrl: "https://www.youtube.com/embed/35lXWvCuM8o"
                    },
                    {
                        title: "State",
                        order: 3,
                        duration: "16:50",
                        videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0"
                    }
                ]
            }
        ]
    },
    {
        id: "course_002",
        title: "Advanced Node.js Architecture",
        description: "Master event loops, streams, and cluster modules.",
        instructor: "Jane Smith",
        price: 799,
        category: "Backend Development",
        level: "Advanced",
        language: "English",
        totalDuration: "2h 10m",
        isWishlisted: true,
        courseProgress: 0,
        isAdminApproved: true,
        modules: [
            {
                title: "Deep Dive into Event Loop",
                order: 1,
                lessons: [
                    {
                        title: "Understanding Phases",
                        order: 1,
                        duration: "25:00",
                        videoUrl: "https://www.youtube.com/embed/sample1"
                    },
                    {
                        title: "Microtasks and Macrotasks",
                        order: 2,
                        duration: "22:15",
                        videoUrl: "https://www.youtube.com/embed/sample2"
                    }
                ]
            }
        ]
    },
    {
        id: "course_003",
        title: "UI/UX Design Fundamentals",
        description: "Design clean, beautiful digital interfaces with Figma.",
        instructor: "Alex Rivera",
        price: 299,
        category: "Design", // Fixed to match Mongoose Model Schema configurations Enums
        level: "Beginner",
        language: "English",
        totalDuration: "1h 15m",
        isWishlisted: false,
        courseProgress: 100,
        isAdminApproved: false,
        modules: [
            {
                title: "Figma Basics",
                order: 1,
                lessons: [
                    {
                        title: "Frames and Layers",
                        order: 1,
                        duration: "15:45",
                        videoUrl: "https://www.youtube.com/embed/sample3"
                    }
                ]
            }
        ]
    },
    {
        id: "course_004",
        title: "Python for Data Science",
        description: "Analyze and visualize data using Pandas and NumPy.",
        instructor: "Sarah Jenkins",
        price: 599,
        category: "Data Science",
        level: "Intermediate",
        language: "English",
        totalDuration: "3h 05m",
        isWishlisted: false,
        courseProgress: 12,
        isAdminApproved: true,
        modules: [
            {
                title: "Introduction to NumPy",
                order: 1,
                lessons: [
                    {
                        title: "Array Creation",
                        order: 1,
                        duration: "20:30",
                        videoUrl: "https://www.youtube.com/embed/sample4"
                    }
                ]
            }
        ]
    }
];

module.exports = courseData;