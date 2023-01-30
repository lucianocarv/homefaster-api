"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provinceServices = void 0;
const prisma_connect_js_1 = require("../prisma-connect.js");
const provinceServices = {
    index: async () => {
        const provinces = await prisma_connect_js_1.prisma.province.findMany();
        return provinces;
    },
    create: async (attributes) => {
        const province = await prisma_connect_js_1.prisma.province.create({
            data: attributes,
        });
        return province;
    },
};
exports.provinceServices = provinceServices;
