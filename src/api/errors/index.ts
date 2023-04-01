import { CustomError } from '../helpers/custom-error';

export const ERR_MISSING_ID = (text: string, verb: string) => CustomError('_', `Insira um(a) ${text} que será ${verb}!`, 400);
export const ERR_MISSING_ATTRIBUTE = (attr: string) => CustomError('_', `Informe o atributo '${attr}'`, 400);
