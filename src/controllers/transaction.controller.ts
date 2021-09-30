import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { body, header } from 'express-validator';

import { BaseController } from './base';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation-request.middleware';
import { TransactionFillService } from '../application/transaction-fill.service';

@Service()
export class TransactionController extends BaseController {
    public path: string = '/transactions';

    constructor(
        protected readonly transactionFillService: TransactionFillService
    ) {
        super();

        this.initializeRouter();
    }

    fill = async (req: Request, res: Response, next: NextFunction) => {
        const { value } = req.body;

        await this.transactionFillService.fill(value, req.currentUser!.uuid);

        res.status(201).send();

        next();
    }

    withdraw = (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send();

        next();
    }

    pay = (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send();

        next();
    }

    get = (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send();

        next();
    }

    protected initializeRouter(): void {
        this.router.post(
            `${this.path}/fill`,
            body('value').exists().isNumeric(),
            header('authorization').exists(),
            authorize,
            validateRequest,
            this.fill
        );

        this.router.post(
            `${this.path}/withdraw`,
            authorize,
            validateRequest,
            this.withdraw
        );

        this.router.post(
            `${this.path}/pay`,
            authorize,
            validateRequest,
            this.pay
        );

        this.router.get(
            `${this.path}`,
            authorize,
            validateRequest,
            this.get
        );
    }
}
