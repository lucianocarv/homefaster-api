import { CustomError } from '../helpers/custom-error';

//@Messages
// Messages / Global
const PERMISSION_DENIED = 'Você não tem permissão para acessar este recurso!';
const NEED_LOGIN = 'Faça login para acessar estes recursos!';
// Messages / Missing Data
const MISSING_ATTRIBUTES_ALL = 'Insira pelo menos um atributo a ser atualizado!';
const MISSING_FILE = 'Insira uma arquivo para fazer upload!';
// Messages / Province
const PROVINCE_ALREADY_EXISTS = 'Esta província já está cadastrada!';
const PROVINCE_INVALID = 'A província informada é inválida!';
const PROVINCE_NOT_FOUND = 'Não foi possível encontrar esta província!';
// Messages / City
const CITY_ALREADY_EXISTS = 'Esta cidade já está cadastrada!';
const CITY_INVALID = 'A cidade informada é inválida!';
const CITY_NOT_FOUND = 'Não foi possível encontrar esta cidade!';
// Messages / Community
const COMMUNITY_ALREADY_EXISTS = 'Esta comunidade já está cadastrada!';
const COMMUNITY_INVALID = 'A comunidade informada é inválida!';
// Messages / Users
const USERS_INVALID_ROLE = 'Função do usuário inválida!';
const USERS_USER_CREATE_PERMISSION_DENIED = 'Você não tem permissão para criar este tipo de usuário!';

//@Static Error Messages
export const ERR_NEED_LOGIN = CustomError('_', NEED_LOGIN, 401);
export const ERR_PERMISSION_DENIED = CustomError('_', PERMISSION_DENIED, 401);
// Static Error Messages / Attributes
export const ERR_MISSING_UPDATE_ATTRIBUTES = CustomError('_', MISSING_ATTRIBUTES_ALL, 400);
export const ERR_MISSING_FILE = CustomError('_', MISSING_FILE, 400);
// Static Error Messages / Province / 400 Codes
export const ERR_INVALID_PROVINCE = CustomError('_', PROVINCE_INVALID, 400);
export const ERR_PROVINCE_ALREADY_EXISTS = CustomError('_', PROVINCE_ALREADY_EXISTS, 400);
export const ERR_PROVINCE_NOT_FOUND = CustomError('_', PROVINCE_NOT_FOUND, 400);
// Static Error Messages / City / 400 Codes
export const ERR_INVALID_CITY = CustomError('_', CITY_INVALID, 400);
export const ERR_CITY_ALREADY_EXISTS = CustomError('_', CITY_ALREADY_EXISTS, 400);
export const ERR_CITY_NOT_FOUND = CustomError('_', CITY_NOT_FOUND, 400);

// Static Error Messages / Community / 400 Codes
export const ERR_COMMUNITY_ALREADY_EXISTS = CustomError('_', COMMUNITY_ALREADY_EXISTS, 400);
export const ERR_COMMUNITY_INVALID = CustomError('_', COMMUNITY_INVALID, 400);

// Static Error Messages / Users
export const ERR_USERS_INVALID_ROLE = CustomError('_', USERS_INVALID_ROLE, 400);
export const ERR_USERS_USER_CREATE_PERMISSION_DENIED = CustomError('_', USERS_USER_CREATE_PERMISSION_DENIED, 400);

// Dinamic Messages
export const ERR_MISSING_ID = (text: string, verb: string) => CustomError('_', `Insira um(a) ${text} que será ${verb}!`, 400);
export const ERR_MISSING_ATTRIBUTE = (attr: string) => CustomError('_', `Informe o atributo '${attr}'`, 400);
