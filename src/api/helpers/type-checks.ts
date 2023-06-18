import { CustomError } from './custom-error';

export function checkThatTheReceivedValueIsNotAnEmptyString(property: any) {
  if (property == undefined || property == '') return undefined;
  else return property;
}

export function checkIfReceivedValueIsNumberOrBoolean(property: any) {
  if (property !== undefined && isNaN(property)) throw CustomError('_', `A propriedade ${property} não é válida!`, 400);
  else if (property == undefined) return undefined;
  else if (property == '' || property == undefined) return undefined;
  else if (property == 'false') return false;
  else if (property == 'true') return true;
  else return Number(property);
}
