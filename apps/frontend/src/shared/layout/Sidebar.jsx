import { Layout } from 'antd';
import { Logo } from './styles';
import Menu from './Menu';

function Sidebar({ role }) {
  return (
    <Layout.Sider
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        overflow: 'auto',
        height: '100vh',
      }}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <Logo>
        <img src="/img/logo.webp" alt="CStag logo" />
      </Logo>
      <Menu role={role} />
    </Layout.Sider>
  );
}

export default Sidebar;
