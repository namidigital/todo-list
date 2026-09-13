import { createContext, useContext, useState } from 'react';
import { NETWORK_ERROR_MESSAGE, logDevError } from '../utils/errorMessages';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const login = async (userEmail, password) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
      };

      const res = await fetch('/api/users/logon', options);
      const data = await res.json();

      if (res.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);
        return { success: true };
      } else {
        // The server's reason (and status) stays in the dev console only
        logDevError('login', { status: res.status, message: data?.message });
        return {
          success: false,
          error: 'We could not log you in. Check your email and password and try again.',
        };
      }
    } catch (error) {
      logDevError('login', error);
      return {
        success: false,
        error: NETWORK_ERROR_MESSAGE,
      };
    }
  };

  const logout = async () => {
    if (!token) {
      setEmail('');
      setToken('');
      return { success: true };
    }

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      };

      const res = await fetch('/api/users/logoff', options);

      setEmail('');
      setToken('');

      if (res.status === 200) {
        return { success: true };
      }

      logDevError('logout', { status: res.status });
      return {
        success: false,
        error: 'You have been logged out on this device.',
      };
    } catch (error) {
      logDevError('logout', error);
      setEmail('');
      setToken('');
      return {
        success: false,
        error: 'You have been logged out on this device.',
      };
    }
  };

  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
