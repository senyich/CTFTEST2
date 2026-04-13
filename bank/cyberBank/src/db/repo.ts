import {AppDataSource} from "./db";
import { User } from "./entity/user";
import { Product } from "./entity/product";
import { Comment } from "./entity/comment";


export const userRepo = AppDataSource.getRepository(User);
export const productRepo = AppDataSource.getRepository(Product);
export const commentRepo = AppDataSource.getRepository(Comment);
