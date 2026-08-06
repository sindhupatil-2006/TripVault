import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email';
    if (!form.password.trim()) nextErrors.password = 'Password is required';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
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
      await register(form.name, form.email, form.password);
      navigate('/login');
    } catch (error) {
      setErrors({ form: error.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div className="page-shell">
      <div className="card">
        <h2>Create your account</h2>
        <p className="muted">Join TripVault and start planning your memories.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <Input label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
          {errors.form && <span className="error-text">{errors.form}</span>}
          <Button type="submit" className="btn-primary">Register</Button>
        </form>
        <p className="switch-copy">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
