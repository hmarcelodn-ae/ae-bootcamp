import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { TransactionService } from '../domain/transaction.service';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UserRepository } from '../repository/user.repository';

@Service()
export class InformationBalanceService {
    constructor(
        protected readonly transactionService: TransactionService
    ) {}

    getBalance = async (userId: number): Promise<number> => {
        const userRepository = getCustomRepository(UserRepository);
        const user = await userRepository.findOne({ id: userId });

        if (!user) {
            throw new UserNotFoundError();
        }

        const userBalance = await this.transactionService.getBalance(user);

        return userBalance;
    }
}
