import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../layout/index';

export default function Registries() {
  const { id } = useParams();
  return (
    <Layout
      header={{
        title: `Praça #${id}`,
        subTitle: 'Detalhes da praça',
      }}
      breadcrumb={[
        { path: '/pracas', breadcrumbName: 'Praças' },
        { path: `/pracas/${id}`, breadcrumbName: `#${id}` },
      ]}
    />
  );
}
