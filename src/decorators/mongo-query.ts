import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { MongooseQueryOptions } from 'mongoose';
import {
  IPaginationOptions,
  IMongoQueryOptions,
  IMongoQuery,
} from '../interfaces';

function _filterObject<U extends { [key: string]: unknown }>(
  input: U,
  validProps: string[],
  defaultValues: Partial<U> = {},
) {
  let output: { [key: string]: unknown } = {};
  Object.keys(input).forEach(key => {
    if (validProps.includes(key)) {
      output[key] = input[key] ?? defaultValues[key];
    }
  });

  return output;
}

function _generateFilters(
  request: Request,
  filterProps: string[] = [],
  searchProps: string[] = [],
): MongooseQueryOptions {
  const output = _filterObject(request.query, filterProps);

  if (request.query.search) {
    output['$or'] = searchProps.map(prop => ({ [prop]: { $regex: request.query.search, $options: 'i'} }))
  }

  // Add `$` sign to mongoDb operators
  let queryStr = JSON.stringify(output);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  return JSON.parse(queryStr);
}

function _generatePagination(request: Request): IPaginationOptions {
  const opts: IPaginationOptions = {
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
      opts.sort = `-${request.query.orderBy}`;
    } else {
      opts.sort = request.query.orderBy;
    }
  }

  return opts;
}

export const MongoQuery = createParamDecorator<
  IMongoQueryOptions,
  ExecutionContext,
  IMongoQuery
>((options: IMongoQueryOptions, ctx: ExecutionContext): IMongoQuery => {
  const request = ctx.switchToHttp().getRequest() as Request;

  const filters = _generateFilters(request, options?.filterProps, options?.searchProps);
  const pagination = _generatePagination(request);

  return { filters, pagination };
});
