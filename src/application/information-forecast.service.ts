import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { PaymentType } from '../entity/transaction';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { ForecastInputDto } from '../model/forecast-input.dto';
import { ForecastResponseDto } from '../model/forecast-response.dto';
import { TransactionRepository } from '../repository/transaction.repository';
import { UserRepository } from '../repository/user.repository';
import { ExchangeRateService } from './exchange-rate.service';

@Service()
export class InformationForecastService {
    constructor(
        protected readonly exchangeRateService: ExchangeRateService
    ) {}

    forecast = async (userId: number, forecastInput: ForecastInputDto) => {
        const transactionRepository = getCustomRepository(TransactionRepository);
        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne({ id: userId });

        if (!user) {
            throw new UserNotFoundError();
        }

        const exchangeRate = await this.exchangeRateService.getExchangeRate(forecastInput.currency);
        const lastNDaysTrx = await transactionRepository.getTransactionsByLastNDays(user, forecastInput.days, forecastInput.type);
        const forecastResponse: ForecastResponseDto = {
            dates: []
        };

        for ( const aggregatedTrx of lastNDaysTrx ) {
            forecastResponse.dates!.push(aggregatedTrx.date.toString());
            const totalAmount = exchangeRate.rate * aggregatedTrx.amount;

            if ( forecastInput.type === PaymentType.PAYMENT_FILL.toString() ) {
                forecastResponse.payment_fill = [totalAmount];
            }

            if ( forecastInput.type === PaymentType.PAYMENT_MADE.toString() ) {
                forecastResponse.payment_made = [totalAmount];
            }

            if ( forecastInput.type === PaymentType.PAYMENT_RECEIVED.toString() ) {
                forecastResponse.payment_received = [totalAmount];
            }

            if ( forecastInput.type === PaymentType.PAYMENT_WITHDRAW.toString() ) {
                forecastResponse.payment_withdraw = [totalAmount];
            }
        }

        return forecastResponse;
    }
}
