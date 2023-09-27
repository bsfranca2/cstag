import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { PageHeader } from 'antd';

function itemRender(route, params, routes) {
  const last = routes.indexOf(route) === routes.length - 1;
  if (route.icon) {
    return <route.icon />;
  }
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={route.path}>{route.breadcrumbName}</Link>
  );
}

export default ({
  title = '',
  subTitle = '',
  actions = [],
  breadcrumb = [],
  ...props
}) => {
  return (
    <PageHeader
      title={title}
      subTitle={subTitle}
      extra={actions}
      breadcrumb={{
        routes: [
          {
            path: '/',
            icon: HomeOutlined,
          },
          ...breadcrumb,
        ],
        itemRender,
      }}
      style={{
        background: '#fff',
      }}
      {...props}
    />
  );
};
