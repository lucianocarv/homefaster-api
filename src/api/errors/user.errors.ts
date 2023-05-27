import { CustomError } from '../helpers/custom-error';

const MESSAGE_EMAIL_ALREADY_USED = 'Este email já está em uso!';
const MESSAGE_EMAIL_OR_PASSWORD_INCORRECT = 'Email ou senha incorretos!';
const MESSAGE_NEED_REGISTER = 'Cadastre-se para fazer login!';
const MESSAGE_ERR_VERIFY_ACCOUNT = 'Não foi possível verificar a conta, tente novamente!';
const MESSAGE_COULD_NOT_FIND_USER = 'Não foi possível encontrar o usuário!';
const MESSAGE_INCORRECT_CURRENT_PASSWORD = 'A senha atual informada está incorreta!';
const MESSAGE_NEW_PASS_DIFF_CURRENT = 'A nova senha não pode ser igual a atual!';
const MESSAGE_FAIL_SET_NEW_PASS = 'Falha ao criar nova senha!';
const MESSAGE_USERS_INVALID_ROLE = 'Função do usuário inválida!';
const MESSAGE_USERS_USER_CREATE_PERMISSION_DENIED = 'Você não tem permissão para criar este tipo de usuário!';

export const ERR_EMAIL_ALREADY_USED = CustomError('_', MESSAGE_EMAIL_ALREADY_USED, 422);
export const ERR_EMAIL_OR_PASSWORD_INCORRECT = CustomError('_', MESSAGE_EMAIL_OR_PASSWORD_INCORRECT, 401);
export const ERR_NEED_REGISTER = CustomError('_', MESSAGE_NEED_REGISTER, 401);
export const ERR_VERIFY_ACCOUNT = CustomError('_', MESSAGE_ERR_VERIFY_ACCOUNT, 400);
export const ERR_COULD_NOT_FIND_USER = CustomError('_', MESSAGE_COULD_NOT_FIND_USER, 400);
export const ERR_INCORRECT_CURRENT_PASSWORD = CustomError('_', MESSAGE_INCORRECT_CURRENT_PASSWORD, 422);
export const ERR_NEW_PASS_DIFF_CURRENT = CustomError('_', MESSAGE_NEW_PASS_DIFF_CURRENT, 422);
export const ERR_FAIL_SET_NEW_PASS = CustomError('_', MESSAGE_FAIL_SET_NEW_PASS, 500);
export const ERR_USERS_INVALID_ROLE = CustomError('_', MESSAGE_USERS_INVALID_ROLE, 400);
export const ERR_USERS_USER_CREATE_PERMISSION_DENIED = CustomError('_', MESSAGE_USERS_USER_CREATE_PERMISSION_DENIED, 400);
