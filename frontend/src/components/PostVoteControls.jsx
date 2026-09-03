import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export default function PostVoteControls({ post, onVote, compact = false }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState({ submitting: false, error: '', loginPrompt: false });
  const score = post.upvotes - post.downvotes;

  const vote = async (type) => {
    if (!isLoggedIn) {
      setStatus({ submitting: false, error: '', loginPrompt: true });
      return;
    }

    setStatus({ submitting: true, error: '', loginPrompt: false });
    try {
      const updatedPost = await api.post(`/posts/${post._id}/vote`, { type });
      onVote(updatedPost);
      setStatus({ submitting: false, error: '', loginPrompt: false });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Unable to record your vote.', loginPrompt: false });
    }
  };

  return (
    <div style={{ minWidth: compact ? 54 : 78, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
        <button type="button" onClick={() => vote('up')} disabled={status.submitting}
          aria-label={`Upvote ${post.title}`} title="Upvote" style={buttonStyle(status.submitting)}>↑</button>
        <strong style={{ color: score > 0 ? '#2e7d32' : score < 0 ? '#b42318' : '#777' }}>{score}</strong>
        <button type="button" onClick={() => vote('down')} disabled={status.submitting}
          aria-label={`Downvote ${post.title}`} title="Downvote" style={buttonStyle(status.submitting)}>↓</button>
      </div>
      {status.submitting && <span style={messageStyle}>Voting…</span>}
      {status.error && <span role="alert" style={{ ...messageStyle, color: '#b42318' }}>{status.error}</span>}
      {status.loginPrompt && (
        <span style={messageStyle}>
          <Link to="/login" state={{ from: `${location.pathname}${location.search}` }} style={{ color: '#2e7d32' }}>Log in</Link>{' '}to vote.
        </span>
      )}
    </div>
  );
}

const buttonStyle = (disabled) => ({
  width: 28, height: 28, padding: 0, border: '1px solid #a5d6a7', borderRadius: 4,
  background: '#fff', color: '#2e7d32', cursor: disabled ? 'wait' : 'pointer',
  fontSize: 17, opacity: disabled ? 0.6 : 1,
});

const messageStyle = { display: 'block', marginTop: 5, color: '#777', fontSize: 11 };
