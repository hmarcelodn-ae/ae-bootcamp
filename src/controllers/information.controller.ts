import { NextFunction, Request, Response } from 'express';
import { query } from 'express-validator';
import { Service } from 'typedi';
import url from 'url';
import { ExchangeRateService } from '../application/exchange-rate.service';
import { InformationBalanceService } from '../application/information-balance.service';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation-request.middleware';
import { BaseController } from './base';

@Service()
export class InformationController extends BaseController {
    public path: string = '/information';

    constructor(
        protected readonly informationBalanceService: InformationBalanceService,
    ) {
        super();

        this.initializeRouter();
    }

    balance = async (req: Request, res: Response, next: NextFunction) => {
        const query = url.parse(req.url, true).query;
        const balance = await this.informationBalanceService.getBalance(
            req.currentUser!.uuid,
            query.currency!.toString(),
        );

        res.status(200).send({
            balance
        });

        next();
    }

    summary = (req: Request, res: Response, next: NextFunction) => {}

    series = (req: Request, res: Response, next: NextFunction) => {}
    
    forecast = (req: Request, res: Response, next: NextFunction) => {}

    protected initializeRouter(): void {
        this.router.get(
            `${this.path}/balance`,
            query('currency').exists().notEmpty(),
            authorize,
            validateRequest,
            this.balance
        );

        this.router.get(
            `${this.path}/summary`,
            this.summary
        );

        this.router.get(
            `${this.path}/series`,
            this.series
        );

        this.router.get(
            `${this.path}/forecast`,
            this.forecast
        );
    }    
}
