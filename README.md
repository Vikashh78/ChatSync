# MERN Real-Time Chat App
- A real-time chat application built using the MERN stack and Socket.IO. Features include user authentication, one-to-one messaging, online status tracking, message seen indicators, image sharing, and real-time updates. The application follows RESTful API architecture and uses JWT for secure authentication.

# ✨ Features :
- 🔐 User authentication using JWT
- 💬 Real-time one-to-one messaging
- 🟢 Online / Offline user status
- 👁️ Message seen indicators
- 🖼️ Image sharing in chat
- ⏰ Message timestamps
- 📱 Responsive UI
- 🔄 Real-time updates without page refresh

------ Tech Stack -----
# Frontend
- React.js
- Context API
- Axios
- Tailwind CSS

# Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.IO
- JWT Authentication

# 🏗️ Project Structure :
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── utils
│   │   └── App.jsx
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── socket
│   └── server.js
│
└── README.md

# ⚙️ Installation & Setup :
1️⃣ Clone the repository --
`git clone https://github.com/Vikashh78/Quick-Chat-.git
cd Quick-Chat-`

# 2️⃣ Setup Backend --
`cd server
npm install`

Create a .env file in the server folder:
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start the backend server:
`npm run start`

# 3️⃣ Setup Frontend -- 
`cd client
npm install
npm run dev`

# 🔁 Real-Time Communication --
Socket.IO is used to handle:
Live message delivery
Online/offline user tracking
Real-time UI updates


