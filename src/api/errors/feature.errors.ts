import { CustomError } from '../helpers/custom-error';

const MESSAGE_FEATURE_ALREADY_EXISTS = 'Essa feature já existe!';
const MESSAGE_FEATURE_TYPE_ERROR = "Todas as features devem ter um dos tipos a seguir: ['Property', 'Building', 'Community']";
const MESSAGE_FEATURE_UPDATE_FAILED = 'Não foi possível atualizar as features!';

export const ERR_FEATURE_ALREADY_EXISTS = CustomError('_', MESSAGE_FEATURE_ALREADY_EXISTS, 400);
export const ERR_FEATURE_TYPE_ERROR = CustomError('_', MESSAGE_FEATURE_TYPE_ERROR, 400);
export const ERR_FEATURE_UPDATE_FAILED = CustomError('_', MESSAGE_FEATURE_UPDATE_FAILED, 400);
