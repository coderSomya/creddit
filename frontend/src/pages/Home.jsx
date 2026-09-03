import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import PostVoteControls from '../components/PostVoteControls';

export default function Home() {
  const [feed, setFeed] = useState({
    posts: [],
    requestedSort: null,
    status: 'loading',
    error: null,
  });
  const [sort, setSort] = useState('newest');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    api.get(`/posts?sort=${sort}`)
      .then((posts) => {
        if (!cancelled) {
          setFeed({ posts, requestedSort: sort, status: 'ready', error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFeed({ posts: [], requestedSort: sort, status: 'error', error: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sort]);

  const posts = feed.posts;
  const loading = feed.status === 'loading' || feed.requestedSort !== sort;
  const error = feed.status === 'error' ? feed.error : null;
  const normalizedQuery = query.trim().toLowerCase();
  const visiblePosts = normalizedQuery
    ? posts.filter((post) => {
        const searchable = [
          post.title,
          post.content,
          post.author?.username,
        ].join(' ').toLowerCase();

        return searchable.includes(normalizedQuery);
      })
    : posts;

  const handleVote = (updatedPost) => {
    setFeed((current) => ({
      ...current,
      posts: current.posts.map((post) => (
        post._id === updatedPost._id ? updatedPost : post
      )),
    }));
  };

  return (
    <div style={{ maxWidth: 740, margin: '24px auto', padding: '0 16px' }}>
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 16,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {['newest', 'popular'].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              style={{
                padding: '6px 16px',
                borderRadius: 4,
                border: `1px solid ${sort === s ? '#2e7d32' : '#a5d6a7'}`,
                background: sort === s ? '#2e7d32' : '#fff',
                color: sort === s ? '#fff' : '#333',
                cursor: 'pointer',
                fontWeight: sort === s ? 600 : 400,
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <label style={{ flex: '1 1 240px', maxWidth: 320 }}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts"
            aria-label="Search posts"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '7px 10px',
              borderRadius: 4,
              border: '1px solid #a5d6a7',
              background: '#fff',
              color: '#333',
              font: 'inherit',
              fontSize: 14,
            }}
          />
        </label>
      </div>

      {loading && <p style={{ color: '#888' }}>Loading posts…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p style={{ color: '#888' }}>No posts yet. Be the first to post!</p>
      )}

      {!loading && !error && posts.length > 0 && visiblePosts.length === 0 && (
        <p style={{ color: '#888' }}>No posts match "{query.trim()}".</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visiblePosts.map((post) => (
          <article
            key={post._id}
            style={{
              border: '1px solid #b3c7e6',
              borderRadius: 4,
              padding: '12px 16px',
              background: '#fff',
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
            }}
          >
            <PostVoteControls post={post} onVote={handleVote} compact />
            <Link
              to={`/post/${post._id}`}
              style={{ flex: 1, minWidth: 0, textDecoration: 'none', color: 'inherit' }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                  {post.title}
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  posted by <strong>u/{post.author?.username ?? '[deleted]'}</strong>
                  {' · '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
