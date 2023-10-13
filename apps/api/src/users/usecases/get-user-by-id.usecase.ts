import { BadRequestError } from '~/shared/errors';
import { prisma } from '~/shared/prisma';

interface GetUserByIdDto {
  userId: number;
}

export const getUserById = async (dto: GetUserByIdDto) => {
  const user = await prisma.user.findFirst({
    where: {
      id: dto.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      companies: {
        select: {
          activeAt: true,
          company: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new BadRequestError('Usuário não encontrado');
  }
  return user;
};
