"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citiesServices = void 0;
const get_pagination_js_1 = require("../helpers/get-pagination.js");
const prisma_connect_js_1 = require("../prisma-connect.js");
const citiesServices = {
    index: async (page, perPage) => {
        const [pageNumber, perPageNumber, skip] = (0, get_pagination_js_1.getPagination)(page, perPage);
        const cities = await prisma_connect_js_1.prisma.city.findMany({
            orderBy: {
                id: 'asc',
            },
            skip,
            take: perPageNumber,
            include: {
                province: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return { page: pageNumber, perPage: perPageNumber, cities };
    },
    create: async (attributes) => {
        const city = await prisma_connect_js_1.prisma.city.create({
            data: attributes,
            include: {
                province: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return city;
    },
};
exports.citiesServices = citiesServices;
