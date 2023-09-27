import { PageContainer } from '@ant-design/pro-layout';
import { Button, Descriptions, Skeleton, Space, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { useTollPlazaPeriod } from '../../useTollPlazas';
import { TollPlazaPeriodStatus } from '../../components/TollPlazaPeriodStatus';
import { useEditTollPlazaPeriod } from '../../components/EditTollPlazaPeriod';
import { useDuplicateTollPlazaPeriod } from '../../components/DuplicateTollPlazaPeriod';
import { CreateTollPlaza } from '../../components/CreateTollPlaza';
import TollPlazasTable from '../../components/TollPlazasTable';

export default function TollPlazaPeriodDetails() {
  const { id } = useParams();
  const { data, isLoading } = useTollPlazaPeriod(id);

  const editTollPlazaPeriod = useEditTollPlazaPeriod();
  const duplicateTollPlazaPeriod = useDuplicateTollPlazaPeriod();

  return (
    <PageContainer
      title="Detalhes do período da praças"
      subTitle="Gerenciar valores das praças"
      content={
        <Skeleton loading={isLoading}>
          <Descriptions>
            <Descriptions.Item label="Periodo">
              {data && new Date(data.startAt).toLocaleDateString('pt-BR')}
              {' - '}
              {data && new Date(data.endAt).toLocaleDateString('pt-BR')}
            </Descriptions.Item>
            <Descriptions.Item label="Descricao" span={2}>
              {data && data.description}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {data && <TollPlazaPeriodStatus value={data.status} />}
            </Descriptions.Item>
            <Descriptions.Item label="Ativo">
              {data && data.inactived ? (
                <Tag color="red">Inativo</Tag>
              ) : (
                <Tag color="green">Ativo</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Criado em">
              {data && new Date(data.createdAt).toLocaleString('pt-BR')}
            </Descriptions.Item>
          </Descriptions>
        </Skeleton>
      }
      extra={
        <Space>
          <Button onClick={() => duplicateTollPlazaPeriod.openModal(data)}>
            Duplicar
          </Button>
          <Button onClick={() => editTollPlazaPeriod.openModal(data)}>
            Editar
          </Button>
          <CreateTollPlaza tollPlazaPeriodId={id} />
        </Space>
      }
    >
      <TollPlazasTable tollPlazaPeriodId={id} />
      {editTollPlazaPeriod.modalForm}
      {duplicateTollPlazaPeriod.modalForm}
    </PageContainer>
  );
}
