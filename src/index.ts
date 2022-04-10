import Wallet from './wallet';
import TransactionPool from './transaction-pool';
import Blockchain from './blockchain';
import { TransactionType } from './transaction';
import Block from './block';
import { hash } from './utils';


function processBlock(blockchain: Blockchain, pool: TransactionPool, forger: Wallet) {
  const coveredTransactions = blockchain.getCoveredTransactionSet(pool.transactions);
  const lastHash = hash(blockchain.blocks.at(-1).payload());
  const blockCount = blockchain.blocks.at(-1).blockCount + 1;

  const block = forger.createBlock(coveredTransactions, lastHash, blockCount);
  blockchain.addBlock(block);
}

async function main() {
  const blockchain = new Blockchain();
  const pool = new TransactionPool();

  const alice = new Wallet();
  const bob = new Wallet();

  const exchange = new Wallet();
  const forger = new Wallet();

  const aliceInitial = exchange.createTransaction(alice.publicKeyString(), 10, TransactionType.EXCHANGE);
  const bobInitial = exchange.createTransaction(bob.publicKeyString(), 10, TransactionType.EXCHANGE);

  if(!pool.transactionExists(aliceInitial)) pool.addTransaction(aliceInitial);
  if(!pool.transactionExists(bobInitial)) pool.addTransaction(bobInitial);

  processBlock(blockchain, pool, forger);

  pool.remove((pool.transactions));

  // alice wants to send 5 tokens to bob

  const transaction = alice.createTransaction(bob.publicKeyString(), 5, TransactionType.TRANSFER);

  if(!pool.transactionExists(transaction)) {
    pool.addTransaction(transaction);
  }

  processBlock(blockchain, pool, forger);
  pool.remove(pool.transactions);

  console.log(blockchain);

}

main().then(() => {});
