import { message } from 'antd';
import { useMutation, useQuery } from 'react-query';
import { fetchInvoices, importInvoice, deleteInvoice } from './invoiceApi';
import { queryClient } from '../shared/queryClient';

export function useInvoices() {
  return useQuery('invoices', fetchInvoices, { refetchOnWindowFocus: true });
}

export function useInvoicesWithLocalFilter(term) {
  const invoices = useInvoices();

  const data = (invoices.data || []).filter((invoice) =>
    term ? invoice.identifier.includes(term) : true
  );

  return { ...invoices, data };
}

export function useImportInvoice() {
  return useMutation(
    ({ sheet, operatorCompany }) => {
      const formData = new FormData();
      formData.append('sheet', sheet.file);
      formData.append('operatorCompany', operatorCompany);
      return importInvoice(formData);
    },
    {
      onSuccess: () => {
        message.success('Fatura enviada com sucesso');
        queryClient.invalidateQueries('invoices');
      },
    }
  );
}

export function useDeleteInvoice() {
  return useMutation(deleteInvoice, {
    onSuccess: () => {
      message.success('Fatura excluída com sucesso');
      queryClient.invalidateQueries('invoices');
    },
  });
}
