import { Generated, getCustomRepository } from 'typeorm';
import { Service } from 'typedi';
import * as CryptoJS from 'crypto-js';
import * as jwt from 'jsonwebtoken';

import { UserLoginDto } from '../model/user-login.dto';
import { TokenResponseDto } from '../model/token-response.dto';
import { UserRepository } from '../repository/user.repository';
import { InvalidUsernamePasswordError } from '../errors/user-invalid-username-password.error';
import { GENERAL } from '../infrastructure/constants';
import { TokenBlackListRepository } from '../repository/token-black-list.repository';

@Service()
export class UserLoginService {
    constructor() {}

    login = async (model: UserLoginDto): Promise<TokenResponseDto> => {
        const userRepository = getCustomRepository(UserRepository);        
        const user = await userRepository.findByEmail(model.email);

        if (!user) {
            throw new InvalidUsernamePasswordError();
        }

        const decryptedPassword = CryptoJS.AES.decrypt(user.password, GENERAL.ENCRYPTION_TOKEN);

        if (model.password !== decryptedPassword.toString(CryptoJS.enc.Utf8)) {
            throw new InvalidUsernamePasswordError();
        }

        const payload = {
            email: user.email,
            uuid: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.userIdentity
        };

        const token = jwt.sign(payload, GENERAL.EXPIRATION_KEY, {
            expiresIn: GENERAL.EXPIRATION_KEY
        });

        return {
            token
        };
    };
}
