import {
  CompanyIdIsRequiredError,
  UserAlreadyExistsError,
} from '../user-errors.js';
import { createPassword } from '../user-password.js';
import { User } from '../user-roles.js';

export class CreateUserUseCase {
  #userRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#userRepo = repository.user;
  }

  async execute({ username, password, role, companyId }) {
    if (await this.#userRepo.count({ where: { username } })) {
      throw new UserAlreadyExistsError(username);
    }

    if (role === User && !companyId) {
      throw new CompanyIdIsRequiredError();
    }

    await this.#userRepo.create({
      data: {
        username,
        role,
        security: {
          create: {
            password: createPassword(password),
          },
        },
        company: companyId
          ? {
              connect: {
                id: companyId,
              },
            }
          : undefined,
      },
    });
  }
}
