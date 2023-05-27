import { CustomError } from '../helpers/custom-error';

const UPLOAD_MISSING_ATTRIBUTES_ALL = 'Insira pelo menos um atributo a ser atualizado!';
const UPLOAD_MISSING_FILE = 'Insira uma arquivo para fazer upload!';
const UPLOAD_MISSING_PROPERTY = 'Selecione uma propriedade!';

export const ERR_UPLOAD_MISSING_UPDATE_ATTRIBUTES = CustomError('_', UPLOAD_MISSING_ATTRIBUTES_ALL, 400);
export const ERR_UPLOAD_MISSING_FILE = CustomError('_', UPLOAD_MISSING_FILE, 400);
export const ERR_UPLOAD_MISSING_PROPERTY = CustomError('_', UPLOAD_MISSING_PROPERTY, 400);
