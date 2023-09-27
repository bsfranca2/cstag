import { AuthContext } from '../useAuthContext';
import { useAuth } from '../useAuth';
import { UserAuthenticated } from '../userAuthenticated';
import GlobalLoader from '../../shared/components/GlobalLoader';

export function AuthContextContainer({ children }) {
  const { isLoading, state, handleLogin, handleLoginAs, handleLogout } =
    useAuth();

  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: new UserAuthenticated(state.user),
        handleLogin,
        handleLoginAs,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
