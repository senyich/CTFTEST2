import { Product } from "./entity/product";
import { User } from "./entity/user";
import { Comment } from "./entity/comment";

import { productRepo } from "./repo";
import { userRepo } from "./repo";
import { commentRepo } from "./repo";

import { prepareContent } from "../security/service";
import Image from "../imageGen";


export async function createUser(name: string, password: string) : Promise<User | null> {
    const user = new User();

    user.name = name;
    user.password = password;

    try {
        await userRepo.save(user);
    } catch (err) {
        console.log(err);
        return null;
    }

    return user;
}

export async function updateUser(user: User, param: {
    balance?: number, productCount?: number}) : Promise<User | null> {
    if (param.balance) user.balance = param.balance;
    if (param.productCount) user.productCount = param.productCount;

    try {
        return await userRepo.save(user);
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function createProduct(description: string,
    content: string, price: number,
    user: User) : Promise<Product | null> {
    const product = new Product();

    product.description = description;
    product.price = price;
    product.created = Date();
    product.owner = user;
    product.content = prepareContent(content);

    const image = new Image();
    product.image_path = await image.generate(content, user.id);

    try {
        await productRepo.save(product);
    } catch (err) {
        console.log(err);
        return null;
    }

    return product;
}

export async function updateProduct(product: Product, param: {
    description?: string, owner?: User, price?: number,
    image_path?: string, reason?: string
    }) : Promise<Product | null> {
    if (param.description) product.description = param.description;
    if (param.owner) product.owner = param.owner;
    if (param.price) product.price = param.price;
    if (param.image_path) product.image_path = param.image_path;

    product.updated = Date();

    try {
        return await productRepo.save(product);
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function createComment(content: string,
    user: User, product: Product) : Promise<Comment | null> {
    const comment = new Comment();

    comment.content = content;
    comment.created = Date();
    comment.user = user;
    comment.product = product;

    try {
        await commentRepo.save(comment);
    } catch (err) {
        console.log(err);
        return null;
    }

    return comment;
}

export async function getUserByName(name: string) : Promise<User | null> {
    return await userRepo.findOneBy({ name: name });
}

export async function getUserById(id: number) : Promise<User | null> {
    return await userRepo.findOneBy({ id: id });
}

export async function getProducts() : Promise<Product[] | null> {
    const products = await productRepo.find();
    if (!products) return null;

    return products ?? [];
}

export async function getProductById(pid: number) : Promise<Product | null> {
    return await productRepo.findOneBy({ id: pid });
}

export async function getProductComments(product: Product) : Promise<Comment[] | null> {
    const comments = await commentRepo.findBy({ product: product });
    if (!comments) return null

    return comments ?? [];
}