import { t } from 'elysia';
import type { Static } from '@sinclair/typebox';

export const importTollPlazaSheetSchema = t.Object({
  sheet: t.File({ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
  startAt: t.Date(),
  endAt: t.Date(),
  description: t.Optional(t.String()),
});

export type ImportTollPlazaSheetDto = Omit<Static<typeof importTollPlazaSheetSchema>, 'sheet'> & {
  sheetPath: string;
};
