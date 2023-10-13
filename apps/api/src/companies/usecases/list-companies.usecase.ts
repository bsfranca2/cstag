import { prisma } from '~/shared/prisma';

export const listCompanies = async () => {
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      cnpj: true,
      headquarter: {
        select: {
          name: true,
          cnpj: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  return companies;
};
