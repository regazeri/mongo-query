import { MongooseQueryOptions } from "mongoose";
import { IPaginationOptions } from ".";

export interface IMongoQuery {
  // TODO, filter type should be FilterQuery
  filters?: MongooseQueryOptions;
  pagination?: IPaginationOptions;
}