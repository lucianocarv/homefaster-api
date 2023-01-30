"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const city_router_js_1 = require("./routes/city-router.js");
const province_router_js_1 = require("./routes/province-router.js");
exports.server = (0, fastify_1.default)({ logger: true });
exports.server.register(province_router_js_1.provinceRoutes);
exports.server.register(city_router_js_1.cityRoutes);
