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
exports.authService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const excludeFields_1 = __importDefault(require("../../../shared/excludeFields"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = data;
    const hashPassword = yield utils_1.utilsFunctions.hashPassword(password);
    data.password = hashPassword;
    const result = yield prisma_1.default.user.create({
        data,
    });
    return (0, excludeFields_1.default)(result, [
        'createdAt',
        'updatedAt',
        'password',
    ]);
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    //check user
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User Does Not Exists');
    }
    //check password
    if (isUserExist.password &&
        !(yield utils_1.utilsFunctions.isPasswordMatch(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    //create access token
    const { id, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ id, role }, config_1.default.jwt.jwt_token, config_1.default.jwt.jwt_token_expires_in);
    // refresh token
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ id, role }, config_1.default.jwt.jwt_refresh_token, config_1.default.jwt.jwt_refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.authService = {
    insertIntoDB,
    loginUser,
};
