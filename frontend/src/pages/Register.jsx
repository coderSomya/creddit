import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [status, setStatus] = useState({ submitting: false, error: '' });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status.error) setStatus((current) => ({ ...current, error: '' }));
  };

  const validate = () => {
    const username = form.username.trim();
    const email = form.email.trim();

    if (!username) return 'Username is required.';
    if (username.length < 3) return 'Username must be at least 3 characters.';
    if (username.length > 30) return 'Username cannot exceed 30 characters.';
    if (!email) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (!form.confirmPassword) return 'Please confirm your password.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setStatus({ submitting: false, error: validationError });
      return;
    }

    setStatus({ submitting: true, error: '' });

    try {
      const data = await api.post('/auth/register', {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      login(data.token);
      navigate('/');
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Unable to create your account. Please try again.' });
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.panel} aria-labelledby="register-heading">
        <h2 id="register-heading" style={styles.heading}>Create an account</h2>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <label style={styles.label}>
            Username
            <input name="username" type="text" value={form.username} onChange={updateField}
              autoComplete="username" minLength={3} maxLength={30} disabled={status.submitting} style={styles.input} />
          </label>

          <label style={styles.label}>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField}
              autoComplete="email" disabled={status.submitting} style={styles.input} />
          </label>

          <label style={styles.label}>
            Password
            <input name="password" type="password" value={form.password} onChange={updateField}
              autoComplete="new-password" minLength={6} disabled={status.submitting} style={styles.input} />
          </label>

          <label style={styles.label}>
            Confirm password
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField}
              autoComplete="new-password" minLength={6} disabled={status.submitting} style={styles.input} />
          </label>

          {status.error && <p role="alert" style={styles.error}>{status.error}</p>}

          <button type="submit" disabled={status.submitting} style={styles.button}>
            {status.submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </section>
    </div>
  );
}

const styles = {
  page: { maxWidth: 420, margin: '48px auto', padding: '0 16px' },
  panel: {
    border: '1px solid #a5d6a7', borderRadius: 4, background: '#fff', padding: '28px 32px',
    textAlign: 'left', boxShadow: '0 10px 24px rgba(46, 125, 50, 0.08)',
  },
  heading: { margin: '0 0 20px', fontSize: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  label: {
    display: 'flex', flexDirection: 'column', gap: 6, color: '#1a3a1a', fontSize: 14, fontWeight: 600,
  },
  input: {
    boxSizing: 'border-box', width: '100%', border: '1px solid #a5d6a7', borderRadius: 4,
    padding: '10px 12px', background: '#fff', color: '#333', font: 'inherit', fontSize: 15,
  },
  error: {
    margin: 0, color: '#b42318', background: '#fff4f2', border: '1px solid #f5b5ac',
    borderRadius: 4, padding: '9px 10px', fontSize: 14,
  },
  button: {
    border: '1px solid #2e7d32', borderRadius: 4, background: '#2e7d32', color: '#fff',
    cursor: 'pointer', font: 'inherit', fontSize: 15, fontWeight: 700, padding: '10px 14px',
  },
  footerText: { margin: '18px 0 0', color: '#555', fontSize: 14, textAlign: 'center' },
  link: { color: '#2e7d32', fontWeight: 700, textDecoration: 'none' },
};
