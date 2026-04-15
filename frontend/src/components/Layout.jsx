import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div style={styles.wrapper}>
      <Navbar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#dae0e6',
  },
  main: {
    flex: 1,
    maxWidth: '1000px',
    width: '100%',
    margin: '1.5rem auto',
    padding: '0 1rem',
  },
};
