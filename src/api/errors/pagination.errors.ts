import { CustomError } from '../helpers/custom-error';

const MESSAGE_LIMITED_PAGES = 'Não é possível encontrar uma página maior do que quantidade informada no retorno!';

export const ERR_LIMITED_PAGES = CustomError('_', MESSAGE_LIMITED_PAGES, 400);
