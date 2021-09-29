import 'reflect-metadata';
import Container from 'typedi';
import { App } from './app';
import { UserController } from './controllers/user.controller';

const app = new App(
    Number(process.env.PORT) || 3000,
    [
        Container.get(UserController)
    ]
);

app.listen();
