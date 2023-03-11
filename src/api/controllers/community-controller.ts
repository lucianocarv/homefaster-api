import { Community } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { IUpdateCommunity } from '../interfaces/update-community';
import { communityServices } from '../services/community-services';

const communityController = {
  index: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    try {
      const communities = await communityServices.index({ page_number, per_page_number, skip });
      res.send(communities);
    } catch (error) {
      res.send(error);
    }
  },

  create: async (req: FastifyRequest, res: FastifyReply) => {
    const attributes = req.body as Community;
    try {
      const community = await communityServices.create(attributes);
      res.send(community);
    } catch (error) {
      res.send(error);
    }
  },

  update: async (req: FastifyRequest, res: FastifyReply) => {
    const params = req.params as { id: string };
    const id = Number(params.id);
    const attributes = req.body as IUpdateCommunity;
    try {
      const community = await communityServices.update({ id, attributes });
      res.send(community);
    } catch (error) {
      res.send(error);
    }
  },

  uploadCoverImage: async (req: FastifyRequest, res: FastifyReply) => {
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.filename) return CustomError('_', 'É necessário incluir um arquivo para realizar o upload!', 406);
    if (!id) return CustomError('_', 'É necessário informar uma comunidade!', 406);
    try {
      const result = await communityServices.uploadCoverImage(data, 'communities', Number(id));
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  },

  delete: async (req: FastifyRequest, res: FastifyReply) => {
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const community = await communityServices.delete({ id });
      res.send(community);
    } catch (error) {
      res.send(error);
    }
  },
};

export { communityController };
