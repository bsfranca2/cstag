import { PageContainer } from '@ant-design/pro-layout';
import { ImportInvoiceSheet } from '../../components/ImportInvoiceSheet';
import InvoicesTable from '../../components/InvoicesTable';

export default function Invoices() {
  return (
    <PageContainer
      title="Faturas"
      subTitle="Gerencias faturas das operadoras"
      extra={<ImportInvoiceSheet />}
    >
      <InvoicesTable />
    </PageContainer>
  );
}
