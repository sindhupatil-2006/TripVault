# TripVault

TripVault is a production-ready MERN application for travel memory enthusiasts. Week 1 introduced secure authentication and JWT-protected access, Week 2 added trip management, and Week 3 adds Cloudinary uploads, public travel profiles, and profile editing.

## Week 2 - Trip Management

### Features

- Create trips with title, destination, dates, description, and rating
- View all trips belonging to the authenticated user
- View a single trip securely
- Edit trips owned by the logged-in user
- Delete trips after confirmation
- JWT-protected APIs with ownership checks
- Responsive dashboard UI with loading, error, and empty states

## Week 3 - Photo Uploads & Public Profiles

### Features

- Cloudinary image uploads for trips
- Trip cover images and photo galleries
- Public profile pages without login access
- Editable user username and bio
- Safe public profile responses with sensitive fields excluded
- Protected API routes for authenticated photo uploads and profile updates
- Clean frontend preview and validation for image selection

### New backend packages

- multer
- cloudinary
- multer-storage-cloudinary

## Folder Structure

```text
tripvault/
client/
  src/
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
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

A sample file is available in `server/.env.example` with empty values for the Cloudinary variables.

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

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Trips

- POST /api/trips
- GET /api/trips
- GET /api/trips/:id
- PUT /api/trips/:id
- DELETE /api/trips/:id
- POST /api/trips/:id/upload

### Profiles

- GET /api/users/:username/profile
- PUT /api/users/profile

## Future Improvements

- Add trip search and filters
- Add more social sharing features
- Expand profile customization and analytics
