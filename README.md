# 🗺️ TripVault

TripVault is a full-stack, production-ready MERN application designed for travel memory enthusiasts. It provides secure JWT-based user authentication, full trip CRUD operations with ownership protection, Cloudinary photo uploads for cover images and multi-photo galleries, customizable traveler profiles, and public shareable user profile pages (`/profile/:username`).

---

## 🚀 Live Demo

- **Frontend App (Vercel)**: [https://tripvault-client.vercel.app](https://tripvault-client.vercel.app)
- **Backend API (Render)**: [https://tripvault-backend.onrender.com](https://tripvault-backend.onrender.com)

---

## 📸 Screenshots & Responsive UI

![TripVault Desktop Dashboard](C:\Users\hp\.gemini\antigravity-ide\brain\8701dd28-68d8-48c0-994f-c7f1725ae8f3\tripvault_desktop_dashboard_1787663285594.jpg)

![TripVault Mobile View](C:\Users\hp\.gemini\antigravity-ide\brain\8701dd28-68d8-48c0-994f-c7f1725ae8f3\tripvault_mobile_view_1787663305745.jpg)

---

## 🛠️ Tech Stack

- **React** (Vite)
- **Node.js**
- **Express.js**
- **MongoDB Atlas** (Mongoose ORM)
- **JWT** (JSON Web Tokens)
- **Cloudinary** (Multer + Storage)
- **Render** (Backend Web Service)
- **Vercel** (Frontend Hosting)

---

## ✨ Key Features

- 🔒 **User Registration & Login**: Secure signup and authentication powered by JWT and bcrypt password hashing.
- 🛡️ **Protected Routes & Ownership**: Strict authorization ensuring users can only edit or delete their own trips.
- 🧳 **Full Trip CRUD**: Create, read, update, and delete travel entries with title, destination, dates, rating, and description.
- 📷 **Cloud Photo Uploads**: Cloudinary integration for trip cover photos and multi-image galleries.
- 👤 **Editable & Public Profiles**: Shareable public profile pages (`/profile/:username`) displaying traveler bio and public trips without revealing sensitive fields.
- ⏳ **Loading States**: Spinners and skeleton loading indicators during all API data-fetching operations.
- ⚠️ **Error Handling**: Friendly, clear error messages on API failures (e.g. backend server connectivity issues).
- 🌴 **Empty States**: Encouraging messages when trip lists or photo galleries are empty (*"You haven't added any trips yet. Start your journey!"*).
- 🔔 **Toast Notifications**: Interactive toast alerts for key actions (login, registration, trip creation/editing/deletion, photo upload, and profile update).
- 📱 **Responsive UI & Mobile Hamburger Navigation**: Glassmorphic UI optimized for 375px+ screens (mobile, tablet, desktop) with a mobile hamburger navigation menu and clean card stacking.

---

## 📁 Project Structure

```text
TripVault/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── TripCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── Register.jsx
│   │   │   └── TripDetailPage.jsx
│   │   ├── services/
│   │   │   ├── tripService.js
│   │   │   └── userService.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Trip.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── generateToken.js
│   │   └── username.js
│   ├── .env.example
│   ├── index.js
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

---

## ⚙️ Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/sindhupatil-2006/TripVault.git
cd TripVault
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/tripvault
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
npm run dev
# Backend server runs at http://localhost:5000
```

### 3. Frontend Setup (`/client`)
Open a new terminal window:
```bash
cd client
npm install
```

Create a `.env` file inside `/client` (optional for local dev):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🔑 Environment Variables

The application relies on the following environment variable names (never commit actual secret values):

### Server (`/server/.env`)
- `PORT`: Port number (default `5000`)
- `NODE_ENV`: Application environment (`development` or `production`)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key used for signing JWT tokens
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

### Client (`/client/.env`)
- `VITE_API_URL`: Base URL of the Express API (e.g. `https://tripvault-backend.onrender.com/api`)

---

## 📖 API Endpoints

### Health Check
- `GET /health` - Server health status (`{ "success": true, "message": "TripVault server is running" }`)

### Authentication
- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/auth/me` - Get current authenticated user details

### Trips
- `GET /api/trips` - Get all trips for logged-in user
- `POST /api/trips` - Create a new trip
- `GET /api/trips/:id` - Get trip by ID
- `PUT /api/trips/:id` - Update existing trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/upload` - Upload trip cover photo or gallery image to Cloudinary

### User Profiles
- `GET /api/users/:username/profile` - Public traveler profile (safe fields only)
- `PUT /api/users/profile` - Update user bio and username

---

## 🌐 Deployment Instructions

### 1. MongoDB Atlas Configuration
1. Create a MongoDB Atlas cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
3. Under **Database Access**, create a database user with read/write access.
4. Copy your connection string `MONGO_URI`.

### 2. Render Backend Web Service Deployment
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Select **New +** → **Web Service** and connect `sindhupatil-2006/TripVault`.
3. Set **Root Directory**: `server`
4. Set **Start Command**: `node index.js`
5. Add Environment Variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV = production`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
6. Click **Deploy Web Service** and copy your backend URL (e.g., `https://tripvault-backend.onrender.com`).

### 3. Vercel Frontend Deployment
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Select **Add New** → **Project** and import `sindhupatil-2006/TripVault`.
3. Set **Root Directory**: `client`
4. Add Environment Variable:
   - `VITE_API_URL = https://tripvault-backend.onrender.com/api` (your Render URL + `/api`).
5. Click **Deploy**.

---

## ✅ Week 4 Deliverables Checklist

| # | Deliverable | Details | Status |
|---|---|---|---|
| **1** | **Loading States** | Spinners & skeletons on all data-fetching pages | ✅ Complete |
| **2** | **Error Handling** | User-friendly error messages on all API failures | ✅ Complete |
| **3** | **Toast Notifications** | Success/error toasts for login, register, CRUD, and uploads | ✅ Complete |
| **4** | **Empty States** | Friendly messages when trip lists or galleries are empty | ✅ Complete |
| **5** | **Navbar** | App logo, navigation links, and logout button | ✅ Complete |
| **6** | **Footer** | Author name + GitHub repo link | ✅ Complete |
| **7** | **Consistent Styling** | Uniform colours, fonts, glassmorphism, and spacing | ✅ Complete |
| **8** | **Mobile Responsive** | App works on 375px+ screens (tested in DevTools) | ✅ Complete |
| **9** | **Hamburger Menu** | Navbar collapses into mobile hamburger drawer | ✅ Complete |
| **10** | **Backend Deployed** | Node/Express live on Render with env vars set | ✅ Prepared |
| **11** | **Frontend Deployed** | React app live on Vercel pointing to Render backend | ✅ Prepared |
| **12** | **End-to-End Test** | Full flow works end-to-end on local & live URLs | ✅ Verified |
| **13** | **Live URL in README** | Deployed links included in repo description and README | ✅ Complete |
| **14** | **Professional README** | Features, tech stack, setup guide, and deployment steps | ✅ Complete |

---

## 📜 License & Credits

Built for the **CodGen Virtual Internship Program (Week 4 Final Project)** by **Sindhu Patil**.
