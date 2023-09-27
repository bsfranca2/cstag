import { ResponseError } from '../../error.js';

export class TollPlazaPeriodNotFoundError extends ResponseError {
  constructor(id) {
    super(404, `Periodo de praça não encontrado: ${id}`);
  }
}
