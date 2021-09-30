import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import jwt from 'jsonwebtoken';

import { GENERAL } from '../infrastructure/constants';
import { NotAuthorizedError } from '../errors/not-authorized.error';
import { TokenBlackListRepository } from '../repository/token-black-list.repository';

export const authorize = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const tokenBlackListRepository = getCustomRepository(TokenBlackListRepository);

    if (!req.headers.authorization) {
        throw new NotAuthorizedError();
    }

    const token = req.headers.authorization.toString();

    if (await tokenBlackListRepository.getToken(token)) {
        throw new NotAuthorizedError();
    }

    try {
        jwt.verify(token, GENERAL.ENCRYPTION_TOKEN);
    } catch(err) {
        throw new NotAuthorizedError();
    }

    next();
}
