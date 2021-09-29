import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { body, validationResult } from 'express-validator';
import { BaseController } from './base';

@Service()
export class UserController extends BaseController {
    public path: string = '/user';

    constructor() {
        super();

        this.initializeRouter();
    }

    signup = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            first_name,
            last_name,
            id,
            birth_date,
            email,
            password
        } = req.body;

        res.status(201).send();

        return next();
    }

    protected initializeRouter = (): void => {
        this.router.post(
            `${this.path}/signup`,
            body('first_name').notEmpty(),
            body('last_name').notEmpty(),
            body('id').notEmpty(),
            body('birth_date').notEmpty().isDate(),
            body('email').notEmpty().isEmail(),
            body('password').notEmpty(),
            this.signup
        );
    }
}
