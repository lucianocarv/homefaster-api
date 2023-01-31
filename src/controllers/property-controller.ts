import { Property } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateProperty, propertyServices } from '../services/property-services';

const propertyController = {
  create: async (req: FastifyRequest, res: FastifyReply) => {
    const attibutes = req.body as CreateProperty;
    try {
      const property = await propertyServices.create(attibutes);
      res.send(property);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        res.send(error);
      }
      res.send(error);
    }
  },
};

export { propertyController };
