"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiMongoQuery = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
function ApiMongoQuery(options) {
    var _a;
    var queryFields = [
        { name: 'page', type: Number, required: false },
        { name: 'limit', type: Number, required: false },
        { name: 'sort', type: String, required: false },
    ];
    (_a = options === null || options === void 0 ? void 0 : options.filterProps) === null || _a === void 0 ? void 0 : _a.forEach(function (prop) {
        queryFields.push({ name: prop + "[gt]", required: false }, { name: prop + "[gte]", required: false }, { name: prop + "[lt]", required: false }, { name: prop + "[lte]", required: false });
    });
    var decorators = [];
    queryFields.forEach(function (field) {
        decorators.push(swagger_1.ApiQuery(field));
    });
    return common_1.applyDecorators.apply(void 0, decorators);
}
exports.ApiMongoQuery = ApiMongoQuery;
