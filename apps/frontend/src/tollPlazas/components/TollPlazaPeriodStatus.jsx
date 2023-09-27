import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';

export const TollPlazaPeriodStatus = ({ value }) => {
  switch (value) {
    case 'PENDING':
      return (
        <Tag icon={<ClockCircleOutlined />} color="default">
          Pendente
        </Tag>
      );
    case 'UNDER_IMPLEMENTATION':
      return (
        <Tag icon={<SyncOutlined spin />} color="processing">
          Importando
        </Tag>
      );
    case 'DONE':
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Importado
        </Tag>
      );
    case 'ERROR':
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Falhou
        </Tag>
      );
    default:
      return <Tag>{value}</Tag>;
  }
};
