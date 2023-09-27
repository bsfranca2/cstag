import { Layout } from 'antd';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      CStag ©{currentYear}. Um produto de{' '}
      <a
        href="https://www.consultsolucoes.com.br/"
        rel="noreferrer"
        target="_blank"
      >
        Consult Soluções
      </a>
    </Layout.Footer>
  );
}
