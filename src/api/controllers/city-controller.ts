import { City } from '@prisma/client';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { getPagination } from '../helpers/get-pagination';
import { citiesServices } from '../services/city-services';
import { PaginationParameters } from '../interfaces/pagination-parameters';
import { ERR_PERMISSION_DENIED } from '../errors/permission-erros';
import { ERR_MISSING_ID } from '../errors';
import { ERR_MISSING_FILE } from '../errors/upload-file-errors';
import { CityModel } from '../../../prisma/models';
import { getIssuesZod } from '../helpers/get-issues-zod';
import { CustomError } from '../helpers/custom-error';
import { redisService } from '../services/redis-service';

const cityController = {
  getAllCities: async (req: FastifyRequest, res: FastifyReply): Promise<City[] | FastifyError> => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const cities = await citiesServices.getAllCities({ page_number, per_page_number, skip });
      return res.send(cities);
    } catch (error) {
      return res.send(error);
    }
  },

  getOneCity: async (req: FastifyRequest, res: FastifyReply): Promise<City | FastifyError> => {
    const { id } = req.params as { id: string };
    try {
      const city = await citiesServices.getOneCity(Number(id));
      return res.send(city);
    } catch (error) {
      return res.send(error);
    }
  },

  createOneCity: async (req: FastifyRequest, res: FastifyReply): Promise<City | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;

    const parse = CityModel.partial({
      id: true,
      img_cover: true,
      latitude: true,
      longitude: true,
      place_id: true,
      updated_at: true,
      created_at: true
    }).safeParse(req.body);

    if (!parse.success) {
      const messages = getIssuesZod(parse.error.issues);
      throw CustomError('_', messages.toString(), 400);
    }
    const city = parse.data as City;
    try {
      const result = await citiesServices.createOneCity(city);
      return res.status(201).send(result);
    } catch (error) {
      return res.send(error);
    }
  },

  updateOneCity: async (req: FastifyRequest, res: FastifyReply): Promise<City | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);

    const parse = CityModel.pick({ name: true, latitude: true, longitude: true, img_cover: true })
      .partial({
        name: true,
        latitude: true,
        longitude: true,
        img_cover: true
      })
      .safeParse(req.body);

    if (!parse.success) {
      const messages = getIssuesZod(parse.error.issues);
      throw CustomError('_', messages.toString(), 400);
    }

    const city = parse.data as City;

    try {
      const result = await citiesServices.updateOneCity({ id, attributes: city });
      return res.status(202).send(result);
    } catch (error) {
      return res.send(error);
    }
  },

  uploadCoverImageForOneCity: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.filename) throw ERR_MISSING_FILE;
    if (!id) throw ERR_MISSING_ID('cidade', 'atualizada');
    try {
      const uploaded = await citiesServices.uploadCoverImage(data, Number(id));
      return res.status(202).send(uploaded);
    } catch (error) {
      return res.send(error);
    }
  },

  deleteOneCity: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const city = await citiesServices.deleteOneCity({ id });
      return res.status(202).send(city);
    } catch (error) {
      return res.send(error);
    }
  }
};

export { cityController };
