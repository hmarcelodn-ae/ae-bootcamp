import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { body, header, validationResult } from 'express-validator';

import { BaseController } from './base';
import { UserLoginService } from '../application/user-login.service';
import { UserSignupService } from '../application/user-signup.service';
import { RequestValidationError } from '../errors/request-validation.error';
import { UserLogoutService } from '../application/user-logout.service';

@Service()
export class UserController extends BaseController {
    public path: string = '/user';

    constructor(
        protected readonly userSignupService: UserSignupService,
        protected readonly userLoginService: UserLoginService,
        protected readonly userLogoutService: UserLogoutService,
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

        return next();
    }

    signin = async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }

        const token = await this.userLoginService.login(req.body);

        res.status(200).send(token);

        return next();
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }

        await this.userLogoutService.logout(req.headers.authorization!);

        res.status(200).send();

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

        this.router.post(
            `${this.path}/login`,
            body('email').notEmpty().isEmail(),
            body('password').notEmpty(),
            this.signin
        )

        this.router.post(
            `${this.path}/logout`,
            header('Authorization').exists(),
            this.logout
        )
    }
}
