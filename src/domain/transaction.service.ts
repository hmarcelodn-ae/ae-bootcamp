import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { Transaction } from '../entity/transaction';
import { User } from '../entity/user';
import { TransactionRepository } from '../repository/transaction.repository';

@Service()
export class TransactionService {
    getBalance = async (user: User): Promise<number> => {
        const transactionRepository = getCustomRepository(TransactionRepository);
        
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

        return totalBalance;
    }
}
