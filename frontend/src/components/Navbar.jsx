import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Creddit</Link>
      <div style={styles.links}>
        <NavLink to="/" style={({ isActive }) => isActive ? styles.activeLink : styles.link} end>
          Home
        </NavLink>
        <NavLink to="/login" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
          Login
        </NavLink>
        <NavLink to="/register" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
          Register
        </NavLink>
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
    background: '#ff4500',
    color: '#fff',
  },
  brand: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.4rem',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  activeLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    borderBottom: '2px solid #fff',
  },
};
