import { CustomError } from '../helpers/custom-error';

const PROPERTY_NOT_FOUND = 'Não foi possível encontrar a propriedade informada!';
const PROPERTY_ALREADY_EXISTS = 'Esta propriedade já está cadastrada!';
const PROPERTY_CANNOT_BE_EXCLUDE = 'Essa propriedade não pode ser excluída!';

export const ERR_PROPERTY_NOT_FOUND = CustomError('_', PROPERTY_NOT_FOUND, 400);
export const ERR_PROPERTY_ALREADY_EXISTS = CustomError('_', PROPERTY_ALREADY_EXISTS, 400);
export const ERR_PROPERTY_CANNOT_BE_EXCLUDE = CustomError('_', PROPERTY_CANNOT_BE_EXCLUDE, 401);
