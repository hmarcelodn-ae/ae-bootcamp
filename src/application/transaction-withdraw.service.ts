import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { PaymentType, Transaction } from '../entity/transaction';
import { OutOfBalanceError } from '../errors/out-of-balance.error';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { TransactionRepository } from '../repository/transaction.repository';
import { UserRepository } from '../repository/user.repository';

@Service()
export class TransactionWithdrawService {
    withdraw = async (value: number, userId: number) => {
        const transactionRepository = getCustomRepository(TransactionRepository);
        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne({ id: userId });

        if (!user) {
            throw new UserNotFoundError();
        }

        const paymentFillTrx = await transactionRepository.getPaymentFillTransactions(user);
        const paymentMadeTrx = await transactionRepository.getPaymentMadeTransactions(user);
        const paymentReceivedTrx= await transactionRepository.getPaymentReceivedTransactions(user);
        const paymentWithdrawTrx = await transactionRepository.getPaymentWithdrawTransactions(user);

        const transactionReducer = (acc: number, current: Transaction) => { return acc + current.value };

        const fillTotal = paymentFillTrx.reduce(transactionReducer, 0);
        const madeTotal = paymentMadeTrx.reduce(transactionReducer, 0);
        const receivedTotal = paymentReceivedTrx.reduce(transactionReducer, 0);
        const withdrawTotal = paymentWithdrawTrx.reduce(transactionReducer, 0);

        const totalBalance = fillTotal - withdrawTotal - madeTotal + receivedTotal;

        if (value > totalBalance) {
            throw new OutOfBalanceError();
        }

        const newWithdrawTrx = new Transaction();
        newWithdrawTrx.user = user;
        newWithdrawTrx.value = value;
        newWithdrawTrx.type = PaymentType.PAYMENT_WITHDRAW;

        return transactionRepository.save(newWithdrawTrx);
    }
}
