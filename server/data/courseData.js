/* server/data/courseData.js */

// Helper to generate consistent-looking MongoDB 24-character hex ObjectIds
const mockId = (type, index) => {
    const pad = (num, size) => ('000000000000' + num).slice(-size);
    if (type === 'course') return `507f1f77bcf86cd7e0000${pad(index, 3)}`;
    if (type === 'module') return `507f1f77bcf86cd7e0001${pad(index, 3)}`;
    if (type === 'lesson') return `507f1f77bcf86cd7e0002${pad(index, 3)}`;
};

// 1. Standalone Course Records
const courses = [
    {
        _id: mockId('course', 1),
        title: "React for Beginners",
        description: "Learn React from scratch with hands-on projects.",
        instructor: "John Doe",
        price: 499,
        category: "Web Development",
        level: "Beginner",
        language: "English",
        totalDuration: "1h 45m",
        isAdminApproved: true
    },
    {
        _id: mockId('course', 2),
        title: "Advanced Node.js Architecture",
        description: "Master event loops, streams, and cluster modules.",
        instructor: "Jane Smith",
        price: 799,
        category: "Backend Development",
        level: "Advanced",
        language: "English",
        totalDuration: "2h 10m",
        isAdminApproved: true
    },
    {
        _id: mockId('course', 3),
        title: "UI/UX Design Fundamentals",
        description: "Design clean, beautiful digital interfaces with Figma.",
        instructor: "Alex Rivera",
        price: 299,
        category: "Design",
        level: "Beginner",
        language: "English",
        totalDuration: "1h 15m",
        isAdminApproved: false // Awaiting review
    },
    {
        _id: mockId('course', 4),
        title: "Python for Data Science",
        description: "Analyze and visualize data using Pandas and NumPy.",
        instructor: "Sarah Jenkins",
        price: 599,
        category: "Data Science",
        level: "Intermediate",
        language: "English",
        totalDuration: "3h 05m",
        isAdminApproved: true
    }
];

// 2. Standalone Module Records (Referencing Courses via course ID)
const modules = [
    // React Modules
    { _id: mockId('module', 1), title: "Getting Started", course: mockId('course', 1), order: 1 },
    { _id: mockId('module', 2), title: "Core Concepts", course: mockId('course', 1), order: 2 },
    // Node.js Modules
    { _id: mockId('module', 3), title: "Deep Dive into Event Loop", course: mockId('course', 2), order: 1 },
    // UI/UX Modules
    { _id: mockId('module', 4), title: "Figma Basics", course: mockId('course', 3), order: 1 },
    // Python Modules
    { _id: mockId('module', 5), title: "Introduction to NumPy", course: mockId('course', 4), order: 1 }
];

// 3. Standalone Lesson Records (Referencing Modules via module ID)
const lessons = [
    // Lessons for React Module 1 (Getting Started)
    {
        _id: mockId('lesson', 1),
        module: mockId('module', 1),
        title: "Introduction",
        order: 1,
        duration: "10:15",
        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk"
    },
    {
        _id: mockId('lesson', 2),
        module: mockId('module', 1),
        title: "Installing React",
        order: 2,
        duration: "15:30",
        videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8"
    },
    {
        _id: mockId('lesson', 3),
        module: mockId('module', 1),
        title: "Project Setup",
        order: 3,
        duration: "12:45",
        videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8"
    },
    // Lessons for React Module 2 (Core Concepts)
    {
        _id: mockId('lesson', 4),
        module: mockId('module', 2),
        title: "Components",
        order: 1,
        duration: "18:20",
        videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8"
    },
    {
        _id: mockId('lesson', 5),
        module: mockId('module', 2),
        title: "Props",
        order: 2,
        duration: "14:10",
        videoUrl: "https://www.youtube.com/embed/35lXWvCuM8o"
    },
    {
        _id: mockId('lesson', 6),
        module: mockId('module', 2),
        title: "State",
        order: 3,
        duration: "16:50",
        videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0"
    },
    // Lessons for Node.js Module 1
    {
        _id: mockId('lesson', 7),
        module: mockId('module', 3),
        title: "Understanding Phases",
        order: 1,
        duration: "25:00",
        videoUrl: "https://www.youtube.com/embed/sample1"
    },
    {
        _id: mockId('lesson', 8),
        module: mockId('module', 3),
        title: "Microtasks and Macrotasks",
        order: 2,
        duration: "22:15",
        videoUrl: "https://www.youtube.com/embed/sample2"
    },
    // Lessons for UI/UX Module 1
    {
        _id: mockId('lesson', 9),
        module: mockId('module', 4),
        title: "Frames and Layers",
        order: 1,
        duration: "15:45",
        videoUrl: "https://www.youtube.com/embed/sample3"
    },
    // Lessons for Python Module 1
    {
        _id: mockId('lesson', 10),
        module: mockId('module', 5),
        title: "Array Creation",
        order: 1,
        duration: "20:30",
        videoUrl: "https://www.youtube.com/embed/sample4"
    }
];

module.exports = {
    courses,
    modules,
    lessons
};