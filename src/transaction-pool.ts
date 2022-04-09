import Transaction from "./transaction";

export default class TransactionPool {
  transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  transactionExists(transaction: Transaction): boolean {
    return this.transactions.findIndex((tx) => tx.id === transaction.id) >= 0;
  }

}