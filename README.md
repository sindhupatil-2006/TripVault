# TripVault

TripVault is a production-ready MERN application for travel memory enthusiasts. Week 1 introduced secure authentication and JWT-protected access, and Week 2 adds trip management with protected CRUD endpoints and a polished dashboard experience.

## Week 2 - Trip Management

### Features

- Create trips with title, destination, dates, description, and rating
- View all trips belonging to the authenticated user
- View a single trip securely
- Edit trips owned by the logged-in user
- Delete trips after confirmation
- JWT-protected APIs with ownership checks
- Responsive dashboard UI with loading, error, and empty states

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

## Future Improvements

- Add trip photos and sharing
- Implement trip search and filters
- Add profile editing and improved analytics
