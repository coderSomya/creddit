import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(setPost)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: 24, color: '#888' }}>Loading…</p>;
  if (error) return <p style={{ padding: 24, color: 'red' }}>{error}</p>;
  if (!post) return null;

  const score = post.upvotes - post.downvotes;

  return (
    <div style={{ maxWidth: 740, margin: '24px auto', padding: '0 16px' }}>
      <Link to="/" style={{ fontSize: 13, color: '#ff4500', textDecoration: 'none' }}>
        ← Back to feed
      </Link>

      <div
        style={{
          border: '1px solid #ccc',
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
          <span style={{ color: score > 0 ? '#ff4500' : '#888', fontWeight: 600 }}>
            {score} {score === 1 ? 'vote' : 'votes'}
          </span>
          {' ('}↑{post.upvotes} ↓{post.downvotes}{')'}
        </div>

        <div
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            borderTop: '1px solid #eee',
            paddingTop: 16,
          }}
        >
          {post.content}
        </div>
      </div>
    </div>
  );
}
