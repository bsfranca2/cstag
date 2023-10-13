import { BadRequestError } from '~/shared/errors';
import { prisma } from '~/shared/prisma';
import { userCacheService } from '~/users';

import { SignInDto } from './sign-in.schema';
import type { JwtSignFn } from '..';

export const signIn = async (dto: SignInDto, jwtSign: JwtSignFn) => {
  const user = await userCacheService.findByUnique({ email: dto.email });
  if (!user) {
    await Bun.sleep(100);
    throw new BadRequestError('Credenciais inválidas');
  }
  const userPassword = await prisma.user.findFirst({
    select: {
      password: true,
    },
    where: {
      id: user.id,
    },
  });
  if (!userPassword) {
    throw new BadRequestError('Credenciais inválidas');
  }
  const isSamePassword = await Bun.password.verify(dto.password, userPassword.password);
  if (!isSamePassword) {
    throw new BadRequestError('Credenciais inválidas');
  }
  const lastLoggedInCompany = user.companies.reduce((lastLoggedInCompany, company) => {
    if (!company.activeAt) return lastLoggedInCompany;
    if (!lastLoggedInCompany.activeAt) return company;
    return lastLoggedInCompany.activeAt >= company.activeAt ? lastLoggedInCompany : company;
  }, user.companies[0]);
  const lastLoggedInCompanyId = user.companies.length ? lastLoggedInCompany.company.id : undefined;
  if (lastLoggedInCompanyId) {
    await prisma.usersOnCompany.update({
      data: {
        activeAt: new Date(),
      },
      where: {
        companyId_userId: {
          companyId: lastLoggedInCompanyId,
          userId: user.id,
        },
      },
      select: {
        createdAt: true,
      },
    });
  }
  await userCacheService.invalidate(user.id);
  const payload: Record<string, string> = {
    sub: user.id.toString(),
  };
  if (lastLoggedInCompanyId) {
    payload.aud = lastLoggedInCompanyId.toString();
  }
  const token = await jwtSign(payload);
  const tokenType = 'Bearer';
  return { token, tokenType };
};
