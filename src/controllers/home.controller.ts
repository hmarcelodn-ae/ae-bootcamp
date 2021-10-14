import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import { BaseController } from "./base";

@Service()
export class HomeController extends BaseController {
    public path: string = '/';

    constructor() {
        super();

        this.initializeRouter();
    }

    home = (req: Request, res: Response, next: NextFunction) => {
        res.render('pages/home');
        next();
    }

    protected initializeRouter(): void {
        this.router.get('/', this.home)
    }
    
}