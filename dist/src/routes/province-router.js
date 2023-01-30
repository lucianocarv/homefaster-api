"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provinceRoutes = void 0;
const province_controller_js_1 = require("../controllers/province-controller.js");
async function provinceRoutes(fastify) {
    fastify.get('/provinces', province_controller_js_1.provinceController.index);
    fastify.post('/provinces', province_controller_js_1.provinceController.create);
}
exports.provinceRoutes = provinceRoutes;
