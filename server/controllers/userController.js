const Trip = require('../models/Trip');
const User = require('../models/User');

const formatDates = (startDate, endDate) => {
  const formatDate = (value) => {
    if (!value) {
      return 'TBD';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'TBD';
    }

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!startDate && !endDate) {
    return 'Dates not set';
  }

  if (startDate && endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  return formatDate(startDate || endDate);
};

const getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username || !username.trim()) {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() }).select('name username bio');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    const trips = await Trip.find({ user: user._id })
      .select('title destination startDate endDate rating coverImage')
      .sort({ createdAt: -1 });

    const safeTrips = trips.map((trip) => ({
      _id: trip._id,
      title: trip.title,
      destination: trip.destination,
      dates: formatDates(trip.startDate, trip.endDate),
      rating: trip.rating || 0,
      coverImage: trip.coverImage || '',
    }));

    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        username: user.username,
        bio: user.bio || '',
      },
      trips: safeTrips,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { bio, username } = req.body;
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (bio !== undefined) {
      currentUser.bio = typeof bio === 'string' ? bio.trim() : '';
    }

    if (username !== undefined) {
      const trimmedUsername = typeof username === 'string' ? username.trim() : '';

      if (!trimmedUsername) {
        return res.status(400).json({ success: false, message: 'Username is required.' });
      }

      if (!/^[a-zA-Z0-9._-]+$/.test(trimmedUsername)) {
        return res.status(400).json({ success: false, message: 'Username can only contain letters, numbers, periods, underscores, and dashes.' });
      }

      if (trimmedUsername.length < 3) {
        return res.status(400).json({ success: false, message: 'Username must be at least 3 characters.' });
      }

      const duplicateUser = await User.findOne({
        username: trimmedUsername,
        _id: { $ne: currentUser._id },
      });

      if (duplicateUser) {
        return res.status(409).json({ success: false, message: 'This username is already taken.' });
      }

      currentUser.username = trimmedUsername;
    }

    const updatedUser = await currentUser.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        bio: updatedUser.bio || '',
        email: updatedUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublicProfile, updateUserProfile };
