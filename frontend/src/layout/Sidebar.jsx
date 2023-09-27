import React from 'react';
import { Layout } from 'antd';
import Menu from './Menu';
import { Logo } from './styles';

export default ({ role, navigate }) => {
  return (
    <Layout.Sider
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        overflow: 'auto',
        height: '100vh',
      }}
      breakpoint='lg'
      collapsedWidth='0'
    >
      <Logo>
        <img src='/img/logo.webp' alt='CStag logo' />
      </Logo>
      <Menu role={role} navigate={navigate} />
    </Layout.Sider>
  );
};
