import omit from 'lodash.omit';

const formatCompany = (company) => ({
  ...omit(company, ['idCompany', 'idHeadquarter']),
  headquarter: company.headquarter
    ? omit(company.headquarter, ['idCompany', 'idHeadquarter'])
    : undefined,
});

export const toUserDto = (user) => ({
  ...omit(user, ['idUser', 'idCompany']),
  company: user.company ? formatCompany(user.company) : undefined,
});
