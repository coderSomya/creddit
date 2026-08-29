import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Creddit</Link>
      <div style={styles.links}>
        <NavLink to="/" style={({ isActive }) => isActive ? styles.activeLink : styles.link} end>
          Home
        </NavLink>
        {isLoggedIn ? (
          <>
            {user?.username && <span style={styles.username}>u/{user.username}</span>}
            <button type="button" onClick={logout} style={styles.logoutButton}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
              Login
            </NavLink>
            <NavLink to="/register" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    height: '56px',
    background: '#0a1f0a',
    color: '#fff',
  },
  brand: {
    color: '#4caf50',
    fontWeight: 700,
    fontSize: '1.4rem',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  activeLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    borderBottom: '2px solid #e53e3e',
  },
  username: {
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  logoutButton: {
    border: '1px solid rgba(255,255,255,0.45)',
    borderRadius: 4,
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: '0.9rem',
    padding: '5px 10px',
  },
};
