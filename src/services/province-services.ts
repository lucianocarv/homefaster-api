import { prisma } from '../prisma-connect.js';
import { Province } from '../types/province.js';

const provinceServices = {
  index: async (): Promise<Array<Province>> => {
    const provinces = await prisma.province.findMany();
    return provinces;
  },

  create: async (attributes: Province): Promise<Province> => {
    const province = await prisma.province.create({
      data: attributes,
    });
    return province;
  },
};

export { provinceServices };
