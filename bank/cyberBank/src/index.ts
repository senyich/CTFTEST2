import 'reflect-metadata';
import path from "path";
import express from 'express';
import http from 'http';
import { useExpressServer } from 'routing-controllers';

import { getControllersList } from "./utils";
import WebSocketController from './controller/webSocketController';
import Authorized from './security/validator';
import Env from "./env";


require('dotenv').config();

var cookieParser = require('cookie-parser');
var cors = require('cors')

const corsOption = {
    origin: Env.REACT_HOST,
    credentials: true
}

const app = express();
app.use(cookieParser());
app.use(cors(corsOption));

app.use("/public/images", express.static(path.join(__dirname, 'static/images')));

const server = http.createServer(app);
WebSocketController.init(server);

useExpressServer(app, {
    authorizationChecker: Authorized,
    controllers: getControllersList(),
});

const port = 37773;

server.listen(port, () => console.log(`Cyber Bank is running on port ${port}`));