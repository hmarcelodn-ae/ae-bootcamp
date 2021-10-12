import { NextFunction, Request, Response } from 'express';
import { query } from 'express-validator';
import { Service } from 'typedi';
import url from 'url';
import { InformationBalanceService } from '../application/information-balance.service';
import { InformationForecastService } from '../application/information-forecast.service';
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
        protected readonly informationForecastService: InformationForecastService,
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
    
    forecast = async (req: Request, res: Response, next: NextFunction) => {
        const query = url.parse(req.url, true).query;
        const {
            currency,
            days,
            type
        } = query;

        const forecast = await this.informationForecastService.forecast(
            req.currentUser!.uuid,
            currency!.toString(),
            Number(days),
            type!.toString()
        );

        res.status(200).send(forecast);

        next();
    }

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
            query('currency').exists().notEmpty(),
            query('days').exists().notEmpty(),
            query('type').exists().notEmpty().custom((value) => {
                const allowedValues = [
                    'payment_fill',
                    'payment_withdraw',
                    'payment_made',
                    'payment_received'
                ];

                if (allowedValues.indexOf(value) === -1) {
                    Promise.reject('type is invalid. It can be: payment_fill, payment_withdraw, payment_made, payment_received ');
                }

                return true;
            }),
            authorize,
            validateRequest,
            this.forecast
        );
    }    
}
