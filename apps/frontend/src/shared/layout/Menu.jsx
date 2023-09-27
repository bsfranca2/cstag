import { Menu as MenuAntd } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Admin } from '../../users/userRole';
import TollRoadIcon from '../../shared/components/TollRoadIcon';
import CompanyIcon from '../../shared/components/CompanyIcon';

const adminItems = [
  {
    icon: <HomeOutlined style={{ fontSize: 16 }} />,
    label: 'Inicio',
    path: '/admin',
  },
  {
    icon: <UserOutlined style={{ fontSize: 16 }} />,
    label: 'Usuários',
    path: '/admin/usuarios',
  },
  {
    icon: <CompanyIcon style={{ fontSize: 16 }} />,
    label: 'Empresas',
    path: '/admin/empresas',
  },
  {
    icon: <TollRoadIcon style={{ fontSize: 16 }} />,
    label: 'Praças',
    path: '/admin/pracas',
  },
];

const clientItems = [
  {
    label: 'Dashboard',
    path: '/transportadora',
  },
  {
    label: 'Passagem pedágio',
    path: '/transportadora/passagens-pedagio',
  },
  {
    label: 'Vale-pedágio',
    path: '/transportadora/vale-pedagio',
  },
  {
    label: 'Faturas',
    path: '/transportadora/faturas',
  },
  {
    label: 'Veículos',
    path: '/transportadora/veiculos',
  },
  {
    label: 'Carretas',
    path: '/transportadora/carretas',
  },
  {
    label: 'Mensalidades',
    path: '/transportadora/mensalidades',
  },
];

function Menu({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const list = role.isEqual(Admin) ? adminItems : clientItems;
  const selectedItem = list.find((i) => i.path === location.pathname);
  const selectedKeys = selectedItem ? [selectedItem.path] : [];

  return (
    <MenuAntd theme="dark" mode="inline" selectedKeys={selectedKeys}>
      {list.map(({ path, icon, label }) => (
        <MenuAntd.Item key={path} icon={icon} onClick={() => navigate(path)}>
          {label}
        </MenuAntd.Item>
      ))}
    </MenuAntd>
  );
}

export default Menu;
