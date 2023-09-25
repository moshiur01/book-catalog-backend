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
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const excludeFields_1 = __importDefault(require("../../../shared/excludeFields"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany();
    return (0, excludeFields_1.default)(result, ['createdAt', 'updatedAt', 'password']);
});
const getSingleUserFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (result === null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not Found');
    }
    return (0, excludeFields_1.default)(result, [
        'createdAt',
        'updatedAt',
        'password',
    ]);
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = prisma_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.OK, 'User not Found');
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return (0, excludeFields_1.default)(result, [
        'createdAt',
        'updatedAt',
        'password',
    ]);
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.delete({
        where: {
            id,
        },
    });
    return (0, excludeFields_1.default)(result, [
        'createdAt',
        'updatedAt',
        'password',
    ]);
});
exports.userService = {
    getAllFromDb,
    getSingleUserFromDb,
    updateUser,
    deleteUser,
};
