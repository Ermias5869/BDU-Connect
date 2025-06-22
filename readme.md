# 🌐 BDU CONNECT

BDU CONNECT is a **university-based social media platform** designed for students and staff at **Bahir Dar University (BDU)**. It allows users to create posts, chat in real-time, share media, and build a vibrant university community — all in one modern app.

## 🧠 Project Overview

- 🧑‍🎓 **User Profiles** – Register, login, update profile photo & password
- 📸 **Create & View Posts** – Add text, photos, or videos
- 💬 **Real-time Messaging** – Private and channel-based chat
- 📂 **Media Upload** – Share images, videos, and files via Cloudinary
- 😀 **Reactions** – Emoji support for posts and messages
- 🧾 **Comments** – Full commenting system with edit/delete
- 🎥 **Video Calling** – Peer-to-peer calling via WebRTC & Socket.IO
- 💰 **payment Integration**
- 🛡️ **Authentication** – JWT-based secure login

---

## 🧱 Tech Stack

| Part     | Technology                                           |
| -------- | ---------------------------------------------------- |
| Frontend | React.js, Tailwind CSS, Zustand, Axios, React Router |
| Backend  | Node.js, Express.js, MongoDB, Mongoose               |
| Realtime | Socket.IO                                            |
| Storage  | Cloudinary (images, videos)                          |
| Auth     | JWT                                                  |

## 🖼️ Screenshots

### 🔐 Login Page

![Login](./frontend/screenshots/login.png)

### 🆕 Signup Page

![Signup](./frontend/screenshots/signup.png)

### 🏠 Home Feed

![Home](./frontend/screenshots/home.png)

### 📝 Create Post

![Post](./frontend/screenshots/post.png)

### 💬 Message Page

![Message](./frontend/screenshots/message.png)

### 🎥 Video reel

![reel](./frontend/screenshots/video.png)

### 🧑‍🤝‍🧑 Group Page

![Group](./frontend/screenshots/group.png)

### 📢 Notifications

![Notifications](./frontend/screenshots/notification.png)

### 💡 Services List

![Service](./frontend/screenshots/service.png)

### 📄 Service Detail

![Service Detail](./frontend/screenshots/servicedetail.png)

### 📃 Profile Page

![Profile](./frontend/screenshots/profile.png)

### ⚙️ Profile Settings

![Profile Settings](./frontend/screenshots/profileSetting.png)

### 📺 Channels

![Channnal](./frontend/screenshots/channnal.png)

### ➕ Create Channel

![Create Channel](./frontend/screenshots/createchannal.png)

### 🛠️ Channel Settings

![Channel Settings](./frontend/screenshots/chananalSetting.png)

### 💬 Comment & Like Post

![Comment and Like](./frontend/screenshots/commentandlike.png)

### 💬 video call

![videocall](./frontend/screenshots/videocall.png)

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Ermias5869/BDU-Connect.git
cd BDU-Connect
```

### 2️⃣ Set up the backend

cd backend
npm install

## Create a .env file in /backend:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PORT=5001
DATABASE_LOCAL=your_mongodb_uri
JWT_SECURE=your_jwt_secure
JWT_EXP=you
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_PUBLISHABLE_KEY=you_stripe_publishable_key
STRIPE_SECRET_KEY=you_stripe_secret_key

## Start the backend:

npm run dev

### 3️⃣ Set up the frontend

cd ../frontend
npm install
npm run dev

The app runs on:
Frontend: http://localhost:5173
Backend: http://localhost:5000
