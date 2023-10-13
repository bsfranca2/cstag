import { BadRequestError } from '~/shared/errors';
import { prisma } from '~/shared/prisma';

import { userCacheService } from '../user-cache.service';

export type DeleteUserCompanyDto = {
  userId: number;
  companyId: number;
};

export const deleteUserCompany = async (dto: DeleteUserCompanyDto) => {
  const userOnCompany = await prisma.usersOnCompany.findFirst({
    select: {
      createdAt: true,
    },
    where: dto,
  });
  if (!userOnCompany) {
    throw new BadRequestError('Vinculo nao encontrado');
  }
  await prisma.usersOnCompany.delete({
    where: {
      companyId_userId: {
        companyId: dto.companyId,
        userId: dto.userId,
      },
    },
  });
  await userCacheService.invalidate(dto.userId);
};
