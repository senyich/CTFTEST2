import 'reflect-metadata';
import {
    Controller, JsonController,
    Get, Post, Put,
    Param, Body, Authorized, Req, Res 
} from 'routing-controllers';
import { Request, Response } from 'express';

import { ProductObject } from '../interface/productObject';
import { CommentObject } from '../interface/commentObject';
import { BuyObject } from "../interface/buyObject";
import { getUserByName, getProducts, createProduct,
    getProductById, updateUser, updateProduct, 
    createComment
} from '../db/service';
import { httpResponse400, httpResponse401, httpResponse500, 
    checkProductObject, checkBuyObject, checkCommentObject, 
    prepareProductsToResponse, prepareProductToResponse
} from '../utils';
import { getTokenPayload } from '../security/service';
import WebSocketController from './webSocketController';
import Const from '../strings';


@Controller('/products')
export class ProductsController {
    @Authorized()
    @Get()
    async getProducts(@Req() request: Request, @Res() response: Response) {
        const products = await getProducts();

        if (!products) return httpResponse500(response, Const.DB_REQUEST_ERROR);

        const tokenPayload = getTokenPayload(request.cookies.jwt);
        const user = await getUserByName(tokenPayload.username);

        if (!user) return httpResponse401(response, Const.BAD_SESSION);

        const processedProducts = await prepareProductsToResponse(products, user);
        if (!processedProducts) return httpResponse500(response, Const.DB_REQUEST_ERROR);
        
        return processedProducts;
    }

    @Authorized()
    @Get('/:pid')
    async getProduct(@Param('pid') pid: number, @Req() request: Request,
        @Res() response: Response) {
        const tokenPayload = getTokenPayload(request.cookies.jwt);
        const user = await getUserByName(tokenPayload.username);
        const product = await getProductById(pid);

        if (!user) return httpResponse401(response, Const.BAD_SESSION);
        if (!product) return httpResponse400(response, Const.BAD_REQUEST);

        const processedProduct = await prepareProductToResponse(product, user);
        if (!processedProduct) return httpResponse500(response, Const.DB_REQUEST_ERROR);

        return processedProduct;
    }
}

@JsonController('/products')
export class CreateProductController {
    @Authorized()
    @Post('/create')
    async createNewProduct(@Body({ required: true }) data: ProductObject, 
        @Req() request: Request, @Res() response: Response) {
        if (checkProductObject(data)) return httpResponse400(response);

        const tokenPayload = getTokenPayload(request.cookies.jwt);
        const user = await getUserByName(tokenPayload.username);

        if (!user) return httpResponse401(response, Const.BAD_SESSION);
        if (user.productCount > 4) return httpResponse400(response, Const.LIMIT_OVER);

        const product = await createProduct(data.description, data.content, data.price, user);
        if (!product) return httpResponse400(response, Const.PRODUCT_EXISTS);

        await updateUser(user, {productCount: user.productCount+1});

        const processedProduct = await prepareProductToResponse(product, user);
        if (!processedProduct) return httpResponse500(response, Const.DB_REQUEST_ERROR);
        
        WebSocketController.update();
        response.status(201);

        return processedProduct;
    }

    @Authorized()
    @Post('/:pid/comment')
    async createComment(@Param('pid') pid: number, 
        @Body({ required: true }) data: CommentObject, 
        @Req() request: Request, @Res() response: Response) {
        if (checkCommentObject(data)) return httpResponse400(response);

        const tokenPayload = getTokenPayload(request.cookies.jwt);
        const user = await getUserByName(tokenPayload.username);
        const product = await getProductById(pid);

        if (!user) return httpResponse401(response, Const.BAD_SESSION);
        if (!product) return httpResponse400(response);

        const comment = await createComment(data.content, user, product);
        if (!comment) return httpResponse500(response);

        WebSocketController.update(product.id);
        response.status(201);

        return Const.COMMENT_SUCCESS;
    }

    @Authorized()
    @Put('/:pid/buy')
    async buyProduct(
        @Body({ required: true }) buyInfo: BuyObject,
        @Req() request: Request, @Res() response: Response) {
        if (checkBuyObject(buyInfo)) return httpResponse400(response);
        
        const tokenPayload = getTokenPayload(request.cookies.jwt);
        const user = await getUserByName(tokenPayload.username);
        
        if (!user) return httpResponse401(response, Const.BAD_SESSION);

        const product = await getProductById(buyInfo.pid);
        
        if (!product) return httpResponse400(response, Const.BAD_REQUEST);
        if (product.owner.id === user.id) return httpResponse400(response, Const.SELFBUY_ERROR);
        if (user.balance < product.price) return httpResponse400(response, Const.NOT_ENOUGH_MONEY);

        updateUser(product.owner, {balance: product.owner.balance + product.price})
            .then(() => {
                if (/^REASON: (([a-z])+.)+\s#([0-9])+$/.test(buyInfo.reason))
                    createComment(buyInfo.reason, user, product);
                
                updateUser(user, {balance: user.balance - product.price});
                updateProduct(product, {owner: user});
            })
            .then(() => WebSocketController.update(product.id));
        
        response.status(201);
        return Const.BUY_SUCCESS;
    }
}