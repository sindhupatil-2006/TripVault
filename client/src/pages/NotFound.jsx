import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="page-shell">
      <div className="card">
        <h2>404 — Page not found</h2>
        <p className="muted">The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Go home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
