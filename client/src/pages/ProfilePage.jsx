import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPublicProfile } from '../services/userService';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getPublicProfile(username);
        setProfile(response);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load this profile right now.');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="card profile-card">
          <div className="loader-inline">
            <div className="spinner-small" />
            <span>Loading traveler profile…</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <div className="card profile-card">
          <h2>Profile unavailable</h2>
          <p className="muted">{error}</p>
          <Link to="/" className="btn btn-primary">Back home</Link>
        </div>
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="page-shell">
        <div className="card profile-card">
          <h2>User not found</h2>
          <p className="muted">This traveler does not have a public profile yet.</p>
          <Link to="/" className="btn btn-primary">Return home</Link>
        </div>
      </div>
    );
  }

  const tripList = Array.isArray(profile.trips) ? profile.trips : [];

  return (
    <div className="page-shell profile-shell">
      <div className="card profile-card">
        <div className="profile-header">
          <div>
            <p className="eyebrow">Traveler profile</p>
            <h2>{profile.user.name}</h2>
            <p className="profile-username">@{profile.user.username || username}</p>
          </div>
        </div>

        <p className="profile-bio">{profile.user.bio || 'This traveler has not added a bio yet.'}</p>

        <div className="profile-section-header">
          <h3>Trips</h3>
        </div>

        {tripList.length === 0 ? (
          <div className="empty-state">
            <h3>No trips yet</h3>
            <p>This traveler has not shared any adventures yet.</p>
          </div>
        ) : (
          <div className="profile-trip-grid">
            {tripList.map((trip) => (
              <div key={trip._id || `${trip.title}-${trip.destination}`} className="profile-trip-card">
                {trip.coverImage ? (
                  <img src={trip.coverImage} alt={trip.title} className="profile-trip-image" />
                ) : (
                  <div className="profile-trip-placeholder">
                    <span>📷</span>
                  </div>
                )}
                <div className="profile-trip-content">
                  <h4>{trip.title}</h4>
                  <p className="profile-trip-meta">📍 {trip.destination}</p>
                  <p className="profile-trip-meta">📅 {trip.dates}</p>
                  <p className="profile-trip-meta">⭐ {trip.rating || 0}/5</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
