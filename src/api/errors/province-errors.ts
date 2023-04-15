import { CustomError } from '../helpers/custom-error';

const MESSAGE_PROVINCE_ALREADY_EXISTS = 'Esta província já está cadastrada!';
const MESSAGE_PROVINCE_INVALID = 'A província informada é inválida!';
const MESSAGE_PROVINCE_NOT_FOUND = 'Não foi possível encontrar esta província!';
const MESSAGE_INVALID_LENGTH_SHORT_NAME = 'O atributo short_name da província deve conter apenas 2 caracteres!';

export const ERR_PROVINCE_ALREADY_EXISTS = CustomError('_', MESSAGE_PROVINCE_ALREADY_EXISTS, 400);
export const ERR_INVALID_PROVINCE = CustomError('_', MESSAGE_PROVINCE_INVALID, 400);
export const ERR_PROVINCE_NOT_FOUND = CustomError('_', MESSAGE_PROVINCE_NOT_FOUND, 400);
export const ERR_INVALID_LENGTH_SHORT_NAME = CustomError('_', MESSAGE_INVALID_LENGTH_SHORT_NAME, 400);
