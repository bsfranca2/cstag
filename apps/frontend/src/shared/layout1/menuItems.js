import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import TollRoadIcon from '../components/TollRoadIcon';
import CompanyIcon from '../components/CompanyIcon';
import { Admin } from '../../users/userRole';

export function getMenuItems({ role }) {
  const adminItems = [
    {
      icon: <HomeOutlined />,
      name: 'Inicio',
      path: '/admin',
    },
    {
      icon: <UserOutlined />,
      name: 'Usuários',
      path: '/admin/usuarios',
    },
    {
      icon: <CompanyIcon />,
      name: 'Empresas',
      path: '/admin/empresas',
    },
    {
      icon: <TollRoadIcon />,
      name: 'Praças',
      path: '/admin/pracas',
    },
  ];

  const clientItems = [
    {
      name: 'Dashboard',
      path: '/transportadora',
      exact: true,
    },
    {
      name: 'Passagem pedágio',
      path: '/transportadora/passagens-pedagio',
    },
    {
      name: 'Vale-pedágio',
      path: '/transportadora/vale-pedagio',
    },
    {
      name: 'Faturas',
      path: '/transportadora/faturas',
    },
    {
      name: 'Veículos',
      path: '/transportadora/veiculos',
    },
    {
      name: 'Carretas',
      path: '/transportadora/carretas',
    },
    {
      name: 'Mensalidades',
      path: '/transportadora/mensalidades',
    },
  ];

  return role.isEqual(Admin) ? adminItems : clientItems;
}
