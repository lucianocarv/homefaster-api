import { CustomError } from '../helpers/custom-error';

const MESSAGE_CITY_ALREADY_EXISTS = 'Esta cidade já está cadastrada!';
const MESSAGE_CITY_INVALID = 'A cidade informada é inválida!';
const MESSAGE_CITY_NOT_FOUND = 'Não foi possível encontrar esta cidade!';

export const ERR_CITY_ALREADY_EXISTS = CustomError('_', MESSAGE_CITY_ALREADY_EXISTS, 400);
export const ERR_INVALID_CITY = CustomError('_', MESSAGE_CITY_INVALID, 400);
export const ERR_CITY_NOT_FOUND = CustomError('_', MESSAGE_CITY_NOT_FOUND, 400);
