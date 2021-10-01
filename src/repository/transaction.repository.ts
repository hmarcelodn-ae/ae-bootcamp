import { EntityRepository, Repository } from 'typeorm';
import { PaymentType, Transaction } from '../entity/transaction';
import { User } from '../entity/user';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
    getTransactionsByUserId(user: User): Promise<Array<Transaction>> {
        return this.find({ user });
    }

    getPaymentReceivedTransactions(user: User) {
        return this.find({ user: user, type: PaymentType.PAYMENT_RECEIVED });
    }

    getPaymentMadeTransactions(user: User) {
        return this.find({ user: user, type: PaymentType.PAYMENT_MADE });
    }

    getPaymentWithdrawTransactions(user: User) {
        return this.find({ user: user, type: PaymentType.PAYMENT_WITHDRAW });
    }

    getPaymentFillTransactions(user: User) {
        return this.find({ user: user, type: PaymentType.PAYMENT_FILL });
    }
}
