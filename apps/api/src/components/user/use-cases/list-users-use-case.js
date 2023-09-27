export class ListUsersUseCase {
  #userRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#userRepo = repository.user;
  }

  async execute() {
    return await this.#userRepo.findMany({
      include: {
        company: {
          include: {
            headquarter: true,
          },
        },
      },
      orderBy: [{ role: 'asc' }, { company: { name: 'asc' } }],
    });
  }
}
