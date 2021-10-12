import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { body, header } from 'express-validator';

import { BaseController } from './base';
import { UserLoginService } from '../application/user-login.service';
import { UserSignupService } from '../application/user-signup.service';
import { UserLogoutService } from '../application/user-logout.service';
import { validateRequest } from '../middlewares/validation-request.middleware';

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
        const user = await this.userSignupService.signup(req.body);

        res.status(201).send(user);

        return next();
    }

    signin = async (req: Request, res: Response, next: NextFunction) => {
        const token = await this.userLoginService.login(req.body);

        res.status(200).send(token);

        return next();
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
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
            validateRequest,
            this.signup
        );

        this.router.post(
            `${this.path}/login`,
            body('email').notEmpty().isEmail(),
            body('password').notEmpty(),
            validateRequest,
            this.signin
        )

        this.router.post(
            `${this.path}/logout`,
            header('Authorization').exists(),
            validateRequest,
            this.logout
        )
    }
}
