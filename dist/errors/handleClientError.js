"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleClientError = (error) => {
    var _a;
    let errors = [];
    let message = '';
    const statusCode = 400;
    //*update
    if (error.code === 'p2025') {
        message = ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.cause) || 'Record Not Found';
        errors = [
            {
                path: '',
                message,
            },
        ];
    }
    //*foreign key deletion
    else if (error.code === 'p2003') {
        if (error.message.includes('delete() invocation:')) {
            message = 'Delete Failed';
            errors = [
                {
                    path: '',
                    message,
                },
            ];
        }
    }
    return {
        statusCode,
        message,
        errorMessages: errors,
    };
};
exports.default = handleClientError;
