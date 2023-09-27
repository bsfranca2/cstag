import React from 'react';
import { Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import TollRoad from '../components/Icons/TollRoad';

const adminItems = [
  {
    icon: <UserOutlined style={{ fontSize: 16 }} />,
    label: 'Acessos',
    path: '/acessos',
  },
  {
    icon: <TollRoad style={{ fontSize: 16 }} />,
    label: 'Praças',
    path: '/pracas',
  },
];

const clientItems = [
  {
    label: 'Passagem pedágio',
    path: '/passagens-pedagio',
  },
  {
    label: 'Vale-pedágio',
    path: '/vale-pedagio',
  },
  {
    label: 'Faturas',
    path: '/faturas',
  },
  {
    label: 'Veículos',
    path: '/veiculos',
  },
  {
    label: 'Carretas',
    path: '/carretas',
  },
  {
    label: 'Mensalidades',
    path: '/mensalidades',
  },
];

export default ({ role, navigate }) => {
  let list = [];
  if (role === 'Admin') list = adminItems;
  else if (role === 'Client') list = clientItems;

  const history = useHistory();
  const selectedItem = list.find((i) => i.path === history.location.pathname);
  const selectedKeys = selectedItem ? [selectedItem.path] : [];

  return (
    <Menu theme='dark' mode='inline' selectedKeys={selectedKeys}>
      {list.map(({ path, icon, label }) => (
        <Menu.Item key={path} icon={icon} onClick={() => navigate(path)}>
          {label}
        </Menu.Item>
      ))}
    </Menu>
  );
};
