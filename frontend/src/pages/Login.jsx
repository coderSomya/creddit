import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ submitting: false, error: '' });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status.error) {
      setStatus((current) => ({ ...current, error: '' }));
    }
  };

  const validate = () => {
    if (!form.email.trim()) return 'Email is required.';
    if (!form.email.includes('@')) return 'Enter a valid email address.';
    if (!form.password) return 'Password is required.';
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
      const data = await api.post('/auth/login', {
        email: form.email.trim(),
        password: form.password,
      });

      login(data.token, data.user);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setStatus({
        submitting: false,
        error: err.message || 'Unable to log in. Check your credentials and try again.',
      });
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.panel} aria-labelledby="login-heading">
        <h2 id="login-heading" style={styles.heading}>Login</h2>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <label style={styles.label}>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              disabled={status.submitting}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              autoComplete="current-password"
              disabled={status.submitting}
              style={styles.input}
            />
          </label>

          {status.error && (
            <p role="alert" style={styles.error}>
              {status.error}
            </p>
          )}

          <button type="submit" disabled={status.submitting} style={styles.button}>
            {status.submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footerText}>
          Need an account? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </section>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 420,
    margin: '48px auto',
    padding: '0 16px',
  },
  panel: {
    border: '1px solid #a5d6a7',
    borderRadius: 4,
    background: '#fff',
    padding: '28px 32px',
    textAlign: 'left',
    boxShadow: '0 10px 24px rgba(46, 125, 50, 0.08)',
  },
  heading: {
    margin: '0 0 20px',
    fontSize: 24,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    color: '#1a3a1a',
    fontSize: 14,
    fontWeight: 600,
  },
  input: {
    boxSizing: 'border-box',
    width: '100%',
    border: '1px solid #a5d6a7',
    borderRadius: 4,
    padding: '10px 12px',
    background: '#fff',
    color: '#333',
    font: 'inherit',
    fontSize: 15,
  },
  error: {
    margin: 0,
    color: '#b42318',
    background: '#fff4f2',
    border: '1px solid #f5b5ac',
    borderRadius: 4,
    padding: '9px 10px',
    fontSize: 14,
  },
  button: {
    border: '1px solid #2e7d32',
    borderRadius: 4,
    background: '#2e7d32',
    color: '#fff',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: 15,
    fontWeight: 700,
    padding: '10px 14px',
  },
  footerText: {
    margin: '18px 0 0',
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    color: '#2e7d32',
    fontWeight: 700,
    textDecoration: 'none',
  },
};
