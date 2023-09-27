import { Button, Form, Input } from 'antd';
import { Container, FormContainer, Logo } from './style';
import { access as rules } from '../../utils/rules';
import useResetPassword from '../../hooks/useResetPassword';

export default function ResetPassword() {
  const { resetPassword } = useResetPassword();

  const [form] = Form.useForm();
  const initialValues = {
    password: '',
    confirmPassword: '',
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
          onFinish={resetPassword}
        >
          <Form.Item label="Senha" name="password" rules={rules.password}>
            <Input.Password id="new-password" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="Confirmar Senha"
            name="confirmPassword"
            rules={rules.confirmPassword}
          >
            <Input.Password id="confirm-password" autoComplete="off" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" size="large" block>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>
    </Container>
  );
}
