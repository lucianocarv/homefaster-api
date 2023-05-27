import { CustomError } from '../helpers/custom-error';

const PERMISSION_DENIED = 'Você não tem permissão para acessar este recurso!';
const NEED_LOGIN = 'Faça login para acessar estes recursos!';

export const ERR_NEED_LOGIN = CustomError('_', NEED_LOGIN, 401);
export const ERR_PERMISSION_DENIED = CustomError('_', PERMISSION_DENIED, 401);
