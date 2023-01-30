"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const prisma_connect_js_1 = require("../prisma-connect.js");
const userServices = {
    index: async () => {
        try {
            const provinces = await prisma_connect_js_1.prisma.province.findMany();
            return provinces;
        }
        catch (error) { }
    },
    create: async () => {
        try {
            const province = await prisma_connect_js_1.prisma.province.create({
                data: {
                    name: 'Alberta',
                    short_name: 'AB',
                    global_code: 'IASDW13613LASPX',
                },
            });
            console.log(province);
            return province;
        }
        catch (error) {
            return error;
        }
    },
};
exports.userServices = userServices;
