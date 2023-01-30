"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_js_1 = require("./server.js");
const app = async () => {
    const port = 3000;
    try {
        await server_js_1.server.listen({ port });
        console.log(`App running at port ${port}`);
    }
    catch (error) {
        server_js_1.server.log.error(error);
        process.exit(1);
    }
};
app();
