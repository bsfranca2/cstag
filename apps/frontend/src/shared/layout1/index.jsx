import { Button, Space, Typography } from 'antd';
import ProLayout from '@ant-design/pro-layout';
import { Link, useLocation } from 'react-router-dom';
import { getMenuItems } from './menuItems';
import { useAuthContext } from '../../auth/useAuthContext';
import Logo from './Logo';
import Footer from './Footer';

export default function Component({ children }) {
  const { user, handleLogout } = useAuthContext();
  const { pathname } = useLocation();

  const menuItems = getMenuItems(user);
  const selectedItem = menuItems.find((i) => i.path === pathname);
  const selectedKeys = selectedItem ? [selectedItem.path] : [];

  const settings = {
    fixSiderbar: true,
    navTheme: 'dark',
    layout: 'side',
    contentWidth: 'Fluid',
    headerHeight: 48,
    primaryColor: '#2F54EB',
    splitMenus: false,
  };

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        pageTitleRender={false}
        title={false}
        logo={Logo}
        route={{ routes: getMenuItems(user) }}
        selectedKeys={selectedKeys}
        location={{ pathname }}
        menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
        rightContentRender={() => (
          <Space size="large" align="center">
            <Typography.Text>{user.displayName}</Typography.Text>
            <Button onClick={handleLogout}>Sair</Button>
          </Space>
        )}
        footerRender={Footer}
        {...settings}
      >
        {children}
      </ProLayout>
    </div>
  );
}
