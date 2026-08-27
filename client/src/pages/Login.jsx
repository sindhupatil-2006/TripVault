import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { user, login, showToast } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email';
    if (!form.password.trim()) nextErrors.password = 'Password is required';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});
      await login(form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      let msg = 'Login failed';
      if (error.response?.status === 503 || error.response?.headers?.['x-render-routing'] === 'hibernate-wake-error') {
        msg = 'Backend server is waking up from sleep. Please wait ~10 seconds and try again.';
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (Array.isArray(error.response?.data?.errors)) {
        msg = error.response.data.errors.map((e) => e.msg).join('. ');
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        msg = 'Server connection timed out while starting up. Please click Login again.';
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        msg = 'Cannot reach server. Backend may be starting up. Please try again.';
      } else if (error.message) {
        msg = error.message;
      }

      setErrors({ form: msg });
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="card">
        <h2>Welcome back</h2>
        <p className="muted">Log in to continue your TripVault journey.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="traveler@example.com" />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="••••••••" />
          {errors.form && <div className="status-banner error-banner">{errors.form}</div>}
          <Button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Login'}
          </Button>
          {submitting && <p className="muted text-sm text-center" style={{ marginTop: '0.5rem' }}>Connecting to server (cold start may take ~20s if idle)...</p>}
        </form>
        <p className="switch-copy">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
