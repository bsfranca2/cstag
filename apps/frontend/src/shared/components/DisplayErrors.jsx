import { Alert, Form } from 'antd';

export default function DisplayErrors({ isError, error }) {
  if (!isError) {
    return;
  }

  let errorMessage;
  if (error.response?.status >= 500) {
    const requestId = error.response.headers['x-request-id'] || null;
    errorMessage = [
      `Ocorreu um erro interno no servidor.`,
      `Para saber mais passe o id de requisicao ${requestId} para o suporte.`,
    ].join(' ');
  } else if (error.response?.data?.errors) {
    errorMessage = error.response.data.errors[0].message;
  } else {
    errorMessage = error.message;
  }

  return (
    <Form.Item>
      <Alert message={errorMessage} type="error" />
    </Form.Item>
  );
}
