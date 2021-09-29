import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { BaseController } from './controllers/base';

export class App {
    public app: Application;
    public port: number;

    constructor(
        port: number,
        controllers: Array<BaseController>
    ) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    listen = () => {
        this.app.listen(this.port, () => {
            console.log(`AgileEngine Bootcamp Wallet running at ${this.port}...`);
        });
    }

    protected initializeMiddlewares = (): void => {
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(cors())
    }

    protected initializeControllers = (controllers: Array<BaseController>): void => {
        controllers.map((controller: BaseController) => {
           this.app.use('/', controller.router); 
        });
    }
}