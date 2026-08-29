import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export default function CreatePost() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [form, setForm] = useState({ title: '', content: '' });
  const [status, setStatus] = useState({ submitting: false, error: '' });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status.error) setStatus((current) => ({ ...current, error: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setStatus({ submitting: false, error: 'Title is required.' });
      return;
    }

    if (!form.content.trim()) {
      setStatus({ submitting: false, error: 'Content is required.' });
      return;
    }

    setStatus({ submitting: true, error: '' });

    try {
      const post = await api.post('/posts', {
        title: form.title.trim(),
        content: form.content.trim(),
      });

      navigate(`/post/${post._id}`, {
        replace: true,
        state: { message: 'Post created successfully.' },
      });
    } catch (err) {
      setStatus({
        submitting: false,
        error: err.message || 'Unable to create your post. Please try again.',
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.page}>
        <section style={styles.panel} aria-labelledby="create-post-heading">
          <h2 id="create-post-heading" style={styles.heading}>Create a post</h2>
          <p style={styles.prompt}>You need to log in before you can create a post.</p>
          <Link to="/login" state={{ from: '/create' }} style={styles.loginLink}>
            Go to login
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <section style={styles.panel} aria-labelledby="create-post-heading">
        <h2 id="create-post-heading" style={styles.heading}>Create a post</h2>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <label style={styles.label}>
            Title
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={updateField}
              disabled={status.submitting}
              autoFocus
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Content
            <textarea
              name="content"
              value={form.content}
              onChange={updateField}
              disabled={status.submitting}
              rows={10}
              style={styles.textarea}
            />
          </label>

          {status.error && <p role="alert" style={styles.error}>{status.error}</p>}

          <div style={styles.actions}>
            <Link to="/" style={styles.cancelLink}>Cancel</Link>
            <button type="submit" disabled={status.submitting} style={styles.button}>
              {status.submitting ? 'Creating post...' : 'Create post'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

const styles = {
  page: { maxWidth: 680, margin: '24px auto', padding: '0 16px' },
  panel: {
    border: '1px solid #a5d6a7', borderRadius: 4, background: '#fff', padding: '28px 32px',
    textAlign: 'left', boxShadow: '0 10px 24px rgba(46, 125, 50, 0.08)',
  },
  heading: { margin: '0 0 20px', fontSize: 24 },
  prompt: { color: '#555', marginBottom: 20 },
  loginLink: {
    display: 'inline-block', borderRadius: 4, background: '#2e7d32', color: '#fff',
    fontSize: 15, fontWeight: 700, padding: '10px 14px', textDecoration: 'none',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  label: {
    display: 'flex', flexDirection: 'column', gap: 6, color: '#1a3a1a', fontSize: 14, fontWeight: 600,
  },
  input: {
    boxSizing: 'border-box', width: '100%', border: '1px solid #a5d6a7', borderRadius: 4,
    padding: '10px 12px', background: '#fff', color: '#333', font: 'inherit', fontSize: 15,
  },
  textarea: {
    boxSizing: 'border-box', width: '100%', border: '1px solid #a5d6a7', borderRadius: 4,
    padding: '10px 12px', background: '#fff', color: '#333', font: 'inherit', fontSize: 15,
    lineHeight: 1.5, resize: 'vertical',
  },
  error: {
    margin: 0, color: '#b42318', background: '#fff4f2', border: '1px solid #f5b5ac',
    borderRadius: 4, padding: '9px 10px', fontSize: 14,
  },
  actions: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 },
  cancelLink: { color: '#555', fontSize: 14, textDecoration: 'none' },
  button: {
    border: '1px solid #2e7d32', borderRadius: 4, background: '#2e7d32', color: '#fff',
    cursor: 'pointer', font: 'inherit', fontSize: 15, fontWeight: 700, padding: '10px 14px',
  },
};
