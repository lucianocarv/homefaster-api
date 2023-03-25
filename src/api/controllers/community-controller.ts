import { Community } from '@prisma/client';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ERR_MISSING_ATTRIBUTE, ERR_MISSING_FILE, ERR_MISSING_UPDATE_ATTRIBUTES, ERR_PERMISSION_DENIED } from '../errors';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { ICustomError } from '../interfaces/custom-error';
import { IUpdateCommunity } from '../interfaces/update-community';
import { communityServices } from '../services/community-services';

const communityController = {
  getAllCommunities: async (req: FastifyRequest, res: FastifyReply): Promise<Community[] | FastifyError> => {
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

  createOneCommunity: async (req: FastifyRequest, res: FastifyReply): Promise<Community | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const attributes = req.body as Community;
    if (!attributes.name || attributes.name.length < 1) throw ERR_MISSING_ATTRIBUTE('name');
    if (!attributes.city_id || attributes.city_id == 0) throw ERR_MISSING_ATTRIBUTE('city_id');
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
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);
    const attributes = req.body as IUpdateCommunity;
    if (!attributes) throw ERR_MISSING_UPDATE_ATTRIBUTES;
    try {
      const community = await communityServices.updateOneCommunity({ id, attributes });
      return res.status(202).send(community);
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
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.filename) throw ERR_MISSING_FILE;
    if (!id) ERR_MISSING_ATTRIBUTE('community_id');
    try {
      const result = await communityServices.uploadCoverImage(data, Number(id));
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

  deleteOneCommunity: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const community = await communityServices.deleteOneCommunity({ id });
      return res.status(202).send(community);
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
