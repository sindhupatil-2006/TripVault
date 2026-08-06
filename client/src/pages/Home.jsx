import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Built for travelers</p>
        <h1>Capture every memory with TripVault</h1>
        <p className="hero-text">
          A polished MERN authentication experience for logging into your travel journal and managing your account securely.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">Create account</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
