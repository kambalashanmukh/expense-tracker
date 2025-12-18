# 💰 Expense Tracker – MERN Stack

A full-stack personal expense tracker built using the MERN stack with secure authentication, real-time analytics, and a modern, responsive UI.

## 🚀 Features

-  JWT-based Authentication (Login & Register)
-  Show / Hide password for better UX
-  Add expenses with category, description, and date
-  Edit expenses using a floating modal with smooth transitions
-  Delete expenses securely
-  Category-wise Pie Chart
-  Monthly Expense Bar Chart
-  Back-dated expense support
-  Automatic total expense calculation
-  Modern responsive UI with Tailwind CSS

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Recharts
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt.js

## 📂 Project Structure

client/
├─ src/
│ ├─ pages/
│ │ ├─ Login.jsx
│ │ ├─ Register.jsx
│ │ ├─ Dashboard.jsx
│ ├─ services/api.js
│ └─ main.jsx

server/
├─ controllers/
├─ routes/
├─ middleware/
└─ server.js

## 🔑 Authentication Flow

- Users register and login securely
- JWT token stored in localStorage
- Protected routes using auth middleware
- Expenses are user-specific and isolated

## 📊 Analytics

- Category-wise spending visualization
- Monthly expense trends
- Dynamic recalculation on add/edit/delete

## 📸 Screenshots
(Add screenshots here)

## 🧑‍💻 Author
**SHANMUKH**
