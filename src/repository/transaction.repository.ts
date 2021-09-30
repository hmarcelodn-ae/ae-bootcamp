import { EntityRepository, Repository } from "typeorm";
import { Transaction } from "../entity/transaction";
import { User } from "../entity/user";

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
    getTransactionsByUserId(user: User): Promise<Array<Transaction>> {
        return this.find({ user: user });
    }
}