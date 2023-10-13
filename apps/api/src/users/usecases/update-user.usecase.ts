import { BadRequestError } from '~/shared/errors';
import { prisma } from '~/shared/prisma';

import { userCacheService } from '../user-cache.service';
import type { UpdateUserDto } from './update-user.schema';

export const updateUser = async (dto: UpdateUserDto) => {
  const { userId, ...userData } = dto;
  const user = await prisma.user.findFirst({
    select: {
      email: true,
    },
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new BadRequestError('Usuário não encontrado');
  }
  if (!Object.keys(userData).length) {
    throw new BadRequestError('Informe algum campo para atualizar');
  }
  if ('email' in userData && userData.email !== user.email) {
    const emailExists = await prisma.user.findFirst({
      select: {
        id: true,
      },
      where: {
        email: userData.email,
      },
    });
    if (emailExists) {
      throw new BadRequestError('Email em uso');
    }
  }
  const userUpdated = await prisma.user.update({
    data: userData,
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await userCacheService.invalidate(userUpdated.id);
  return userUpdated;
};
