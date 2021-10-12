import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { PaymentType } from '../entity/transaction';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { ForecastResponseDto } from '../model/forecast-response.dto';
import { TransactionRepository } from '../repository/transaction.repository';
import { UserRepository } from '../repository/user.repository';

@Service()
export class InformationForecastService {
    constructor() {}

    forecast = async (userId: number, currency: string, days: number, type: string) => {
        const transactionRepository = getCustomRepository(TransactionRepository);
        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne({ id: userId });

        if (!user) {
            throw new UserNotFoundError();
        }

        const lastNDaysTrx = await transactionRepository.getTransactionsByLastNDays(user, days, type);
        const forecastResponse: ForecastResponseDto = {};

        for ( const aggregatedTrx of lastNDaysTrx ) {
            forecastResponse.dates?.push(aggregatedTrx.date.toISOString());
            
            if ( type === PaymentType.PAYMENT_FILL.toString() ) {
                forecastResponse.payment_fill
            }
        }

        return lastNDaysTrx;
    }
}
