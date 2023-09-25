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
exports.orderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const excludeFields_1 = __importDefault(require("../../../shared/excludeFields"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDb = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    const insertedData = data.orderedBooks;
    const { id, role } = user;
    const isExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User is not found');
    }
    if ((isExist === null || isExist === void 0 ? void 0 : isExist.role) === role) {
        const result = yield prisma_1.default.order.create({
            data: {
                userId: id,
                orderedBooks: JSON.stringify(insertedData),
                status: 'pending',
            },
        });
        return (0, excludeFields_1.default)(result, ['updatedAt']);
    }
    else {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User is not Authorized');
    }
});
const getAllFromDb = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = user;
    const isExist = yield prisma_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User is not found');
    }
    if (role === user_1.ENUM_USER_ROLE.ADMIN) {
        const result = yield prisma_1.default.order.findMany({});
        return result;
    }
    else if (role === user_1.ENUM_USER_ROLE.CUSTOMER) {
        const result = yield prisma_1.default.order.findMany({
            where: {
                userId: id,
            },
        });
        return result;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User is not Authorized');
    }
});
const getSingleOrderFromDb = (user, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, id } = user;
    const result = yield prisma_1.default.order.findUnique({
        where: {
            id: orderId,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    if (role === user_1.ENUM_USER_ROLE.ADMIN || id === result.userId) {
        return (0, excludeFields_1.default)(result, ['updatedAt']);
    }
    else {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User is not authorized to see the order details');
    }
});
exports.orderService = {
    insertIntoDb,
    getAllFromDb,
    getSingleOrderFromDb,
};
