# Getting Started with BDU CONNECT

Welcome to the BDU CONNECT documentation! This guide will help you set up and run the project locally.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- MongoDB instance (local or cloud)

## Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/Ermias5869/BDU-Connect.git
cd BDU-Connect
```

2. Install backend dependencies and set up environment variables:

```bash
cd backend
npm install
```

Create a .env file in /backend with the necessary keys
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

3. Run backend server:

```bash
npm run dev

```

4. Install frontend dependencies and start the frontend:

```bash
cd ../frontend
npm install
npm run dev
```

Accessing the App
Frontend: http://localhost:5173

Backend: http://localhost:5000
