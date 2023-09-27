import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { PageHeader as PageHeaderAntd, Layout } from 'antd';

function itemRender(route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1;

  if (route.breadcrumbName === 'Home') {
    return (
      <Link to="/">
        <HomeOutlined />
      </Link>
    );
  }

  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
  );
}

export function PageHeader({
  title = '',
  subTitle = '',
  actions = [],
  breadcrumb = [],
  ...props
}) {
  return (
    <PageHeaderAntd
      title={title}
      subTitle={subTitle}
      extra={actions}
      breadcrumb={{
        routes: [
          {
            path: '/',
            breadcrumbName: 'Home',
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
}

export function PageContent({ children }) {
  return (
    <Layout.Content style={{ margin: `24px 24px 0` }}>
      {children}
    </Layout.Content>
  );
}
