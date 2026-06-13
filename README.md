# Online Course Platform

A full-stack e-learning platform where users can browse courses, enroll through Razorpay, and access learning content organized into modules and lessons. Administrators can manage courses and monitor users and enrollments.

---

## Features

### 1. Authentication

* User Registration
* User Login
* JWT-based Authentication
* Email Verification
* Forgot Password
* Password Reset
* Role-based Access (User/Admin)

---

### 2. User Dashboard

* View available courses
* Search and filter courses
* View course details
* Access enrolled courses
* Track course progress
* Continue learning

---

### 3. Enrollment Flow

1. Select a course
2. Click **Enroll Now**
3. Complete payment using Razorpay (Test Mode)
4. Course is added to the user's dashboard after successful payment

---

### 4. Learning System

* Module → Lesson structure
* Video playback
* Mark lessons as completed
* Progress tracking (% completion)
* Continue learning functionality

---

### 5. Admin Panel

Admins can:

* Add courses
* Edit courses
* Delete courses
* Add modules
* Add lessons
* View registered users
* View enrollments

---

### 6. Notifications & Data Storage

* Enrollment data stored in MongoDB
* Payment records stored securely
* Email notifications for:

  * Registration
  * Enrollment

---

## 🛠 Tech Stack

### Frontend

* React
* React Router DOM
* Axios
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Token)
* bcryptjs

### Payments

* Razorpay (Test Mode)

### Email Service

* Nodemailer

---

## Project Structure

```
project-root
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   └── App.jsx
│   │   └── index.css
│   │   └── main.jsx
│   │
│   └── index.html
│   └── package.json

│
├── server
│   ├── config
│   ├── controllers
│   ├── data 
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Database Models

### User

* name
* email
* password
* role
* emailVerified

### Course

* title
* description
* category
* price
* instructor
* thumbnail

### Module

* title
* course reference

### Lesson

* title
* videoUrl
* duration
* module reference

### Enrollment

* user reference
* course reference
* payment information
* completed lessons
* progress

---

## API Routes

### Authentication

```
POST    /api/auth/register
POST    /api/auth/login
GET     /api/auth/verify-email
POST    /api/auth/forgot-password
POST    /api/auth/reset-password
GET     /api/auth/users
```

### Courses

```
GET     /api/courses
GET     /api/courses/:id
POST    /api/courses
PUT     /api/courses/:id
DELETE  /api/courses/:id
```

### Modules

```
GET     /api/courses/:courseId/modules
POST    /api/courses/:courseId/modules
```

### Lessons

```
GET     /api/modules/:moduleId/lessons
POST    /api/modules/:moduleId/lessons
```

### Enrollments

```
GET     /api/enrollments
GET     /api/enrollments/admin
POST    /api/enrollments/order
POST    /api/enrollments/verify
POST    /api/enrollments/lesson-complete
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/isha-hanaan/synent-task8-onlinecourseplatform-isha.git

cd synent-task8-onlinecourseplatform-isha
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server` folder:

```env
PORT=5000

MONGO_URI=mongodb://<host>:<port>/<database_name>

CLIENT_URL=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

EMAIL_USER=your_email_address EMAIL_PASS=your_email_app_password

EMAIL_FROM=your_email_address

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

PAYMENT_MODE=mock
```

Run backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Application Flow

### User

Register → Verify Email → Login → Browse Courses → Enroll → Pay via Razorpay → Access Learning Dashboard → Watch Videos → Complete Lessons → Track Progress

### Admin

Login → Manage Courses → Add Modules → Add Lessons → View Users → View Enrollments

---

## Output

✔ Full-stack application

✔ React frontend

✔ Express backend

✔ MongoDB database

✔ JWT authentication

✔ Razorpay integration

✔ Email verification and notifications

✔ Course enrollment system

✔ Learning progress tracking

✔ Admin panel

✔ Proper UI and backend integration

---

## Future Enhancements

* Course reviews and ratings
* Certificates on completion
* Instructor dashboard
* Wishlist functionality
* Cloud image uploads
* Quiz system
* Course recommendations

---

## Author

**Isha Hanaan**

Task 8 – Online Course Platform (Full Stack)

Built using React, Node.js, Express, MongoDB, JWT Authentication, and Razorpay.
