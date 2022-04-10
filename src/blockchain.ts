import Block from './block';
import { hash } from './utils';
import AccountModel from './account-model';
import Transaction, { TransactionType } from './transaction';
import TransactionPool from './transaction-pool';

export default class Blockchain {
  blocks: Block[];
  accountModel: AccountModel;

  constructor() {
    this.blocks = [];
    this.blocks.push(Block.genesis());
    this.accountModel = new AccountModel();
  }

  addBlock(block: Block) {
    this.executeTransactions(block.transactions);
    this.blocks.push(block);
  }

  toString(): string[] {
    return this.blocks.map((block) => block.toString());
  }

  isBlockCountValid(block: Block) {
    return this.blocks.at(-1).blockCount === block.blockCount - 1;
  }

  isLastBlockHashValid(block: Block) {
    const lastHash = hash(this.blocks.at(-1).payload());
    return lastHash === block.lastHash;
  }

  isTransactionCovered(transaction: Transaction) {
    if (transaction.type === TransactionType.EXCHANGE) return true;

    const senderBalance = this.accountModel.getBalance(transaction.senderPublicKey);

    return senderBalance >= transaction.amount;
  }

  getCoveredTransactionSet(transactions: Transaction[]): TransactionPool {
    const pool = new TransactionPool();
    for (let tx of transactions) {
      if (this.isTransactionCovered(tx)) pool.addTransaction(tx);
    }
    return pool;
  }

  executeTransactions(pool: TransactionPool) {
    for (let tx of pool.transactions) {
      this.executeTransaction(tx);
    }
  }

  executeTransaction(transaction: Transaction) {
    const sender = transaction.senderPublicKey;
    const receiver = transaction.receiverPublicKey;
    const amount = transaction.amount;

    this.accountModel.updateBalance(sender, -amount);
    this.accountModel.updateBalance(receiver, +amount);
  }
}
