import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTrip, uploadTripPhoto } from '../services/tripService';
import { useAuth } from '../context/AuthContext';

const formatDate = (value) => {
  if (!value) return 'TBD';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return 'TBD';

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const TripDetailPage = () => {
  const { id } = useParams();
  const { showToast } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTrip = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getTrip(id);
      setTrip(response.trip || response);
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to load this trip.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTrip();
    }
  }, [id]);

  const handleUploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      const msg = 'Please choose a valid image file.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = 'File size must be 5MB or less.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');
      const response = await uploadTripPhoto(id, file);
      setSuccess('Photo uploaded successfully!');
      showToast('Photo uploaded successfully!', 'success');
      if (response.trip) {
        setTrip(response.trip);
      } else {
        await fetchTrip();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload photo.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  if (loading) {
    return <div className="page-shell"><div className="card"><div className="loader-inline">Loading trip…</div></div></div>;
  }

  if (error && !trip) {
    return <div className="page-shell"><div className="card"><h2>Trip unavailable</h2><p className="muted">{error}</p><Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link></div></div>;
  }

  if (!trip) {
    return <div className="page-shell"><div className="card"><h2>Trip not found</h2><Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link></div></div>;
  }

  const photos = Array.isArray(trip.photos) ? trip.photos : [];

  return (
    <div className="page-shell detail-shell">
      <div className="card detail-card">
        <div className="detail-header">
          <div>
            <p className="eyebrow">Travel memory</p>
            <h2>{trip.title}</h2>
          </div>
          <Link to="/dashboard" className="btn btn-secondary">Back</Link>
        </div>

        {error && <div className="status-banner error-banner">{error}</div>}
        {success && <div className="status-banner success-banner">{success}</div>}

        {trip.coverImage && (
          <div className="detail-cover-wrap">
            <img src={trip.coverImage} alt={trip.title} className="detail-cover" />
          </div>
        )}

        <div className="detail-meta">
          <p><strong>Destination:</strong> {trip.destination}</p>
          <p><strong>Dates:</strong> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
          <p><strong>Rating:</strong> {trip.rating || '—'}/5</p>
        </div>

        {trip.description && <p className="trip-description detail-description">{trip.description}</p>}

        <div className="detail-gallery-section">
          <div className="gallery-header">
            <h3>Photo gallery</h3>
            <label className={`btn btn-secondary ${uploading ? 'disabled' : ''}`} style={{ cursor: 'pointer' }}>
              {uploading ? 'Uploading...' : '📷 Add Photo'}
              <input type="file" accept="image/*" onChange={handleUploadPhoto} disabled={uploading} style={{ display: 'none' }} />
            </label>
          </div>
          {photos.length === 0 ? (
            <div className="empty-state">
              <h3>No photos yet</h3>
              <p>Click "Add Photo" to attach your first travel moment to this trip.</p>
            </div>
          ) : (
            <div className="photo-grid">
              {photos.map((photo, index) => (
                <div key={`${photo}-${index}`} className="photo-tile">
                  <img src={photo} alt={`${trip.title} photo ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
