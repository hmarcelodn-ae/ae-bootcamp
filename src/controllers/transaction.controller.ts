import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';

import { BaseController } from './base';
import { authorize } from '../middlewares/authorize.middleware';

@Service()
export class TransactionController extends BaseController {
    public path: string = '/transactions';

    constructor() {
        super();

        this.initializeRouter();
    }

    fill = (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send();

        next();
    }

    protected initializeRouter(): void {
        this.router.post(
            `${this.path}/fill`,
            authorize,
            this.fill
        );
    }
}
