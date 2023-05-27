import { CustomError } from '../helpers/custom-error';

const PROPERTY_NOT_FOUND = 'Não foi possível encontrar a propriedade informada!';

export const ERR_PROPERTY_NOT_FOUND = CustomError('_', PROPERTY_NOT_FOUND, 400);
