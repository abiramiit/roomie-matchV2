# RoomieConnect 🏠

A full-stack roommate matching web application.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Real-time**: Socket.io
- **File Uploads**: Cloudinary

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

## Setup

### 1. Clone & Install
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Server Environment
Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/roomieconnect
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Servers

**Terminal 1 – Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd client
npm run dev
```

App runs at: http://localhost:5173
API runs at: http://localhost:5000

## Features
- ✅ JWT Authentication
- ✅ Profile Setup Wizard (4 steps)
- ✅ Smart Matching Algorithm (location + budget + lifestyle)
- ✅ Swipe-style Match Cards with % score
- ✅ Real-time Chat with Socket.io
- ✅ Room Listings with photo upload
- ✅ Save Profiles
- ✅ Admin Panel (block users, manage listings)
- ✅ Notification System
- ✅ Online/Offline indicators
- ✅ Typing indicators

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`

### Users
- `PUT  /api/users/profile`
- `POST /api/users/avatar`
- `GET  /api/users?city=&gender=&minBudget=&maxBudget=`
- `GET  /api/users/:id`
- `POST /api/users/:id/save`
- `GET  /api/users/saved`

### Matches
- `GET  /api/matches`
- `GET  /api/matches/my`
- `POST /api/matches/like/:id`
- `POST /api/matches/dislike/:id`

### Messages
- `GET  /api/messages/conversations`
- `GET  /api/messages/:userId`
- `POST /api/messages/:userId`

### Listings
- `GET  /api/listings`
- `POST /api/listings`
- `GET  /api/listings/:id`
- `PUT  /api/listings/:id`
- `DELETE /api/listings/:id`

### Admin
- `GET  /api/admin/dashboard`
- `GET  /api/admin/users`
- `PUT  /api/admin/users/:id/block`
- `DELETE /api/admin/users/:id`
- `GET  /api/admin/listings`
- `PUT  /api/admin/listings/:id/toggle`

## Create Admin User
In MongoDB shell:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Deployment

### Backend (Railway / Render)
1. Set environment variables
2. Deploy `server/` folder
3. Update `CLIENT_URL` to your frontend domain

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Update `vite.config.js` proxy target
3. Deploy `client/` folder
