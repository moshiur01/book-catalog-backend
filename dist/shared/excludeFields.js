"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const excludeFields = (objOrArray, keysToExclude) => {
    if (Array.isArray(objOrArray)) {
        // Handle an array of objects
        return objOrArray.map(obj => {
            const result = Object.assign({}, obj);
            for (const key of keysToExclude) {
                delete result[key];
            }
            return result;
        });
    }
    else {
        // Handle a single object
        const result = Object.assign({}, objOrArray);
        for (const key of keysToExclude) {
            delete result[key];
        }
        return result;
    }
};
exports.default = excludeFields;
