import { EntityRepository, LessThan, MoreThan, Repository } from 'typeorm';
import { PaymentType, Transaction } from '../entity/transaction';
import { User } from '../entity/user';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
    getTransactionsByUserId(user: User): Promise<Array<Transaction>> {
        return this.find({ user });
    }

    getPaymentTransactions = (user: User, type: PaymentType) => {
        return this.find({ user, type });
    }

    getTransactionsByPeriod = (user: User, startDate: Date, endDate: Date, type: PaymentType) => {
        return this.find({
            where: {
                user: user,
                date: MoreThan(startDate) && LessThan(endDate),
                type: type
            }
        });
    }
}
