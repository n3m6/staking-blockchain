import Wallet from "./wallet";
import TransactionPool from "./transaction-pool";

async function main() {
  const sender = 'sender';
  const receiver = 'receiver';
  const amount = 1;
  const type = 'TRANSFER';

  const wallet = new Wallet();

  const transaction = wallet.createTransaction(receiver, amount, type);

  console.log(transaction.toString());


  const pool = new TransactionPool();

  if (!pool.transactionExists(transaction)) pool.addTransaction(transaction);
  if (!pool.transactionExists(transaction)) pool.addTransaction(transaction);

  console.log(pool.transactions.length);

}

main().then(() => {})