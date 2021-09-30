import { Service } from 'typedi';
import { BaseController } from './base';

@Service()
export class InformationController extends BaseController {
    public path: string = '';

    constructor() {
        super();

        this.initializeRouter();
    }
    
    protected initializeRouter(): void {
        // throw new Error("Method not implemented.");
    }    
}
