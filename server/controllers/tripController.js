const mongoose = require('mongoose');
const Trip = require('../models/Trip');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const parseDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
};

const createTrip = async (req, res, next) => {
  try {
    const { title, destination, startDate, endDate, description, rating } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (!destination || !destination.trim()) {
      return res.status(400).json({ success: false, message: 'Destination is required' });
    }

    if (rating !== undefined && rating !== null && (Number(rating) < 1 || Number(rating) > 5)) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const tripData = {
      title: title.trim(),
      destination: destination.trim(),
      user: req.user.id,
    };

    if (description !== undefined && description !== null) tripData.description = description.trim();
    if (startDate) tripData.startDate = parseDateValue(startDate);
    if (endDate) tripData.endDate = parseDateValue(endDate);
    if (rating !== undefined && rating !== null) tripData.rating = Number(rating);

    const trip = await Trip.create(tripData);
    res.status(201).json({ success: true, trip, _id: trip._id, coverImage: trip.coverImage, photos: trip.photos });
  } catch (error) {
    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, trips });
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to view this trip' });
    }

    res.status(200).json({ success: true, trip, coverImage: trip.coverImage, photos: trip.photos });
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this trip' });
    }

    const { title, destination, startDate, endDate, description, rating } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ success: false, message: 'Title is required' });
      }
      trip.title = title.trim();
    }

    if (destination !== undefined) {
      if (!destination.trim()) {
        return res.status(400).json({ success: false, message: 'Destination is required' });
      }
      trip.destination = destination.trim();
    }

    if (startDate !== undefined) trip.startDate = startDate ? parseDateValue(startDate) : null;
    if (endDate !== undefined) trip.endDate = endDate ? parseDateValue(endDate) : null;
    if (description !== undefined) trip.description = description ? description.trim() : '';
    if (rating !== undefined) {
      if (rating === null || rating === '' || Number(rating) < 1 || Number(rating) > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
      }
      trip.rating = Number(rating);
    }

    const updatedTrip = await trip.save();
    res.status(200).json({ success: true, trip: updatedTrip });
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this trip' });
    }

    await trip.deleteOne();
    res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const uploadTripPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ success: false, message: 'Cloudinary is not configured. Add valid CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET before uploading images.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide an image file.' });
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to upload photos for this trip' });
    }

    const imageUrl = req.file.path || req.file.secure_url || req.file.url;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image upload failed. Please try again.' });
    }

    trip.photos = Array.isArray(trip.photos) ? trip.photos : [];
    const normalizedPhotos = [...trip.photos];
    if (!normalizedPhotos.includes(imageUrl)) {
      normalizedPhotos.push(imageUrl);
    }
    trip.photos = normalizedPhotos;

    if (!trip.coverImage) {
      trip.coverImage = imageUrl;
    }

    const updatedTrip = await trip.save();

    return res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully.',
      coverImage: updatedTrip.coverImage,
      photos: updatedTrip.photos,
      trip: updatedTrip,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTrip, getTrips, getTripById, updateTrip, deleteTrip, uploadTripPhoto };
