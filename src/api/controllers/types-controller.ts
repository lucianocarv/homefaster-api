import { FastifyRequest, FastifyReply } from 'fastify';
import { ERR_PERMISSION_DENIED } from '../errors/permission-erros';
import { getPagination } from '../helpers/get-pagination';
import { PaginationParameters } from '../interfaces/pagination-parameters';
import { Type, User } from '@prisma/client';
import { typeServices } from '../services/type-services';

const typesController = {
  getAllTypes: async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user as User;
    if (user.role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const types = await typeServices.getAllTypes({ page_number, per_page_number, skip });
      return res.send(types);
    } catch (error) {
      return res.send(error);
    }
  },

  addType: async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user as User;
    if (user.role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const data = req.body as Type;
    try {
      const type = await typeServices.addType(data);
      return res.status(201).send(type);
    } catch (error) {
      return res.send(error);
    }
  },

  removeType: async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user as User;
    if (user.role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const { id } = req.params as { id: string };
    try {
      const type = await typeServices.removeType(Number(id));
      return res.status(202).send(type);
    } catch (error) {
      return res.send(error);
    }
  }
};

export { typesController };
