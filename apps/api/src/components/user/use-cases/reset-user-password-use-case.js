import { TokenExpiredError, UserNotFoundError } from '../user-errors.js';
import { createPassword } from '../user-password.js';

const TWO_HOUR = 1000 * 60 * 60 * 2;

export class ResetUserPasswordUseCase {
  #userRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#userRepo = repository.user;
  }

  async execute({ token, userId, newPassword }) {
    const user = await this.#userRepo.findUnique({
      where: { id: userId },
      include: { security: true },
    });
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    console.log(token, userId, newPassword);

    const { resetToken, resetIssuedAt } = user.security;
    const now = new Date();
    if (
      !(
        resetToken &&
        resetIssuedAt &&
        resetToken === token &&
        now.getTime() - resetIssuedAt.getTime() < TWO_HOUR
      )
    ) {
      throw new TokenExpiredError();
    }

    await this.#userRepo.update({
      where: { id: userId },
      data: {
        security: {
          update: {
            password: createPassword(newPassword),
            resetToken: null,
            resetIssuedAt: null,
          },
        },
      },
    });
  }
}
