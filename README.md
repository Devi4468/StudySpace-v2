StudySpace 📚

StudySpace is a collaborative study and knowledge-sharing platform designed for students.

It allows students to discover and share study resources, ask questions, join study groups, save useful content, and manage their profiles from one platform.

✨ Features

🔐 Authentication

Student registration

Student login

JWT-based authentication

Password hashing using bcrypt

Logout functionality

Protected API routes

📚 Resources

View study resources

Search resources

Filter resources by subject

Add new resources

Edit your own resources

Delete your own resources

Open external study links

Bookmark resources

❓ Questions

Ask study-related questions

Search questions

Filter questions by subject

Add tags to questions

Edit your own questions

Delete your own questions

Bookmark questions

👥 Study Groups

Create study groups

Join study groups

Leave study groups

View group members

Edit groups created by you

Delete groups created by you

Set maximum group size

🔖 Bookmarks

Bookmark resources

Bookmark questions

View saved resources

View saved questions

Remove bookmarks

Bookmarks persist in MongoDB

👤 Profile

View account information

View created resources

View asked questions

View created study groups

View joined study groups

⚙️ Settings

View account information

Notification preferences

Email notification preference

Password visibility option

Password validation

Logout

🛠️ Technologies Used

Frontend

React

Vite

JavaScript

HTML

CSS

Backend

Node.js

Express.js

MongoDB

Mongoose

Authentication & Security

JWT

bcryptjs

Development Tools

Git

GitHub

VS Code

npm

🏗️ Project Architecture

Browser
   ↓
React Frontend
   ↓
HTTP Requests
   ↓
Express.js Backend
   ↓
JWT Authentication
   ↓
Mongoose
   ↓
MongoDB Atlas

📁 Project Structure

StudySpace-v2/
│
├── README.md
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackButton.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Resources.jsx
│   │   │   ├── Questions.jsx
│   │   │   ├── StudyGroups.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Bookmarks.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── server/
    ├── config/
    │   └── db.js
    │
    ├── controllers/
    │   ├── userController.js
    │   ├── resourceController.js
    │   ├── questionController.js
    │   ├── groupController.js
    │   └── bookmarkController.js
    │
    ├── middleware/
    │   └── authMiddleware.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Resource.js
    │   ├── Question.js
    │   ├── StudyGroup.js
    │   └── Bookmark.js
    │
    ├── routes/
    │   ├── userRoutes.js
    │   ├── resourceRoutes.js
    │   ├── questionRoutes.js
    │   ├── groupRoutes.js
    │   └── bookmarkRoutes.js
    │
    ├── .env
    ├── .gitignore
    ├── package.json
    └── server.js

⚙️ Requirements

Before running the project, install:

Node.js

npm

MongoDB Atlas account

🚀 Installation

1. Clone the Repository

git clone <your-github-repository-url>

Move into the project:

cd StudySpace-v2

🖥️ Frontend Setup

Open a terminal and go to:

StudySpace-v2/client

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally run on:

http://localhost:5173

🖥️ Backend Setup

Open another terminal and go to:

StudySpace-v2/server

Install dependencies:

npm install

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Do not use the actual values shown above.

Start the backend:

npm run dev

The backend will run on:

http://localhost:5000

🔐 Environment Variables

The backend requires the following environment variables:

Variable

Purpose

PORT

Port used by the Express server

MONGO_URI

MongoDB Atlas connection string

JWT_SECRET

Secret used for JWT authentication

Important

Never upload your .env file to GitHub.

The project contains the following in:

server/.gitignore

node_modules/
.env

This prevents the .env file from being committed to the repository.

🔑 Authentication Flow

StudySpace uses JWT-based authentication.

User
   ↓
Login / Register
   ↓
Express API
   ↓
Password Verification
   ↓
JWT Token Generated
   ↓
Token Stored by Frontend
   ↓
Token Sent with Protected API Requests
   ↓
Authentication Middleware Verifies Token
   ↓
Protected Resource Accessed

Passwords are hashed using bcryptjs before being stored.

🗄️ Database

StudySpace uses MongoDB Atlas as the database.

Main collections/models include:

Users

Resources

Questions

StudyGroups

Bookmarks

MongoDB is accessed through Mongoose.

🔌 Main API Routes

Authentication

POST /api/users/register
POST /api/users/login

Resources

GET    /api/resources
POST   /api/resources
PUT    /api/resources/:id
DELETE /api/resources/:id

Questions

GET    /api/questions
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id

Study Groups

GET    /api/groups
POST   /api/groups
POST   /api/groups/:id/join
POST   /api/groups/:id/leave
PUT    /api/groups/:id
DELETE /api/groups/:id

Bookmarks

GET    /api/bookmarks
GET    /api/bookmarks/check
POST   /api/bookmarks
DELETE /api/bookmarks

Protected routes require a valid JWT token.

🎯 Current Project Status

Phase 1 — Completed ✅

Authentication

Dashboard

Resources

Questions

Study Groups

Profile

Bookmarks

Settings

JWT authentication

MongoDB persistence

Responsive UI

Profile dropdown

CRUD operations

Protected backend routes

🚧 Future Enhancements

Phase 2

The next development phase will focus on making StudySpace more collaborative.

Planned features include:

📄 Direct PDF/file uploads

💬 Study group discussions

❓ Answers to questions

📚 Group-specific resources

🔔 Notifications

Future versions may also include:

Real-time messaging

Resource recommendations

Advanced search

User reputation

Activity feeds

Real-time notifications

🎓 Project Purpose

StudySpace was developed as a full-stack web application to demonstrate practical knowledge of:

React

Node.js

Express.js

MongoDB

REST APIs

JWT authentication

CRUD operations

Database relationships

Protected routes

Frontend-backend integration

👩‍💻 Author

Developed as a student full-stack web development project.

StudySpace — Learn together. Grow together.