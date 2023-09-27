import { createContext, useContext } from 'react';

export const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthContext must be used within AuthProvider');
  return context;
}
