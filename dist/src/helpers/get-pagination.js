"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (page, perPage) => {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const perPageNumber = Number(perPage) > 0 ? Number(perPage) : 10;
    const skip = pageNumber * perPageNumber - perPageNumber;
    return [pageNumber, perPageNumber, skip];
};
exports.getPagination = getPagination;
