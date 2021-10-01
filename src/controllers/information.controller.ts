import { NextFunction, Request, Response } from 'express';
import { query } from 'express-validator';
import { Service } from 'typedi';
import url from 'url';
import { ExchangeRateService } from '../application/exchange-rate.service';
import { InformationBalanceService } from '../application/information-balance.service';
import { InformationSeriesService } from '../application/information-series.service';
import { InformationSummaryService } from '../application/information-summary.service';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation-request.middleware';
import { BaseController } from './base';

@Service()
export class InformationController extends BaseController {
    public path: string = '/information';

    constructor(
        protected readonly informationBalanceService: InformationBalanceService,
        protected readonly informationSummaryService: InformationSummaryService,
        protected readonly informationSeriesService: InformationSeriesService,
    ) {
        super();

        this.initializeRouter();
    }

    balance = async (req: Request, res: Response, next: NextFunction) => {
        const query = url.parse(req.url, true).query;
        const balance = await this.informationBalanceService.getBalance(
            req.currentUser!.uuid,
            query.currency!.toString().toUpperCase(),
        );

        res.status(200).send({
            balance
        });

        next();
    }

    summary = async (req: Request, res: Response, next: NextFunction) => {
        const query = url.parse(req.url, true).query;
        const {
            start_date,
            end_date,
            currency
        } = query;
        
        const summary = await this.informationSummaryService.summary(
            req.currentUser!.uuid,  
            new Date(start_date!.toString()), 
            new Date(end_date!.toString()), 
            currency!.toString().toUpperCase()
        );

        res.status(200).send(summary);

        next();
    }

    series = async (req: Request, res: Response, next: NextFunction) => {
        const query = url.parse(req.url, true).query;
        const {
            start_date,
            end_date,
            currency
        } = query;

        const series = await this.informationSeriesService.series(
            req.currentUser!.uuid,
            new Date(start_date!.toString()), 
            new Date(end_date!.toString()), 
            currency!.toString().toUpperCase()
        );

        res.status(200).send(series);

        next();
    }
    
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
            query('currency').exists().notEmpty(),
            query('start_date').exists().isDate(),
            query('end_date').exists().isDate(),
            authorize,
            validateRequest,
            this.summary
        );

        this.router.get(
            `${this.path}/series`,
            query('currency').exists().notEmpty(),
            query('start_date').exists().isDate(),
            query('end_date').exists().isDate(),
            authorize,
            validateRequest,
            this.series
        );

        this.router.get(
            `${this.path}/forecast`,
            this.forecast
        );
    }    
}
