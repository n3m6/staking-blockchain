import Transaction from './transaction';

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

  toString() {
    return this.transactions.map((tx) => tx.toString());
  }

  remove(transactions: Transaction[]) {
    const newPool: Transaction[] = [];
    for(let tx of transactions) {
      if (!this.transactions.includes(tx)) newPool.push(tx);
    }
    this.transactions = newPool;
  }
}
