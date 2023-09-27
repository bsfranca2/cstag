import { ResponseError } from '../../../../error.js';
import { UserNotFoundError, PasswordMismatchError } from '../../user-errors.js';
import { comparePassword } from '../../user-password.js';
import { AuthorizationToken } from '../authorization-token.js';

export class AuthenticateUseCase {
  #userRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#userRepo = repository.user;
  }

  async execute({ tenant, username, password }) {
    const user = await this.#userRepo.findUnique({
      where: { username },
      include: { security: true },
    });
    if (!user) {
      throw new ResponseError(
        400,
        'Credencias inválidas',
        new UserNotFoundError(username)
      );
    }

    const isSamePassword = comparePassword(password, user.security.password)
    if (!isSamePassword) {
      throw new ResponseError(
        400,
        'Credencias inválidas',
        new PasswordMismatchError()
      );
    }

    return {
      token: await AuthorizationToken.generateToken({
        tenant,
        userId: user.id,
      }),
      tokenType: 'Bearer',
    };
  }
}
