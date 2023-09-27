import crypto from 'node:crypto';
import { UserNotFoundError } from '../user-errors.js';

export class GenerateUserResetPasswordTokenUseCase {
  #userRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#userRepo = repository.user;
  }

  async execute({ userId }) {
    const where = { id: userId };
    if (!(await this.#userRepo.findUnique({ where }))) {
      throw new UserNotFoundError(userId);
    }

    const resetToken = crypto.randomUUID();
    await this.#userRepo.update({
      where,
      data: {
        security: {
          update: {
            resetToken,
            resetIssuedAt: new Date(),
          },
        },
      },
    });
    return { resetToken };
  }
}
