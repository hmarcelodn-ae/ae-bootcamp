import { Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { PaymentType, Transaction } from "../entity/transaction";
import { User } from "../entity/user";
import { TransactionRepository } from "../repository/transaction.repository";
import { UserRepository } from "../repository/user.repository";

@Service()
export class TransactionFillService {
    fill = async (value: number, userId: number): Promise<void> => {
        const userRepository = getCustomRepository(UserRepository);
        const transactionRepository = getCustomRepository(TransactionRepository);

        const user = await userRepository.findOne({ id: userId });

        if (!user) {
            throw new Error();
        }

        const transaction = new Transaction();
        transaction.type = PaymentType.PAYMENT_FILL;
        transaction.value = value;
        transaction.user = user;

        await transactionRepository.save(transaction);
    }
}