import 'reflect-metadata';
import 'express-async-errors';
import Container from 'typedi';
import cron from 'node-cron';
import { App } from './app';
import { UserController } from './controllers/user.controller';
import { PostgresClient } from './infrastructure/postgres-client.wrapper';
import { TransactionController } from './controllers/transaction.controller';
import { InformationController } from './controllers/information.controller';

const postgresClient = Container.get(PostgresClient);

const app = new App(
    Number(process.env.PORT) || 3000,
    [
        Container.get(UserController),
        Container.get(TransactionController),
        Container.get(InformationController),
    ]
);

(async () => await postgresClient.connect())();

(() => {
    app.listen();
})();

// const exchangeRateJob = cron.schedule('00 00 00 * * *', () => {
//     console.log('Running');
// });

// exchangeRateJob.start();

process.on('SIGTERM', () => {
    process.kill(process.pid);
    // exchangeRateJob.destroy();
});
