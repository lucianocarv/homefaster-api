"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provinceController = void 0;
const province_services_js_1 = require("../services/province-services.js");
const provinceController = {
    index: async (req, res) => {
        try {
            const provinces = await province_services_js_1.provinceServices.index();
            res.send(provinces);
        }
        catch (error) {
            res.send(error);
        }
    },
    create: async (req, res) => {
        const attributes = req.body;
        try {
            const province = await province_services_js_1.provinceServices.create(attributes);
            res.send(province);
        }
        catch (error) {
            res.send(error);
        }
    },
};
exports.provinceController = provinceController;
