const formatDisplayDate = (value) => {
  if (!value) {
    return 'TBD';
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

const TripCard = ({ trip, onEdit, onDelete, onView, showActions = false }) => {
  const coverImage = trip.coverImage || '';
  const blurClass = coverImage ? 'trip-card-cover has-image' : 'trip-card-cover placeholder';

  return (
    <article className="trip-card">
      <div className={blurClass}>
        {coverImage ? (
          <img src={coverImage} alt={trip.title || 'Trip cover'} />
        ) : (
          <div className="trip-card-placeholder">
            <span>📷</span>
            <small>No cover image</small>
          </div>
        )}
      </div>

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

      {showActions ? (
        <div className="trip-actions">
          {onView && (
            <button type="button" className="btn btn-secondary" onClick={() => onView(trip)}>
              View
            </button>
          )}
          {onEdit && (
            <button type="button" className="btn btn-secondary" onClick={() => onEdit(trip)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button type="button" className="btn btn-secondary" onClick={() => onDelete(trip._id)}>
              Delete
            </button>
          )}
        </div>
      ) : (
        <div className="trip-actions">
          {onView && (
            <button type="button" className="btn btn-primary" onClick={() => onView(trip)}>
              View trip
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default TripCard;
