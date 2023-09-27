import React from 'react';
import { Button, Layout, Space, Typography } from 'antd';
import { HeaderItems } from './styles';

export default ({ companyName, handleLogout }) => {
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
        <Space size='large' align='center'>
          <Typography.Text>{companyName}</Typography.Text>
          <Button onClick={handleLogout}>Sair</Button>
        </Space>
      </HeaderItems>
    </Layout.Header>
  );
};
