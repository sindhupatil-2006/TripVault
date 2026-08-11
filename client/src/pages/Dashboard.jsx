import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { createTrip, deleteTrip, getTrips, updateTrip } from '../services/tripService';

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
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
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
      if (editingId) {
        await updateTrip(editingId, {
          title: form.title,
          destination: form.destination,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          description: form.description,
          rating: Number(form.rating),
        });
        setSuccess('Trip updated successfully.');
      } else {
        await createTrip({
          title: form.title,
          destination: form.destination,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          description: form.description,
          rating: Number(form.rating),
        });
        setSuccess('Trip created successfully.');
      }
      await loadTrips();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save your trip.');
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
    setShowForm(true);
    setSuccess('');
    setError('');
  };

  const handleDelete = async (tripId) => {
    const confirmed = window.confirm('Are you sure you want to delete this trip?');
    if (!confirmed) return;

    try {
      setDeletingId(tripId);
      setError('');
      await deleteTrip(tripId);
      setSuccess('Trip deleted successfully.');
      await loadTrips();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete this trip.');
    } finally {
      setDeletingId(null);
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
            <Button onClick={() => { setShowForm((prev) => !prev); setEditingId(null); setForm(initialForm); setError(''); setSuccess(''); }} className="btn-primary">
              {showForm ? 'Close form' : 'Create Trip'}
            </Button>
            <Button onClick={logout} className="btn-secondary">Logout</Button>
          </div>
        </div>

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
            </div>
            <div className="form-actions">
              <Button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : editingId ? 'Update Trip' : 'Create Trip'}</Button>
              <Button type="button" onClick={resetForm} className="btn-secondary">Cancel</Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loader-inline">Loading your trips…</div>
        ) : trips.length === 0 ? (
          <div className="empty-state">
            <h3>No trips yet.</h3>
            <p>Start creating your travel memories!</p>
          </div>
        ) : (
          <div className="trip-grid">
            {trips.map((trip) => (
              <article key={trip._id} className="trip-card">
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
