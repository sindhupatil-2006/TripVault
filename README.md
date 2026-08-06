# TripVault

TripVault is a production-ready MERN authentication application for travel memory enthusiasts. The project includes secure registration, login, JWT-based authentication, protected routes, and a polished responsive UI.

## Features

- Secure user registration and login
- Password hashing with bcryptjs
- JWT authentication with 7-day expiry
- Protected dashboard route
- Responsive glassmorphism UI with animations
- Centralized API configuration and reusable UI components

## Folder Structure

```text
tripvault/
client/
  src/
    assets/
    components/
    context/
    pages/
    services/
    styles/
    App.jsx
    api.js
    main.jsx
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  .env
  server.js
```

## Installation

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd client
npm install
```

## Environment Variables

Create a `.env` file in the server folder with:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Run the App

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

## API Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

## Screenshots Placeholder

Add screenshots of the home, register, login, and dashboard pages here.

## Future Improvements

- Add trip creation and photo upload
- Implement profile editing
- Add toast-driven form validation
- Connect to MongoDB Atlas in production
