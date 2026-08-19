const express = require('express');
const { getPublicProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:username/profile', getPublicProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
