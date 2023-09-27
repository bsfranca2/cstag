import React from 'react';
import { Layout } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import PageHeader from './PageHeader';
import Footer from './Footer';

const { Content } = Layout;

export default function DefaultLayout({ header, breadcrumb, children }) {
  const history = useHistory();
  const {
    state: { companyName, role },
    handleLogout,
  } = useAuthContext();

  return (
    <Layout>
      <Sidebar role={role} navigate={(path) => history.push(path)} />
      <Layout>
        <Header companyName={companyName} handleLogout={handleLogout} />
        {header && <PageHeader {...header} breadcrumb={breadcrumb} />}
        <Content style={{ margin: `24px 24px 0` }}>{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
