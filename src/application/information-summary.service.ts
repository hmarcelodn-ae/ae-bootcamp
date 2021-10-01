import { Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { TransactionService } from "../domain/transaction.service";
import { PaymentType } from "../entity/transaction";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { TransactionRepository } from "../repository/transaction.repository";
import { UserRepository } from "../repository/user.repository";
import { ExchangeRateService } from "./exchange-rate.service";

@Service()
export class InformationSummaryService {

    constructor(
        protected readonly transactionService: TransactionService,
        protected readonly exchangeRateService: ExchangeRateService,
    ) {}

    summary = async (userId: number, startDate: Date, endDate: Date, currency: string) => {
        const transactionRepository = getCustomRepository(TransactionRepository);
        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne({ id: userId });

        if (!user) {
            throw new UserNotFoundError();
        }

        let filledAmount = await this.transactionService.getTransactionsAmountByPeriod(user, startDate, endDate, PaymentType.PAYMENT_FILL);
        let madeAmount = await this.transactionService.getTransactionsAmountByPeriod(user, startDate, endDate, PaymentType.PAYMENT_MADE);
        let receivedAmount = await this.transactionService.getTransactionsAmountByPeriod(user, startDate, endDate, PaymentType.PAYMENT_RECEIVED);
        let withdrawAmount = await this.transactionService.getTransactionsAmountByPeriod(user, startDate, endDate, PaymentType.PAYMENT_WITHDRAW);

        filledAmount = await this.exchangeRateService.convert(filledAmount, currency);
        madeAmount = await this.exchangeRateService.convert(madeAmount, currency);
        receivedAmount = await this.exchangeRateService.convert(receivedAmount, currency);
        withdrawAmount = await this.exchangeRateService.convert(withdrawAmount, currency);

        return {
            payments_received: receivedAmount,
            payments_made: madeAmount,
            withdrawn: withdrawAmount,
            filled: filledAmount
        };
    }
}
