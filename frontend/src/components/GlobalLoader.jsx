import React from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Container = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function GlobalLoading() {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <Container>
      <Spin tip='Carregando...' indicator={antIcon} />
    </Container>
  );
}
