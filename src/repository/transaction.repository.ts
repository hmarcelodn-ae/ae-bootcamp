import { EntityRepository, Repository } from "typeorm";
import { Transaction } from "../entity/transaction";

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
    
}