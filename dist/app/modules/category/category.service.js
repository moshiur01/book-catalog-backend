"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const excludeFields_1 = __importDefault(require("../../../shared/excludeFields"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.create({
        data,
    });
    return (0, excludeFields_1.default)(result, ['createdAt', 'updatedAt']);
});
const getAllFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany();
    return (0, excludeFields_1.default)(result, ['createdAt', 'updatedAt']);
});
const getSingleCategoryFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findFirst({
        where: {
            id,
        },
        include: {
            books: true,
        },
    });
    if (result === null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Category not Found');
    }
    return (0, excludeFields_1.default)(result, ['createdAt', 'updatedAt']);
});
const updateCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = prisma_1.default.category.findFirst({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.OK, 'Category not Found');
    }
    const result = yield prisma_1.default.category.update({
        where: {
            id,
        },
        data: payload,
    });
    return (0, excludeFields_1.default)(result, ['createdAt', 'updatedAt']);
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.delete({
        where: {
            id,
        },
    });
    return (0, excludeFields_1.default)(result, ['createdAt', 'updatedAt']);
});
exports.categoryService = {
    insertIntoDb,
    getAllFromDb,
    getSingleCategoryFromDb,
    updateCategory,
    deleteCategory,
};
