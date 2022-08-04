"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoQuery = void 0;
var common_1 = require("@nestjs/common");
function _filterObject(input, validProps, defaultValues) {
    if (defaultValues === void 0) { defaultValues = {}; }
    var output = {};
    Object.keys(input).forEach(function (key) {
        var _a;
        if (validProps.includes(key)) {
            output[key] = (_a = input[key]) !== null && _a !== void 0 ? _a : defaultValues[key];
        }
    });
    return output;
}
function _generateFilters(request, filterProps) {
    if (filterProps === void 0) { filterProps = []; }
    var output = _filterObject(request.query, filterProps);
    // Add `$` sign to mongoDb operators
    var queryStr = JSON.stringify(output);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) { return "$" + match; });
    return JSON.parse(queryStr);
}
function _generatePagination(request) {
    var paginationProps = ['page', 'limit', 'sort'];
    var defaultValues = {
        page: '1',
        limit: '10',
        sort: undefined,
    };
    return _filterObject(request.query, paginationProps, defaultValues);
}
exports.MongoQuery = common_1.createParamDecorator(function (options, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var filters = _generateFilters(request, options === null || options === void 0 ? void 0 : options.filterProps);
    var pagination = _generatePagination(request);
    return { filters: filters, pagination: pagination };
});
