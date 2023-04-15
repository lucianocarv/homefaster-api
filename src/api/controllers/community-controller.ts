import { Community } from '@prisma/client';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ERR_MISSING_ATTRIBUTE } from '../errors';
import { ERR_PERMISSION_DENIED } from '../errors/permission-erros';
import { ERR_MISSING_FILE, ERR_MISSING_UPDATE_ATTRIBUTES } from '../errors/upload-file-errors';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { ICustomError } from '../interfaces/custom-error';
import { communityServices } from '../services/community-services';
import { CommunityModel } from '../../../prisma/models';
import { getIssuesZod } from '../helpers/get-issues-zod';

const communityController = {
  getAllCommunities: async (req: FastifyRequest, res: FastifyReply): Promise<Community[] | FastifyError> => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    try {
      const communities = await communityServices.getAllCommunities({ page_number, per_page_number, skip });
      return res.send(communities);
    } catch (error) {
      return res.send(error);
    }
  },

  createOneCommunity: async (req: FastifyRequest, res: FastifyReply): Promise<Community | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;

    const parse = CommunityModel.partial({
      id: true,
      formatted_address: true,
      global_code: true,
      img_cover: true,
      latitude: true,
      longitude: true,
      created_at: true,
      updated_at: true,
    }).safeParse(req.body);

    if (!parse.success) {
      const messages = getIssuesZod(parse.error.issues);
      throw CustomError('_', messages.toString(), 400);
    }

    const community = parse.data as Community;

    try {
      const result = await communityServices.createOneCommunity(community);
      return res.send(result);
    } catch (error) {
      return res.send(error);
    }
  },

  updateOneProvince: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);

    const parse = CommunityModel.pick({
      formatted_address: true,
      img_cover: true,
      latitude: true,
      longitude: true,
      name: true,
    })
      .partial({ formatted_address: true, img_cover: true, latitude: true, longitude: true, name: true })
      .safeParse(req.body);

    if (!parse.success) {
      const messages = getIssuesZod(parse.error.issues);
      throw CustomError('_', messages.toString(), 400);
    }

    const community = parse.data as Community;

    try {
      const result = await communityServices.updateOneCommunity({ id, attributes: community });
      return res.status(202).send(result);
    } catch (error) {
      return res.send(error);
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
      return res.send(error);
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
      return res.send(error);
    }
  },
};

export { communityController };
