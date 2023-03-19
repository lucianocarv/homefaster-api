import { CustomError } from '../helpers/custom-error';

// Messages
const PERMISSION_DENIED = 'Você não tem permissão para acessar este recurso!';
const NEED_LOGIN = 'Faça login para acessar estes recursos!';
// Missing DATA
const MISSING_ATTRIBUTES_ALL = 'Insira pelo menos um atributo a ser atualizado!';
const MISSING_FILE = 'Insira uma arquivo para fazer upload!';

// Static Messages
export const ERR_NEED_LOGIN = CustomError('_', NEED_LOGIN, 401);
export const ERR_PERMISSION_DENIED = CustomError('_', PERMISSION_DENIED, 401);
export const ERR_MISSING_ATTRIBUTES = CustomError('_', MISSING_ATTRIBUTES_ALL, 400);
export const ERR_MISSING_FILE = CustomError('_', MISSING_FILE, 400);

// Dinamic Messages
export const ERR_MISSING_ID = (text: string, verb: string) => CustomError('_', `Insira um(a) ${text} que será ${verb}!`, 400);
export const ERR_MISSING_ATTRIBUTE = (attr: string, to: string) => CustomError('_', `Insira o(a) ${attr} da(o) ${to}`, 400);
