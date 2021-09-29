import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { body, validationResult } from 'express-validator';
import { BaseController } from './base';
import { UserSignupService } from '../application/user-signup.service';
import { RequestValidationError } from '../errors/request-validation.error';

@Service()
export class UserController extends BaseController {
    public path: string = '/user';

    constructor(
        protected readonly userSignupService: UserSignupService
    ) {
        super();

        this.initializeRouter();
    }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
           throw new RequestValidationError(errors.array());
        }

        const user = await this.userSignupService.signup(req.body);

        res.status(201).send(user);
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
