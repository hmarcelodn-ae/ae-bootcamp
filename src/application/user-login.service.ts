import { getCustomRepository } from 'typeorm';
import * as CryptoJS from 'crypto-js';

import { UserLoginDto } from '../model/user-login.dto';
import { UserRepository } from '../repository/user.repository';
import * as jwt from 'jsonwebtoken';
import { InvalidUsernamePasswordError } from '../errors/user-invalid-username-password.error';

export class UserLoginService {
    constructor() {}

    login = async (model: UserLoginDto) => {
        const userRepository = getCustomRepository(UserRepository);
        const user = await userRepository.findByEmail(model.email);

        if (!user) {
            throw new InvalidUsernamePasswordError();
        }

        const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'AgileEngineBootcamp');

        if (model.password !== decryptedPassword.toString(CryptoJS.enc.Utf8)) {
            throw new InvalidUsernamePasswordError();
        }

        const payload = {
            email: user.email,
            uuid: user.id,
        };

        const token = jwt.sign(payload, '', {
            expiresIn: 1
        });
    };
}
