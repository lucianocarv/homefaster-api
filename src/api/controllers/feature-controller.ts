import { FastifyReply, FastifyRequest } from 'fastify';
import { featureServices } from '../services/features-services';
import { Feature } from '@prisma/client';
import { ERR_FEATURE_ALREADY_EXISTS, ERR_FEATURE_TYPE_ERROR } from '../errors/feature-errors';
import { getPagination } from '../helpers/get-pagination';

const featureController = {
  createOneFeature: async (req: FastifyRequest, res: FastifyReply) => {
    const feature = req.body as Feature;
    if (!['Property', 'Building', 'Community'].includes(feature.type)) throw ERR_FEATURE_TYPE_ERROR;
    try {
      const featureExists = await featureServices.findFeature(feature);
      if (!featureExists) {
        const newFeature = await featureServices.createFeature(feature);
        return newFeature;
      } else {
        throw ERR_FEATURE_ALREADY_EXISTS;
      }
    } catch (error) {
      return error;
    }
  },

  findAll: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    try {
      const features = await featureServices.findAllFeatures({ page_number, per_page_number, skip });
      return features;
    } catch (error) {
      return error;
    }
  },
};

export { featureController };
