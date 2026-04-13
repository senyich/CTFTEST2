import WebSocket from 'ws';
import http from 'http';
import Const from '../strings';

import { getUserById, getProducts, getProductById } from '../db/service';
import { deleteField, prepareProductsToResponse, prepareProductToResponse, 
    socketErrorMessage } from '../utils';


class WebSocketController {
    static wss: WebSocket.Server | null = null;
    
    static init(server: http.Server) : void {
        const wss = new WebSocket.Server({ server });

        wss.on('connection', (ws: WebSocket) => {
            console.log(Const.SOCKET_CONNECT);

            const interval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) ws.ping();
            }, 30000);

            ws.on('message', async (message: string) => {
                const userId = JSON.parse(message).uid;
                if (!userId) {
                    ws.send(socketErrorMessage(Const.BAD_REQUEST));
                    return;
                };

                const user = await getUserById(userId);
                if (!user) {
                    ws.send(socketErrorMessage(Const.USER_NOT_FOUND));
                    return;
                };

                ws.send(JSON.stringify({
                    type: 'user',
                    message: deleteField(user, 'password'),
                }));

                const pid = JSON.parse(message).pid;
                if (pid) {
                    const product = await getProductById(pid);
                    if (!product) {
                        ws.send(socketErrorMessage(Const.PRODUCT_NOT_FOUND));
                        return;
                    };

                    const processedProduct = await prepareProductToResponse(product, user);
                    if (!processedProduct) {
                        ws.send(socketErrorMessage(Const.DB_REQUEST_ERROR));
                        return;
                    };
    
                    ws.send(JSON.stringify({
                        type: 'product',
                        message: processedProduct,
                    }));
                }
                else {
                    const products = await getProducts();
                    if (!products) {
                        ws.send(socketErrorMessage(Const.DB_REQUEST_ERROR));
                        return;
                    };

                    const processedProducts = await prepareProductsToResponse(products, user);
                    if (!processedProducts) {
                        ws.send(socketErrorMessage(Const.DB_REQUEST_ERROR));
                        return;
                    };
    
                    ws.send(JSON.stringify({
                        type: 'products',
                        message: processedProducts,
                    }));
                };
            });

            ws.on('close', () => {
                clearInterval(interval);
                console.log(Const.SOCKET_DISCONNECT);
            });

            ws.on('ping', () => ws.pong());
        })

        WebSocketController.wss = wss;
        console.log(Const.SOCKET_SERVER_RUNNING);
    }

    static update(pid?: number) : void {
        if (!WebSocketController.wss) return;

        WebSocketController.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN)
                client.send(JSON.stringify({
                    type: 'update',
                    pid: pid
                }));
        });
    }
}

export default WebSocketController;