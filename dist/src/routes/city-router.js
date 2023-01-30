"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityRoutes = void 0;
const city_controller_1 = require("../controllers/city-controller");
async function cityRoutes(fastify, options) {
    fastify.get('/cities', city_controller_1.cityController.index);
    fastify.post('/cities', city_controller_1.cityController.create);
}
exports.cityRoutes = cityRoutes;
