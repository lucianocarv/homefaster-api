import { FastifyReply, FastifyRequest } from 'fastify';
import { getPagination } from '../helpers/get-pagination';
import { PaginationParameters } from '../interfaces/pagination-parameters';
import { utilitiesServices } from '../services/utilities-services';
import { Utility } from '@prisma/client';
import { ERR_UTILITY_ALREADY_EXISTS } from '../errors/utility-errors';
import { UtilityModel } from '../../../prisma/models';
import { getIssuesZod } from '../helpers/get-issues-zod';
import { CustomError } from '../helpers/custom-error';

const utilitiesController = {
  getAllUtilities: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const utilities = await utilitiesServices.getAllUtilities({ page_number, per_page_number, skip });
      return res.send(utilities);
    } catch (error) {
      return error;
    }
  },

  createUtility: async (req: FastifyRequest, res: FastifyReply) => {
    const { name } = req.body as Utility;
    try {
      const utilityExists = await utilitiesServices.findOne(name);
      if (utilityExists) throw ERR_UTILITY_ALREADY_EXISTS;
      const utility = await utilitiesServices.createOne(name);
      return res.send(utility);
    } catch (error) {
      return error;
    }
  },

  updateOneUtility: async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    const body = req.body;

    const parse = UtilityModel.pick({ name: true }).safeParse(body);

    if (!parse.success) {
      const messages = getIssuesZod(parse.error.issues);
      throw CustomError('_', messages.toString(), 400);
    }
    const utility = parse.data as Utility;
    try {
      const result = await utilitiesServices.updateOneUtility(Number(id), utility);
      return res.status(202).send(result);
    } catch (error) {
      return res.send(error);
    }
  },

  deleteOneUtility: async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    try {
      const result = await utilitiesServices.deleteOne(Number(id));
      return res.status(202).send(result);
    } catch (error) {
      return res.send(error);
    }
  },
};

export { utilitiesController };
