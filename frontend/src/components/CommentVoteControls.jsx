import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export default function CommentVoteControls({ postId, comment, onVote }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState({ submitting: false, error: '', loginPrompt: false });
  const score = comment.upvotes - comment.downvotes;

  const vote = async (type) => {
    if (!isLoggedIn) {
      setStatus({ submitting: false, error: '', loginPrompt: true });
      return;
    }

    setStatus({ submitting: true, error: '', loginPrompt: false });
    try {
      const updated = await api.post(`/posts/${postId}/comments/${comment._id}/vote`, { type });
      onVote(updated);
      setStatus({ submitting: false, error: '', loginPrompt: false });
    } catch (err) {
      setStatus({
        submitting: false,
        error: err.message || 'Unable to record your vote.',
        loginPrompt: false,
      });
    }
  };

  return (
    <div style={styles.container}>
      <button type="button" onClick={() => vote('up')} disabled={status.submitting}
        aria-label={comment.userVote === 'up' ? 'Remove comment upvote' : 'Upvote comment'}
        aria-pressed={comment.userVote === 'up'}
        style={buttonStyle(status.submitting, comment.userVote === 'up')}>↑</button>
      <strong style={{ color: score > 0 ? '#2e7d32' : score < 0 ? '#b42318' : '#777' }}>
        {score}
      </strong>
      <button type="button" onClick={() => vote('down')} disabled={status.submitting}
        aria-label={comment.userVote === 'down' ? 'Remove comment downvote' : 'Downvote comment'}
        aria-pressed={comment.userVote === 'down'}
        style={buttonStyle(status.submitting, comment.userVote === 'down')}>↓</button>
      {status.submitting && <span style={styles.message}>Voting…</span>}
      {status.error && <span role="alert" style={{ ...styles.message, color: '#b42318' }}>{status.error}</span>}
      {status.loginPrompt && (
        <span style={styles.message}>
          <Link to="/login" state={{ from: `${location.pathname}${location.search}` }} style={styles.link}>Log in</Link>{' '}to vote.
        </span>
      )}
    </div>
  );
}

const buttonStyle = (disabled, active) => ({
  width: 26, height: 26, padding: 0, border: '1px solid #a5d6a7', borderRadius: 4,
  background: active ? '#2e7d32' : '#fff', color: active ? '#fff' : '#2e7d32',
  cursor: disabled ? 'wait' : 'pointer', fontSize: 16, opacity: disabled ? 0.6 : 1,
});

const styles = {
  container: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  message: { width: '100%', color: '#777', fontSize: 11 },
  link: { color: '#2e7d32' },
};
