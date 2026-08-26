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
      const msg = error.response?.data?.message || (error.code === 'ERR_NETWORK' || error.message === 'Network Error' ? 'Backend server is starting up or unreachable. Please wait a few seconds and try again.' : 'Login failed');
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
        </form>
        <p className="switch-copy">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
