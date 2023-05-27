import { CustomError } from '../helpers/custom-error';

const FAVORITE_ALREADY_EXISTS = 'Esta propriedade já está nos seus favoritos!';
const FAVORITE_NOT_EXISTS = 'Não foi possível encontrar o favorito informado!';

export const ERR_FAVORITE_ALREADY_EXISTS = CustomError('_', FAVORITE_ALREADY_EXISTS, 400);
export const ERR_FAVORITE_NOT_EXISTS = CustomError('_', FAVORITE_NOT_EXISTS, 400);
