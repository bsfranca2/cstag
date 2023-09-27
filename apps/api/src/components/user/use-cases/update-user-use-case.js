import { UserNotFoundError } from '../user-errors.js';
import { createPassword } from '../user-password.js';

export class UpdateUserUseCase {
  #userRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#userRepo = repository.user;
  }

  async execute({ userId, password, ...data }) {
    const where = { id: userId };
    if (!(await this.#userRepo.findUnique({ where }))) {
      throw new UserNotFoundError(userId);
    }

    await this.#userRepo.update({
      where,
      data: {
        ...data,
        security: password
          ? {
              update: {
                password: createPassword(password),
                resetToken: null,
                resetIssuedAt: null,
              },
            }
          : undefined,
      },
    });
  }
}
