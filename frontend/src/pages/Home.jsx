import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/posts?sort=${sort}`)
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sort]);

  return (
    <div style={{ maxWidth: 740, margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['newest', 'popular'].map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            style={{
              padding: '6px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: sort === s ? '#ff4500' : '#fff',
              color: sort === s ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: sort === s ? 600 : 400,
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: '#888' }}>Loading posts…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p style={{ color: '#888' }}>No posts yet. Be the first to post!</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: '12px 16px',
                background: '#fff',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ff4500')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ccc')}
            >
              {/* Vote count */}
              <div
                style={{
                  minWidth: 40,
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 15,
                  color: post.upvotes - post.downvotes > 0 ? '#ff4500' : '#888',
                }}
              >
                {post.upvotes - post.downvotes}
                <div style={{ fontSize: 11, fontWeight: 400, color: '#888' }}>votes</div>
              </div>

              {/* Post info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                  {post.title}
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  posted by <strong>u/{post.author?.username ?? '[deleted]'}</strong>
                  {' · '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
