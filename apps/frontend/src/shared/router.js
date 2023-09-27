import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from '../auth/useAuthContext';
import Layout from './layout1';

function NavigateToHome() {
  const { user } = useAuthContext();
  return <Navigate to={user.isAdmin ? '/admin' : '/transportadora'} />;
}

function NavigateToLogin() {
  return <Navigate to="/entrar" />;
}

export function Home() {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <NavigateToHome /> : <NavigateToLogin />;
}

export function RequireUnauth({ children }) {
  const { isAuthenticated } = useAuthContext();
  return !isAuthenticated ? children : <NavigateToHome />;
}

export function ProtectedRoutes(props) {
  const { isAuthenticated, user } = useAuthContext();

  if (!isAuthenticated) {
    return <NavigateToLogin />;
  }

  if (props.roleRequired && !user.role.isEqual(props.roleRequired)) {
    return <NavigateToHome />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
