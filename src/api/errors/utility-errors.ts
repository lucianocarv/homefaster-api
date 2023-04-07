import { CustomError } from '../helpers/custom-error';

const MESSAGE_UTILITY_ALREADY_EXISTS = 'Essa utilidade já existe!';

export const ERR_UTILITY_ALREADY_EXISTS = CustomError('_', MESSAGE_UTILITY_ALREADY_EXISTS, 400);
