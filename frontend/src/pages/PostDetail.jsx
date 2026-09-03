import { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import PostVoteControls from '../components/PostVoteControls';

export default function PostDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [detail, setDetail] = useState({
    post: null,
    similar: [],
    requestedId: null,
    status: 'loading',
    error: null,
  });
  const [comments, setComments] = useState({
    items: [],
    requestedId: null,
    status: 'loading',
    error: '',
  });
  const [commentBody, setCommentBody] = useState('');
  const [commentStatus, setCommentStatus] = useState({ submitting: false, error: '' });

  useEffect(() => {
    let cancelled = false;

    api.get(`/posts/${id}`)
      .then((data) => {
        return api.get(`/posts/${id}/similar`).then((similarPosts) => ({
          post: data,
          similar: similarPosts,
        }));
      })
      .then(({ post, similar }) => {
        if (!cancelled) {
          setDetail({ post, similar, requestedId: id, status: 'ready', error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setDetail({
            post: null,
            similar: [],
            requestedId: id,
            status: 'error',
            error: err.message,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    api.get(`/posts/${id}/comments`)
      .then((items) => {
        if (!cancelled) {
          setComments({ items, requestedId: id, status: 'ready', error: '' });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setComments({ items: [], requestedId: id, status: 'error', error: err.message });
        }
      });

    setCommentBody('');
    setCommentStatus({ submitting: false, error: '' });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const body = commentBody.trim();

    if (!body) {
      setCommentStatus({ submitting: false, error: 'Comment cannot be empty.' });
      return;
    }

    setCommentStatus({ submitting: true, error: '' });

    try {
      const comment = await api.post(`/posts/${id}/comments`, { body });
      setComments((current) => ({
        items: [comment, ...current.items],
        requestedId: id,
        status: 'ready',
        error: '',
      }));
      setCommentBody('');
      setCommentStatus({ submitting: false, error: '' });
    } catch (err) {
      setCommentStatus({
        submitting: false,
        error: err.message || 'Unable to add your comment. Please try again.',
      });
    }
  };

  const { post, similar } = detail;
  const loading = detail.status === 'loading' || detail.requestedId !== id;
  const error = detail.status === 'error' ? detail.error : null;

  if (loading) return <p style={{ padding: 24, color: '#888' }}>Loading…</p>;
  if (error) return <p style={{ padding: 24, color: 'red' }}>{error}</p>;
  if (!post) return null;

  const score = post.upvotes - post.downvotes;
  const handleVote = (updatedPost) => {
    setDetail((current) => ({ ...current, post: updatedPost }));
  };

  return (
    <div style={{ maxWidth: 740, margin: '24px auto', padding: '0 16px' }}>
      {location.state?.message && (
        <p role="status" style={styles.success}>{location.state.message}</p>
      )}
      <Link to="/" style={{ fontSize: 13, color: '#2e7d32', textDecoration: 'none' }}>
        ← Back to feed
      </Link>

      <div
        style={{
          border: '1px solid #a5d6a7',
          borderRadius: 4,
          background: '#fff',
          padding: '20px 24px',
          marginTop: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <PostVoteControls post={post} onVote={handleVote} />
          <h2 style={{ margin: '2px 0 8px', fontSize: 22 }}>{post.title}</h2>
        </div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          posted by <strong>u/{post.author?.username ?? '[deleted]'}</strong>
          {' · '}
          {new Date(post.createdAt).toLocaleDateString()}
          {' · '}
          <span style={{ color: score > 0 ? '#4caf50' : '#888', fontWeight: 600 }}>
            {score} {score === 1 ? 'vote' : 'votes'}
          </span>
          {' ('}↑{post.upvotes} ↓{post.downvotes}{')'}
        </div>

        <div
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            borderTop: '1px solid #a5d6a7',
            paddingTop: 16,
          }}
        >
          {post.content}
        </div>
      </div>

      <section style={styles.commentsSection} aria-labelledby="comments-heading">
        <h3 id="comments-heading" style={styles.commentsHeading}>
          Comments{comments.status === 'ready' ? ` (${comments.items.length})` : ''}
        </h3>

        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} style={styles.commentForm} noValidate>
            <label htmlFor="comment-body" style={styles.commentLabel}>Add a comment</label>
            <textarea
              id="comment-body"
              value={commentBody}
              onChange={(event) => {
                setCommentBody(event.target.value);
                if (commentStatus.error) {
                  setCommentStatus((current) => ({ ...current, error: '' }));
                }
              }}
              disabled={commentStatus.submitting}
              rows={4}
              maxLength={10000}
              style={styles.commentInput}
            />
            {commentStatus.error && <p role="alert" style={styles.error}>{commentStatus.error}</p>}
            <button
              type="submit"
              disabled={commentStatus.submitting}
              style={styles.commentButton}
            >
              {commentStatus.submitting ? 'Posting comment...' : 'Comment'}
            </button>
          </form>
        ) : (
          <p style={styles.loginPrompt}>
            <Link to="/login" state={{ from: `/post/${id}` }} style={styles.loginLink}>Log in</Link>
            {' '}to add a comment.
          </p>
        )}

        {(comments.status === 'loading' || comments.requestedId !== id) && (
          <p style={styles.commentsMessage}>Loading comments…</p>
        )}
        {comments.status === 'error' && comments.requestedId === id && (
          <p role="alert" style={styles.error}>{comments.error || 'Unable to load comments.'}</p>
        )}
        {comments.status === 'ready' && comments.items.length === 0 && (
          <p style={styles.commentsMessage}>No comments yet. Start the conversation.</p>
        )}
        {comments.status === 'ready' && comments.items.length > 0 && (
          <div style={styles.commentList}>
            {comments.items.map((comment) => (
              <article key={comment._id} style={styles.comment}>
                <div style={styles.commentMeta}>
                  <strong>u/{comment.author?.username ?? '[deleted]'}</strong>
                  {' · '}
                  <time dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
                <p style={styles.commentBody}>{comment.body}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {similar.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 15, color: '#555', marginBottom: 12, fontWeight: 600 }}>
            Similar Posts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {similar.map((s) => {
              const sScore = s.upvotes - s.downvotes;
              return (
                <Link
                  key={s._id}
                  to={`/post/${s._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      border: '1px solid #a5d6a7',
                      borderRadius: 4,
                      background: '#fff',
                      padding: '12px 16px',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f8f1')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      u/{s.author?.username ?? '[deleted]'}
                      {' · '}
                      <span style={{ color: sScore > 0 ? '#4caf50' : '#888' }}>
                        {sScore} {sScore === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  success: {
    margin: '0 0 12px', color: '#1b5e20', background: '#f1f8f1', border: '1px solid #81c784',
    borderRadius: 4, padding: '9px 12px', fontSize: 14, textAlign: 'left',
  },
  commentsSection: { marginTop: 32 },
  commentsHeading: { margin: '0 0 16px', color: '#1a3a1a', fontSize: 18 },
  commentForm: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
    marginBottom: 20,
  },
  commentLabel: { alignSelf: 'flex-start', color: '#1a3a1a', fontSize: 14, fontWeight: 600 },
  commentInput: {
    boxSizing: 'border-box', width: '100%', border: '1px solid #a5d6a7', borderRadius: 4,
    padding: '10px 12px', background: '#fff', color: '#333', font: 'inherit', fontSize: 15,
    lineHeight: 1.5, resize: 'vertical',
  },
  commentButton: {
    border: '1px solid #2e7d32', borderRadius: 4, background: '#2e7d32', color: '#fff',
    cursor: 'pointer', font: 'inherit', fontSize: 14, fontWeight: 700, padding: '8px 14px',
  },
  loginPrompt: {
    margin: '0 0 20px', border: '1px solid #c8e6c9', borderRadius: 4,
    background: '#f1f8f1', color: '#555', padding: '12px 14px', fontSize: 14,
  },
  loginLink: { color: '#2e7d32', fontWeight: 700 },
  commentsMessage: { color: '#777', fontSize: 14 },
  commentList: { display: 'flex', flexDirection: 'column', gap: 10 },
  comment: {
    border: '1px solid #c8e6c9', borderRadius: 4, background: '#fff', padding: '12px 16px',
  },
  commentMeta: { color: '#777', fontSize: 12 },
  commentBody: { margin: '8px 0 0', fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' },
  error: {
    alignSelf: 'stretch', margin: 0, color: '#b42318', background: '#fff4f2',
    border: '1px solid #f5b5ac', borderRadius: 4, padding: '9px 10px', fontSize: 14,
  },
};
