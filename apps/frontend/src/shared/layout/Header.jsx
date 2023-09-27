import { Button, Layout, Space, Typography } from 'antd';
import { HeaderItems } from './styles';

function Header({ displayName, handleLogout }) {
  return (
    <Layout.Header
      style={{
        padding: 0,
        background: '#fff',
        boxShadow: '0 1px 4px rgb(0 21 41 / 8%)',
        zIndex: 1,
        display: 'flex',
        height: 48,
      }}
    >
      <HeaderItems>
        <div />
        <Space size="large" align="center">
          <Typography.Text>{displayName}</Typography.Text>
          <Button onClick={handleLogout}>Sair</Button>
        </Space>
      </HeaderItems>
    </Layout.Header>
  );
}

export default Header;
