import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

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
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ form: error.response?.data?.message || 'Login failed' });
    }
  };

  return (
    <div className="page-shell">
      <div className="card">
        <h2>Welcome back</h2>
        <p className="muted">Log in to continue your TripVault journey.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
          {errors.form && <span className="error-text">{errors.form}</span>}
          <Button type="submit" className="btn-primary">Login</Button>
        </form>
        <p className="switch-copy">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
