import { FastifyReply, FastifyRequest } from 'fastify';
import { featureServices } from '../services/features-services';
import { Feature, User } from '@prisma/client';
import { ERR_FEATURE_ALREADY_EXISTS, ERR_FEATURE_TYPE_ERROR } from '../errors/feature-errors';
import { getPagination } from '../helpers/get-pagination';
import { FeatureModel } from '../../../prisma/models';
import { getIssuesZod } from '../helpers/get-issues-zod';
import { CustomError } from '../helpers/custom-error';
import { ERR_PERMISSION_DENIED } from '../errors/permission-erros';

const featureController = {
  createOneFeature: async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user as User;
    if (user.role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const feature = req.body as Feature;
    if (!['Property', 'Building', 'Community'].includes(feature.type)) throw ERR_FEATURE_TYPE_ERROR;
    try {
      const featureExists = await featureServices.findFeature(feature);
      if (!featureExists) {
        const newFeature = await featureServices.createFeature(feature);
        return res.status(201).send(newFeature);
      } else {
        throw ERR_FEATURE_ALREADY_EXISTS;
      }
    } catch (error) {
      return error;
    }
  },

  findAll: async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user as User;
    if (user.role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    try {
      const features = await featureServices.findAllFeatures({ page_number, per_page_number, skip });
      return res.send(features);
    } catch (error) {
      return error;
    }
  },

  updateOneFeature: async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user as User;
    if (user.role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const { id } = req.params as { id: string };
    const body = req.body as Feature;

    const parse = FeatureModel.pick({ name: true, type: true }).partial({ name: true, type: true }).safeParse(body);

    if (!parse.success) {
      const messages = getIssuesZod(parse.error.issues);
      throw CustomError('_', messages.toString(), 400);
    }
    const feature = parse.data as Feature;
    try {
      const result = await featureServices.updateOneFeature(Number(id), feature);
      return res.send(result);
    } catch (error) {
      return res.send(error);
    }
  },

  deleteOneFeature: async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user as User;
    if (user.role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const { id } = req.params as { id: string };
    try {
      const result = await featureServices.deleteOneFeature(Number(id));
      return res.status(202).send(result);
    } catch (error) {
      return res.send(error);
    }
  },
};

export { featureController };
