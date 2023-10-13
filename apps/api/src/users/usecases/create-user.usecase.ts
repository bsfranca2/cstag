import { BadRequestError } from '~/shared/errors';
import { prisma } from '~/shared/prisma';

import type { CreateUserDto } from './create-user.schema';

export const createUser = async (dto: CreateUserDto) => {
  const encryptedPassword = await Bun.password.hash(dto.password, 'bcrypt');
  const emailExists = await prisma.user.findFirst({
    select: {
      id: true,
    },
    where: {
      email: dto.email,
    },
  });
  if (emailExists) {
    throw new BadRequestError('Email em uso');
  }
  const user = await prisma.user.create({
    data: {
      ...dto,
      password: encryptedPassword,
    },
    select: {
      id: true,
    },
  });
  return user;
};
