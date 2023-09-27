import { ResponseError } from '../../../../error.js';
import { UserNotFoundError } from '../../user-errors.js';
import { AuthorizationToken } from '../authorization-token.js';

export class AuthenticateAsUseCase {
  #userRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#userRepo = repository.user;
  }

  async execute({ tenant, userId }) {
    const user = await this.#userRepo.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ResponseError(400, new UserNotFoundError(userId));
    }

    return {
      token: await AuthorizationToken.generateToken({ tenant, userId }),
      tokenType: 'Bearer',
    };
  }
}
