import React, { createContext, useContext } from 'react';
import GlobalLoader from '../components/GlobalLoader';
import useAuth from '../hooks/useAuth';

export const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthContext must be used within AuthProvider');
  return context;
}

export default ({ children }) => {
  const { isLoading, state, dispatch, handleLogin, handleLogout } = useAuth();

  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <AuthContext.Provider
      value={{ state, dispatch, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
