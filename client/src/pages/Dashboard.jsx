import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { createTrip, deleteTrip, getTrips, updateTrip, uploadTripPhoto } from '../services/tripService';
import { updateUserProfile } from '../services/userService';

const initialForm = {
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
  description: '',
  rating: '5',
};

const formatDisplayDate = (value) => {
  if (!value) {
    return 'TBD';
  }

  const dateOnlyMatch = typeof value === 'string' && value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'TBD';
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const DashboardPage = () => {
  const { user, logout, updateUser, showToast } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const [profileForm, setProfileForm] = useState({ username: user?.username || '', bio: user?.bio || '' });
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await getTrips();
      setTrips(response.trips || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your trips right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    setProfileForm({ username: user?.username || '', bio: user?.bio || '' });
  }, [user]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
    setImageError('');
  };

  const handleImageSelection = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    const isValidType = selectedFile.type.startsWith('image/');
    const isValidSize = selectedFile.size <= 5 * 1024 * 1024;

    if (!isValidType) {
      setImageError('Please choose a valid image file.');
      event.target.value = '';
      return;
    }

    if (!isValidSize) {
      setImageError('Please choose an image under 5MB.');
      event.target.value = '';
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setImageFile(selectedFile);
    setImagePreview(previewUrl);
    setImageError('');
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.destination.trim()) return 'Destination is required.';
    const ratingValue = Number(form.rating);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) return 'Please choose a rating from 1 to 5.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      let tripResult;
      const successMessage = editingId ? 'Trip updated successfully!' : 'Trip created successfully!';
      if (editingId) {
        tripResult = await updateTrip(editingId, {
          title: form.title,
          destination: form.destination,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          description: form.description,
          rating: Number(form.rating),
        });
      } else {
        tripResult = await createTrip({
          title: form.title,
          destination: form.destination,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          description: form.description,
          rating: Number(form.rating),
        });
      }

      const tripPayload = tripResult?.trip || tripResult;
      const tripId = editingId || tripPayload?._id;

      if (imageFile && tripId) {
        await uploadTripPhoto(tripId, imageFile);
        const imgSuccessMsg = editingId ? 'Trip updated & photo uploaded!' : 'Trip created & photo uploaded!';
        setSuccess(imgSuccessMsg);
        showToast(imgSuccessMsg, 'success');
      } else {
        setSuccess(successMessage);
        showToast(successMessage, 'success');
      }

      await loadTrips();
      resetForm();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Unable to save your trip.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (trip) => {
    setEditingId(trip._id);
    setForm({
      title: trip.title || '',
      destination: trip.destination || '',
      startDate: trip.startDate ? trip.startDate.slice(0, 10) : '',
      endDate: trip.endDate ? trip.endDate.slice(0, 10) : '',
      description: trip.description || '',
      rating: String(trip.rating || 5),
    });
    if (trip.coverImage) {
      setImagePreview(trip.coverImage);
      setImageFile(null);
    } else {
      setImagePreview('');
      setImageFile(null);
    }
    setShowForm(true);
    setSuccess('');
    setError('');
    setImageError('');
  };

  const handleDelete = async (tripId) => {
    const confirmed = window.confirm('Are you sure you want to delete this trip?');
    if (!confirmed) return;

    try {
      setDeletingId(tripId);
      setError('');
      await deleteTrip(tripId);
      setSuccess('Trip deleted successfully.');
      showToast('Trip deleted successfully', 'success');
      await loadTrips();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Unable to delete this trip.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      setProfileSubmitting(true);
      setError('');
      const response = await updateUserProfile({
        username: profileForm.username,
        bio: profileForm.bio,
      });
      updateUser(response.user);
      setProfileEditing(false);
      setSuccess('Profile updated successfully.');
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Unable to update your profile.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const tripCountLabel = useMemo(() => `${trips.length} trip${trips.length === 1 ? '' : 's'}`, [trips.length]);

  return (
    <div className="page-shell dashboard-shell">
      <div className="card dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Your travel journal</p>
            <h2>Welcome back, {user?.name}</h2>
            <p className="muted">You currently have {tripCountLabel} saved.</p>
          </div>
          <div className="dashboard-actions">
            {user?.username && (
              <Link to={`/profile/${user.username}`} className="btn btn-secondary">
                My Profile
              </Link>
            )}
            <Button onClick={() => setProfileEditing((prev) => !prev)} className="btn-secondary">
              {profileEditing ? 'Close profile' : 'Edit Profile'}
            </Button>
            <Button onClick={() => { setShowForm((prev) => !prev); setEditingId(null); setForm(initialForm); setError(''); setSuccess(''); setImageError(''); setImageFile(null); setImagePreview(''); }} className="btn-primary">
              {showForm ? 'Close form' : 'Create Trip'}
            </Button>
            <Button onClick={logout} className="btn-secondary">Logout</Button>
          </div>
        </div>

        {profileEditing && (
          <form onSubmit={handleProfileSubmit} className="profile-form card-inner">
            <div className="input-group">
              <label htmlFor="profile-username">Username</label>
              <input id="profile-username" name="username" value={profileForm.username} onChange={handleProfileChange} placeholder="your-username" />
            </div>
            <div className="input-group">
              <label htmlFor="profile-bio">Bio</label>
              <textarea id="profile-bio" name="bio" rows="3" value={profileForm.bio} onChange={handleProfileChange} placeholder="Tell travelers about your adventures." />
            </div>
            <div className="form-actions">
              <Button type="submit" className="btn-primary" disabled={profileSubmitting}>{profileSubmitting ? 'Saving...' : 'Save profile'}</Button>
              <Button type="button" onClick={() => setProfileEditing(false)} className="btn-secondary">Cancel</Button>
            </div>
          </form>
        )}

        {error && <div className="status-banner error-banner">{error}</div>}
        {success && <div className="status-banner success-banner">{success}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="trip-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Goa Trip" />
              </div>
              <div className="input-group">
                <label htmlFor="destination">Destination</label>
                <input id="destination" name="destination" value={form.destination} onChange={handleChange} placeholder="Goa" />
              </div>
              <div className="input-group">
                <label htmlFor="startDate">Start Date</label>
                <input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label htmlFor="endDate">End Date</label>
                <input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
              </div>
              <div className="input-group full-width">
                <label htmlFor="description">Description</label>
                <input id="description" name="description" value={form.description} onChange={handleChange} placeholder="Beach vacation" />
              </div>
              <div className="input-group">
                <label htmlFor="rating">Rating</label>
                <select id="rating" name="rating" value={form.rating} onChange={handleChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="input-group full-width">
                <label htmlFor="trip-image">Trip photo</label>
                <input id="trip-image" type="file" accept="image/*" onChange={handleImageSelection} />
                {imageError && <span className="error-text">{imageError}</span>}
                {imagePreview && (
                  <div className="image-preview-box">
                    <img src={imagePreview} alt="Trip preview" />
                  </div>
                )}
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : editingId ? 'Update Trip' : 'Create Trip'}</Button>
              <Button type="button" onClick={resetForm} className="btn-secondary">Cancel</Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loader-inline">
            <div className="spinner-small" />
            <span>Loading your trips…</span>
          </div>
        ) : trips.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🌴</span>
            <h3>You haven't added any trips yet.</h3>
            <p>Start your journey by capturing your first travel memory!</p>
            <Button onClick={() => setShowForm(true)} className="btn-primary empty-state-btn">
              ➕ Create your first trip
            </Button>
          </div>
        ) : (
          <div className="trip-grid">
            {trips.map((trip) => (
              <article key={trip._id} className="trip-card">
                {trip.coverImage && (
                  <div className="trip-card-cover has-image">
                    <img src={trip.coverImage} alt={trip.title} />
                  </div>
                )}
                {!trip.coverImage && (
                  <div className="trip-card-cover placeholder">
                    <div className="trip-card-placeholder">
                      <span>📷</span>
                      <small>No cover image</small>
                    </div>
                  </div>
                )}
                <div className="trip-card-top">
                  <div>
                    <h3>{trip.title}</h3>
                    <p className="trip-destination">📍 {trip.destination}</p>
                  </div>
                  <span className="trip-rating">⭐ {trip.rating || '—'}/5</span>
                </div>
                <p className="trip-date">
                  📅 {formatDisplayDate(trip.startDate)} → {formatDisplayDate(trip.endDate)}
                </p>
                <p className="trip-description">{trip.description || 'A memorable trip to remember.'}</p>
                <div className="trip-actions">
                  <Button onClick={() => navigate(`/trip/${trip._id}`)} className="btn-secondary">View</Button>
                  <Button onClick={() => handleEdit(trip)} className="btn-secondary">Edit</Button>
                  <Button onClick={() => handleDelete(trip._id)} className="btn-secondary" disabled={deletingId === trip._id}>
                    {deletingId === trip._id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
