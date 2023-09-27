import omit from 'lodash.omit';

const formatHeadquarter = (headquarter) =>
  omit(headquarter, ['idCompany', 'idHeadquarter']);

export const toCompanyDTO = (company) => ({
  ...omit(company, ['idCompany', 'idHeadquarter']),
  headquarter: company.idHeadquarter
    ? formatHeadquarter(company.headquarter)
    : undefined,
});
