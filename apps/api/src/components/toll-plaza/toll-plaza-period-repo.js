import {prisma} from '@cstag/db';
import assignIn from 'lodash.assignin';

/**
 * @desc Query para duplicar todos os itens de um periodo para outro periodo
 * @param {string} tollPlazaPeriodIdFrom
 * @param {string} tollPlazaPeriodIdTo
 * @returns {import("@prisma/client").Prisma.Sql}
 */
export const duplicateTollPlazas = (
  tollPlazaPeriodIdFrom,
  tollPlazaPeriodIdTo
) =>
  prisma.$executeRaw`INSERT INTO
  tb_toll_plaza("associate_company", "highway", "km", "category", "value", "full_road_name", "metadata", "id_toll_plaza_period")
  SELECT "associate_company", "highway", "km", "category", "value", "full_road_name", "metadata", ${tollPlazaPeriodIdTo} as "id_toll_plaza_period"
  FROM tb_toll_plaza WHERE id_toll_plaza_period = ${tollPlazaPeriodIdFrom}`;

/** @param {import("@prisma/client").PrismaClient} prismaRepository */
export const composeTollPlazaPeriodRepo = (prismaRepository) => {
  const repository = {
    /**
     * @desc Duplicar todos itens de um periodo para outro periodo
     * @param {string} idFrom tollPlazaPeriodIdFrom
     * @param {string} idTo tollPlazaPeriodIdTo
     * @returns {Promise<void>}
     */
    duplicateTollPlazas: async (idFrom, idTo) => {
      await prismaRepository.$queryRaw(duplicateTollPlazas(idFrom, idTo));
    },
  };
  return assignIn(repository, prismaRepository.tollPlazaPeriod);
};
