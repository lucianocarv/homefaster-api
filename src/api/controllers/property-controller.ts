import {} from '@prisma/client/runtime';
import { FastifyReply, FastifyRequest } from 'fastify';
import { readFileSync } from 'fs';
import path from 'path';
import { getPagination } from '../helpers/get-pagination';
import { IFilter } from '../interfaces/search-filter';
import { propertyServices } from '../services/property-services';
import { PropertyWithAddressAndDescription } from '../types/create-property';

const propertyController = {
  index: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);

    try {
      const properties = await propertyServices.index({ page_number, per_page_number, skip });
      return res.send(properties);
    } catch (error) {
      return res.send(error);
    }
  },

  searchByAddress: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    const { city, community, street } = req.query as { city: string; community?: string; street?: string };

    try {
      const properties = await propertyServices.searchByAddress({
        address: { city, community, street },
        pagination: { page_number, per_page_number, skip },
      });
      return res.send(properties);
    } catch (error) {
      return res.send(error);
    }
  },

  filterByDescription: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    const { filters } = req.body as { filters: IFilter };
    try {
      const properties = await propertyServices.filterByDescription({
        pagination: { page_number, per_page_number, skip },
        filters,
      });
      return res.send(properties);
    } catch (error) {
      return res.send(error);
    }
  },

  property: async (req: FastifyRequest, res: FastifyReply) => {
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const property = await propertyServices.property(id);
      return res.send(property);
    } catch (error) {
      return res.send(error);
    }
  },

  create: async (req: FastifyRequest, res: FastifyReply) => {
    const attibutes = req.body as PropertyWithAddressAndDescription;
    try {
      const property = await propertyServices.create(attibutes);
      return res.send(property);
    } catch (error) {
      return res.send(error);
    }
  },

  updateOneProperty: async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    const attributes = req.body as PropertyWithAddressAndDescription;
    console.log(attributes);
    try {
      const property = await propertyServices.update(Number(id), attributes);
      res.send(property);
    } catch (error) {
      res.send(error);
    }
  },

  uploadThumbImage: async (req: FastifyRequest, res: FastifyReply) => {
    const data = await req.file();
    const { property_id } = req.query as { property_id: string };
    try {
      if (data?.filename) {
        const result = await propertyServices.uploadThumb(data, property_id);
        res.send(result);
      }
    } catch (error) {
      res.send(error);
    }
  },
};

export { propertyController };
