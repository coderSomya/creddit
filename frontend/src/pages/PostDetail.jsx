import { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function PostDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [detail, setDetail] = useState({
    post: null,
    similar: [],
    requestedId: null,
    status: 'loading',
    error: null,
  });

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

  const { post, similar } = detail;
  const loading = detail.status === 'loading' || detail.requestedId !== id;
  const error = detail.status === 'error' ? detail.error : null;

  if (loading) return <p style={{ padding: 24, color: '#888' }}>Loading…</p>;
  if (error) return <p style={{ padding: 24, color: 'red' }}>{error}</p>;
  if (!post) return null;

  const score = post.upvotes - post.downvotes;

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
        <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>{post.title}</h2>
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
};
