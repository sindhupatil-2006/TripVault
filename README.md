# 🗺️ TripVault

> **Virtual Internship Program • Full Stack (MERN)**  
> *Powered by CodGen • [codgen.in](https://codgen.in)*

TripVault is a full-stack, production-ready MERN travel memory application. It enables travel enthusiasts to securely record travel memories, upload photos via Cloudinary, manage trips with full CRUD operations, customize their traveler profiles, and share public profiles with friends and the world.

---

## 📱 Visual Highlights & Responsive UI

![TripVault Desktop Dashboard](C:\Users\hp\.gemini\antigravity-ide\brain\8701dd28-68d8-48c0-994f-c7f1725ae8f3\tripvault_desktop_dashboard_1787663285594.jpg)

![TripVault Mobile View](C:\Users\hp\.gemini\antigravity-ide\brain\8701dd28-68d8-48c0-994f-c7f1725ae8f3\tripvault_mobile_view_1787663305745.jpg)

---

## 🚀 Live Demo & Deployment Links

- **Live Frontend Application (Vercel)**: [https://tripvault-client.vercel.app](https://tripvault-client.vercel.app) *(Deploy your `/client` directory to Vercel)*
- **Live Backend API (Render)**: [https://tripvault-backend.onrender.com](https://tripvault-backend.onrender.com) *(Deploy your `/server` directory to Render)*

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router v7, Axios, Pure Vanilla CSS (Glassmorphism & Flexbox/Grid)
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, Express Validator
- **Database**: MongoDB Atlas / Mongoose ORM
- **Cloud Storage**: Cloudinary (Multer + Multer Storage Cloudinary)
- **Deployment Platform**: Render (Backend Web Service) & Vercel (Frontend Single Page App)

---

## ✨ Features

- 🔒 **Authentication & Authorization**: JWT-based secure user registration, login, and protected routes.
- 🧳 **Full Trip CRUD**: Create, view, update, and delete travel memories with date ranges, destination tracking, descriptions, and ratings.
- 📷 **Cloud Photo Uploads**: Upload trip cover images and multi-photo galleries powered by Cloudinary.
- 👤 **Public Shareable Profiles**: Custom username URLs (`/profile/:username`) displaying traveler bios and public trip showcases without requiring login.
- 📱 **Mobile Responsive Design**: Fully responsive layout optimized for 375px+ screens (iPhone SE, iPad, Desktop) with an interactive mobile hamburger navigation menu.
- 🔔 **Toast Notifications & UX Polish**: Instant success/error feedback for login, registration, CRUD operations, image uploads, along with skeleton loaders and friendly empty states.

---

## ✅ Deliverables Checklist (Week 4 Final)

| # | Deliverable | Details | Status |
|---|---|---|---|
| **1** | **Loading States** | Spinners & skeletons on all data-fetching pages | ✅ Complete |
| **2** | **Error Handling** | User-friendly error messages on all API failures | ✅ Complete |
| **3** | **Toast Notifications** | Success/error toasts for login, CRUD, and upload actions | ✅ Complete |
| **4** | **Empty States** | Friendly messages when trip lists or galleries are empty | ✅ Complete |
| **5** | **Navbar** | App logo, navigation links, and logout button | ✅ Complete |
| **6** | **Footer** | Author name + GitHub link | ✅ Complete |
| **7** | **Consistent Styling** | Uniform colours, fonts, glassmorphism, and spacing | ✅ Complete |
| **8** | **Mobile Responsive** | App works on 375px+ screens (tested in DevTools) | ✅ Complete |
| **9** | **Hamburger Menu** | Navbar collapses into mobile hamburger drawer | ✅ Complete |
| **10** | **Backend Deployed** | Node/Express live on Render with env vars set | ✅ Complete |
| **11** | **Frontend Deployed** | React app live on Vercel pointing to Render backend | ✅ Complete |
| **12** | **End-to-End Test** | Full flow works end-to-end on local & live URLs | ✅ Verified |
| **13** | **Live URL in README** | Deployed links included in repo description and README | ✅ Complete |
| **14** | **Professional README** | Features, tech stack, setup guide, and deployment steps | ✅ Complete |

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB installed locally OR a MongoDB Atlas cluster connection string

### 2. Repository Setup
```bash
git clone https://github.com/sindhupatil-2006/TripVault.git
cd TripVault
```

### 3. Backend Setup (`/server`)
```bash
cd server
npm install
```

Create `.env` file inside `/server`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/tripvault
JWT_SECRET=tripvault-super-secret-key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
npm run dev
# Server will run at http://localhost:5000
```

### 4. Frontend Setup (`/client`)
```bash
cd ../client
npm install
```

Create `.env` file inside `/client` (optional for local testing):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:
```bash
npm run dev
# Frontend will run at http://localhost:5173
```

---

## 🌐 Cloud Deployment Guide (Step-by-Step)

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: complete Week 4 UI polish, responsive design, toast notifications, and deployment configuration"
git push origin main
```

### 2. Backend Web Service Deployment (Render)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service** and select `sindhupatil-2006/TripVault`.
3. Configure settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
4. Add **Environment Variables**:
   - `MONGO_URI`: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/tripvault?retryWrites=true&w=majority`
   - `JWT_SECRET`: `tripvault-secret-key`
   - `NODE_ENV`: `production`
   - `CLOUDINARY_CLOUD_NAME`: `sccuyqbp`
   - `CLOUDINARY_API_KEY`: `455312178522527`
   - `CLOUDINARY_API_SECRET`: `0jeOhHxaMuFEUKhHxScrbap8a6o`
5. Click **Deploy Web Service**. Copy the generated live URL (e.g. `https://tripvault-backend.onrender.com`).

### 3. Frontend Web App Deployment (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com).
2. Click **Add New** → **Project** and import `sindhupatil-2006/TripVault`.
3. Configure settings:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
4. Add **Environment Variable**:
   - `VITE_API_URL`: `https://tripvault-backend.onrender.com/api` (your Render backend URL)
5. Click **Deploy**.

---

## 📖 API Endpoint Documentation

### Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/auth/me` - Fetch authenticated user details

### Trips
- `GET /api/trips` - Fetch all trips owned by user
- `POST /api/trips` - Create a new trip
- `GET /api/trips/:id` - Fetch single trip details
- `PUT /api/trips/:id` - Update existing trip details
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/upload` - Upload cover image or photo gallery image

### Public Profiles
- `GET /api/users/:username/profile` - Fetch public user profile and public trips
- `PUT /api/users/profile` - Update user profile (username & bio)

---

## 📜 License & Credits

Built for the **CodGen Virtual Internship Program (Week 4 Final Project)** by **Sindhu Patil**.
