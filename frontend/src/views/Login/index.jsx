import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Container, Form, InputGroup, Title } from './style';
import { useAuthContext } from '../../contexts/AuthContext';

export default function Login() {
  const { handleLogin } = useAuthContext();
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  return (
    <Container>
      <img
        src='/img/logo-light.webp'
        alt='CStag logo'
        style={{ height: 128, marginBottom: 24 }}
      />
      <Form>
        <InputGroup>
          <Title>Painel</Title>
          <Input
            size='large'
            placeholder='Usuário'
            value={form.username}
            onChange={(e) => {
              setForm({ ...form, username: e.target.value });
            }}
          />
        </InputGroup>
        <InputGroup>
          <Input.Password
            size='large'
            placeholder='Senha'
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
            }}
          />
        </InputGroup>
        <InputGroup>
          <Button
            type='primary'
            size='large'
            block
            onClick={() => handleLogin(form.username, form.password)}
          >
            Entrar
          </Button>
        </InputGroup>
      </Form>
    </Container>
  );
}
