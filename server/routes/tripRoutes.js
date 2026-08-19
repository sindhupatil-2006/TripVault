const express = require('express');
const { createTrip, getTrips, getTripById, updateTrip, deleteTrip, uploadTripPhoto } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.post('/', createTrip);
router.get('/', getTrips);
router.post('/:id/upload', upload.single('image'), uploadTripPhoto);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

module.exports = router;
