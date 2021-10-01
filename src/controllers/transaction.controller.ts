import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { body, header } from 'express-validator';

import { BaseController } from './base';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation-request.middleware';
import { TransactionFillService } from '../application/transaction-fill.service';
import { TransactionWithdrawService } from '../application/transaction-withdraw.service';
import { TransactionPayService } from '../application/transaction-pay.service';

@Service()
export class TransactionController extends BaseController {
    public path: string = '/transactions';

    constructor(
        protected readonly transactionFillService: TransactionFillService,
        protected readonly transactionWithdrawService: TransactionWithdrawService,
        protected readonly transactionPayService: TransactionPayService,
    ) {
        super();

        this.initializeRouter();
    }

    fill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { value } = req.body;

        await this.transactionFillService.fill(value, req.currentUser!.uuid);

        res.status(201).send();

        next();
    }

    withdraw = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { value } = req.body;

        await this.transactionWithdrawService.withdraw(value, req.currentUser!.uuid);
        
        res.status(200).send();

        next();
    }

    pay = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {
            value,
            email,
        } = req.body;

        await this.transactionPayService.pay(value, req.currentUser!.uuid, email);

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
            body('value').exists().isNumeric(),
            header('authorization').exists(),
            authorize,
            validateRequest,
            this.withdraw
        );

        this.router.post(
            `${this.path}/pay`,
            body('value').exists().isNumeric().custom(value => {
                if (value <= 0) {
                    return Promise.reject('Payment should be greater than 0')
                }

                return true;
            }),
            body('email').exists().isEmail(),
            header('authorization').exists(),
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
