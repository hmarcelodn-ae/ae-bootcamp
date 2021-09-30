import 'reflect-metadata';
import 'express-async-errors';
import Container from 'typedi';
import { App } from './app';
import { UserController } from './controllers/user.controller';
import { PostgresClient } from './infrastructure/postgres-client.wrapper';

const postgresClient = Container.get(PostgresClient);

const app = new App(
    Number(process.env.PORT) || 3000,
    [
        Container.get(UserController)
    ]
);

(async () => await postgresClient.connect())();

(() => {
    app.listen();
})();

process.on('SIGTERM', () => {
    process.kill(process.pid);
});
