import TransactionPool from './transaction-pool';

export default class Block {
  transactions: TransactionPool;
  lastHash: string;
  forger: string;
  blockCount: number;
  timestamp: number;
  signature: string;

  constructor(transactions: TransactionPool, lastHash: string, forger: string, blockCount: number) {
    this.transactions = transactions;
    this.lastHash = lastHash;
    this.forger = forger;
    this.blockCount = blockCount;
    this.timestamp = Math.floor(Date.now() / 1000);
    this.signature = '';
  }

  public static genesis() {
    const genesisBlock = new Block(new TransactionPool(), 'genesisHash', 'genesis', 0);
    genesisBlock.timestamp = 0;
    return genesisBlock;
  }

  toString() {
    return JSON.stringify({
      transactions: this.transactions.toString(),
      lastHash: this.lastHash,
      forger: this.forger,
      blockCount: this.blockCount,
      timestamp: this.timestamp,
      signature: this.signature,
    });
  }

  payload() {
    return JSON.stringify({
      transactions: this.transactions.toString(),
      lastHash: this.lastHash,
      forger: this.forger,
      blockCount: this.blockCount,
      timestamp: this.timestamp,
    });
  }

  sign(signature: string) {
    this.signature = signature;
  }
}
