import { applyDecorators } from '@nestjs/common';
import { IMongoQueryOptions, IPaginationOptions } from '../interfaces';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

export function ApiMongoQuery(options?: IMongoQueryOptions) {
  const queryFields: ApiQueryOptions[] = [
    { name: 'page', type: Number, required: false },
    { name: 'limit', type: Number, required: false },
    { name: 'sort', type: String, required: false },
  ];

  options?.filterProps?.forEach(prop => {
    queryFields.push(
      { name: `${prop}[gt]`, required: false },
      { name: `${prop}[gte]`, required: false },
      { name: `${prop}[lt]`, required: false },
      { name: `${prop}[lte]`, required: false },
    );
  });

  const decorators: MethodDecorator[] = [];
  queryFields.forEach(field => {
    decorators.push(ApiQuery(field));
  });

  return applyDecorators(...decorators);
}
