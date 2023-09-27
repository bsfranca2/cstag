import { message } from 'antd';
import { useMutation, useQuery } from 'react-query';
import { createCompany, fetchCompanies } from './companiesApi';
import { queryClient } from '../shared/queryClient';

export function useCompanies() {
  return useQuery('users', fetchCompanies);
}

export function useCompaniesWithLocalFilter(term) {
  const companies = useCompanies();

  const data = (companies.data || []).filter((company) => {
    const textToSearch = [
      company.name,
      company.cnpj,
      company.headquarter?.name,
      company.headquarter?.cnpj,
    ]
      .filter(Boolean)
      .join(' ');
    return textToSearch.toLowerCase().includes((term || '').toLowerCase());
  });

  return { ...companies, data };
}

export function useCreateCompany() {
  return useMutation(createCompany, {
    onSuccess: () => {
      message.success('Empresa criado com sucesso');
      queryClient.invalidateQueries('users');
    },
  });
}
