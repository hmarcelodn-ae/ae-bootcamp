import { Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { User } from "../entity/user";
import { UserExistingError } from "../errors/user-existing.error";
import { UserSignupDto } from "../model/user-signup.dto";
import { UserRepository } from "../repository/user.repository";

@Service()
export class UserSignupService {
    constructor() {}

    signup = async (userSignupInput: UserSignupDto): Promise<User> => {
        const userRepository = getCustomRepository(UserRepository);
        const newUser = new User();
        newUser.email = userSignupInput.email;
        newUser.birthDate = new Date(userSignupInput.birth_date);
        newUser.firstName = userSignupInput.first_name;
        newUser.lastName = userSignupInput.last_name;
        newUser.password = userSignupInput.password;
        newUser.userIdentity = userSignupInput.id;

        if (await userRepository.findByEmail(userSignupInput.email)) {
            throw new UserExistingError();
        }
        
        return userRepository.save(newUser);
    }
}
