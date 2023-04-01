import { CustomError } from '../helpers/custom-error';

const MISSING_ATTRIBUTES_ALL = 'Insira pelo menos um atributo a ser atualizado!';
const MISSING_FILE = 'Insira uma arquivo para fazer upload!';

export const ERR_MISSING_UPDATE_ATTRIBUTES = CustomError('_', MISSING_ATTRIBUTES_ALL, 400);
export const ERR_MISSING_FILE = CustomError('_', MISSING_FILE, 400);
