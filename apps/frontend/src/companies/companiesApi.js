import { request } from '../shared/request';

export const fetchCompanies = () =>
  request('/companies').then((res) => res.data);

export const fetchHeadquarters = () =>
  request('/companies/headquarters').then((res) => res.data);

export const createCompany = (values) =>
  request.post('/companies', values).then((res) => res.data);
