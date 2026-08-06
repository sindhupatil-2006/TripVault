import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page-shell">
      <div className="card dashboard-card">
        <p className="eyebrow">Authenticated</p>
        <h2>Welcome, {user?.name}</h2>
        <p className="muted">Email: {user?.email}</p>
        <Button onClick={logout} className="btn-primary">Logout</Button>
      </div>
    </div>
  );
};

export default DashboardPage;
