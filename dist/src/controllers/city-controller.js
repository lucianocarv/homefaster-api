"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityController = void 0;
const city_services_1 = require("../services/city-services");
const cityController = {
    index: async (req, res) => {
        const { page, perPage } = req.query;
        try {
            const provinces = await city_services_1.citiesServices.index(page, perPage);
            res.send(provinces);
        }
        catch (error) {
            res.send(error);
        }
    },
    create: async (req, res) => {
        const attributes = req.body;
        try {
            const province = await city_services_1.citiesServices.create(attributes);
            res.send(province);
        }
        catch (error) {
            res.send(error);
        }
    },
};
exports.cityController = cityController;
