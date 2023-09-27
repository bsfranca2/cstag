import { ResponseError } from '../../error.js';

export class UserNotFoundError extends ResponseError {
  constructor(user) {
    super(404, `Usuário não encontrado: ${user}`);
  }
}

export class UserAlreadyExistsError extends ResponseError {
  constructor(username) {
    super(400, `Usuário já existe: ${username}`);
  }
}

export class PasswordMismatchError extends ResponseError {
  constructor() {
    super(400, 'Senhas não conferem');
  }
}

export class CompanyIdIsRequiredError extends ResponseError {
  constructor() {
    super(400, 'CompanyId é obrigatório para usuário com perfil de usuário');
  }
}

export class TokenExpiredError extends ResponseError {
  constructor() {
    super(400, 'Token expirado');
  }
}

export class InsecurePasswordError extends ResponseError {
  constructor() {
    super(400, 'InsecurePasswordError');
  }
}
