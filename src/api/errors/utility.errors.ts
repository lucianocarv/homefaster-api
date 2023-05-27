import { CustomError } from '../helpers/custom-error';

const MESSAGE_UTILITY_ALREADY_EXISTS = 'Essa utilidade já existe!';
const MESSAGE_UTILITY_UPDATE_FAILED = 'Não foi possível atualizar as utilidades!';

export const ERR_UTILITY_ALREADY_EXISTS = CustomError('_', MESSAGE_UTILITY_ALREADY_EXISTS, 400);
export const ERR_UTILITY_UPDATE_FAILED = CustomError('_', MESSAGE_UTILITY_UPDATE_FAILED, 400);
