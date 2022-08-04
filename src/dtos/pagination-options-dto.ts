import { IPaginationOptions } from "../interfaces";

export class PaginationOptionsDto implements IPaginationOptions {
  limit: number = 10;
  page: number = 1;
  sort: string = '';
}