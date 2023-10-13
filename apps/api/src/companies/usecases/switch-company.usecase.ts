import { type JwtSignFn } from '~/auth';
import { BadRequestError } from '~/shared/errors';
import { prisma } from '~/shared/prisma';

interface SwitchCompanyDto {
  userId: number;
  companyId: number;
}

export const switchCompany = async (dto: SwitchCompanyDto, jwtSign: JwtSignFn) => {
  const user = await prisma.user.findFirst({
    where: {
      id: dto.userId,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    throw new BadRequestError('Usuário não encontrado');
  }
  const company = await prisma.company.findFirst({
    where: {
      id: dto.companyId,
    },
    select: {
      id: true,
    },
  });
  if (!company) {
    throw new BadRequestError('Empresa não encontrada');
  }
  const userCompany = await prisma.usersOnCompany.findMany({
    select: {
      companyId: true,
    },
    where: dto,
  });
  if (!userCompany) {
    throw new BadRequestError('Você não tem autorização para acessar este recurso!');
  }
  await prisma.usersOnCompany.update({
    data: {
      activeAt: new Date(),
    },
    where: {
      companyId_userId: dto,
    },
  });
  const payload = { sub: user.id.toString(), aud: company.id.toString() };
  const token = await jwtSign(payload);
  const tokenType = 'Bearer';
  return { token, tokenType };
};
