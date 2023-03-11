import { Community } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { ICustomError } from '../interfaces/custom-error';
import { IUpdateCommunity } from '../interfaces/update-community';
import { communityServices } from '../services/community-services';

const communityController = {
  index: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    try {
      const communities = await communityServices.getAllCommunities({ page_number, per_page_number, skip });
      return res.send(communities);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  create: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador para acessar este recurso!',
        statusCode: 401,
      };
    const attributes = req.body as Community;
    try {
      const community = await communityServices.createOneCommunity(attributes);
      return res.send(community);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  update: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador para acessar este recurso!',
        statusCode: 401,
      };
    const params = req.params as { id: string };
    const id = Number(params.id);
    const attributes = req.body as IUpdateCommunity;
    try {
      const community = await communityServices.updateOneCommunity({ id, attributes });
      return res.send(community);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  uploadCoverImage: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador para acessar este recurso!',
        statusCode: 401,
      };
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.filename) return CustomError('_', 'É necessário incluir um arquivo para realizar o upload!', 406);
    if (!id) return CustomError('_', 'É necessário informar uma comunidade!', 406);
    try {
      const result = await communityServices.uploadCoverImage(data, 'communities', Number(id));
      return res.send(result);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  delete: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador para acessar este recurso!',
        statusCode: 401,
      };
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const community = await communityServices.deleteOneCommunity({ id });
      return res.send(community);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },
};

export { communityController };
