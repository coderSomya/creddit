import { useState } from 'react';
import { AuthContext } from '../hooks/AuthContext';

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(readStoredUser);

  const login = (newToken, newUser = null) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);

    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } else {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
