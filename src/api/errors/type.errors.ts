import { CustomError } from '../helpers/custom-error';

const TYPE_NOT_EXISTS = 'Não foi possível encontrar o registro informado!';
const TYPE_ALREADY_EXISTS = 'Este tipo de propriedade já está cadastrado!';

export const ERR_TYPE_NOT_EXISTS = CustomError('_', TYPE_NOT_EXISTS, 400);
export const ERR_TYPE_ALREADY_EXISTS = CustomError('_', TYPE_ALREADY_EXISTS, 400);
