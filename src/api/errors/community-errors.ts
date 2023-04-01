import { CustomError } from '../helpers/custom-error';

const COMMUNITY_ALREADY_EXISTS = 'Esta comunidade já está cadastrada!';
const COMMUNITY_INVALID = 'A comunidade informada é inválida!';

export const ERR_COMMUNITY_ALREADY_EXISTS = CustomError('_', COMMUNITY_ALREADY_EXISTS, 400);
export const ERR_COMMUNITY_INVALID = CustomError('_', COMMUNITY_INVALID, 400);
