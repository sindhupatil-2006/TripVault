const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'TripVault server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`TripVault server running on port ${PORT}`);
});
