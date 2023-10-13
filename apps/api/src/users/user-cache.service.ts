import { userCache } from '~/shared/cache';
import { prisma } from '~/shared/prisma';

type FindByUnique = { id: number } | { email: string };

class UserCacheService {
  async findByUnique(options: FindByUnique) {
    const userCached = await this.getUserFromCache(options);
    if (userCached) {
      return userCached;
    }

    const user = await this.getUserFromDb(options);
    if (!user) {
      return null;
    }
    await userCache.setItem(user.id.toString(), user);
    await userCache.setItem(user.email, user.id.toString());
    return user;
  }

  async invalidate(userId: number) {
    await userCache.removeItem(userId.toString());
  }

  private async getUserFromDb(options: FindByUnique) {
    return await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        companies: {
          select: {
            activeAt: true,
            company: {
              select: {
                id: true,
                name: true,
                cnpj: true,
              },
            },
          },
        },
      },
      where: 'id' in options ? { id: options.id } : { email: options.email },
    });
  }

  private async getUserFromCache(options: FindByUnique) {
    const checkForId = 'email' in options ? await userCache.getItem(options.email) : options.id;
    const userExists = checkForId ? await userCache.getItem(checkForId.toString()) : null;
    if (!userExists || typeof userExists !== 'object') return null;
    return userExists;
  }
}

export const userCacheService = new UserCacheService();
