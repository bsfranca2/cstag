import { Button, Form, Input } from 'antd';
import { Container, FormContainer, Logo } from './style';
import { useAuthContext } from '../../useAuthContext';
import formRules from './formRules';

export default function Login() {
  const { handleLogin } = useAuthContext();

  const [form] = Form.useForm();
  const initialValues = {
    tenant: '',
    username: '',
    password: '',
  };

  return (
    <Container>
      <Logo />
      <FormContainer>
        <Form
          form={form}
          initialValues={initialValues}
          layout="vertical"
          requiredMark={false}
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item name="tenant" label="Tenant" rules={formRules.tenant}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Usuário" rules={formRules.username}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Senha" rules={formRules.password}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" size="large" block>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>
    </Container>
  );
}
