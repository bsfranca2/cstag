import { BadRequestError } from '~/shared/errors';
import { prisma } from '~/shared/prisma';

import { userCacheService } from '../user-cache.service';
import type { CreateUserCompanyDto } from './create-user-company.schema';

export const createUserCompany = async (dto: CreateUserCompanyDto) => {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
    },
    where: {
      id: dto.userId,
    },
  });
  if (!user) {
    throw new BadRequestError('Usuário não encontrado');
  }
  const company = await prisma.company.findFirst({
    select: {
      id: true,
    },
    where: {
      id: dto.companyId,
    },
  });
  if (!company) {
    throw new BadRequestError('Empresa não encontrada');
  }
  const userOnCompanyExists = await prisma.usersOnCompany.findFirst({
    select: {
      createdAt: true,
    },
    where: dto,
  });
  if (userOnCompanyExists) {
    throw new BadRequestError('Usuário já está associado à empresa');
  }
  const userOnCompany = await prisma.usersOnCompany.create({
    data: dto,
  });
  await userCacheService.invalidate(user.id);
  return userOnCompany;
};
