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
function _generateFilters(request, filterProps, searchProps) {
    if (filterProps === void 0) { filterProps = []; }
    if (searchProps === void 0) { searchProps = []; }
    var output = _filterObject(request.query, filterProps);
    if (request.query.search) {
        output['$or'] = searchProps.map(function (prop) {
            var _a;
            return (_a = {}, _a[prop] = { $regex: request.query.search, $options: 'i' }, _a);
        });
    }
    // Add `$` sign to mongoDb operators
    var queryStr = JSON.stringify(output);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) { return "$" + match; });
    return JSON.parse(queryStr);
}
function _generatePagination(request) {
    var opts = {
        page: 1,
        limit: 10,
        sort: undefined,
    };
    if (request.query.pageSize) {
        opts.limit = Number(request.query.pageSize);
    }
    if (request.query.page) {
        opts.page = Number(request.query.page);
    }
    if (request.query.orderBy) {
        if (request.query.order === 'desc') {
            opts.sort = "-" + request.query.orderBy;
        }
        else {
            opts.sort = request.query.orderBy;
        }
    }
    return opts;
}
exports.MongoQuery = common_1.createParamDecorator(function (options, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var filters = _generateFilters(request, options === null || options === void 0 ? void 0 : options.filterProps, options === null || options === void 0 ? void 0 : options.searchProps);
    var pagination = _generatePagination(request);
    return { filters: filters, pagination: pagination };
});
