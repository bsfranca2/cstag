import { Layout as AntdLayout } from 'antd';
import { useAuthContext } from '../../auth/useAuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  const { user, handleLogout } = useAuthContext();

  return (
    <AntdLayout>
      <Sidebar role={user.role} />
      <AntdLayout>
        <Header displayName={user.displayName} handleLogout={handleLogout} />
        {children}
        <Footer />
      </AntdLayout>
    </AntdLayout>
  );
}

export default Layout;
