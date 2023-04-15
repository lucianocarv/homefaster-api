import createError from '@fastify/error';

export function CustomError(code: string, message: string, statusCode: number, cause?: object) {
  const err = createError(code, message, statusCode);
  return err();
}
