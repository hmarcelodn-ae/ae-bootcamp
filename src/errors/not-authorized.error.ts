import { CustomError } from './custom.error';

export class NotAuthorizedError extends CustomError {
    statusCode: number = 401;

    constructor() {
        super();

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{
            message: 'User is not authorized.'
        }];
    }
    
}