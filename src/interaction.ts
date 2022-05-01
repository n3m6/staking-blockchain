import Wallet from './wallet';
import { TransactionType } from './transaction';
import axios from 'axios';

async function main() {
  try {
    const bob = new Wallet();
    const alice = new Wallet();

    const exchange = new Wallet();

    const tx = exchange.createTransaction(alice.publicKeyString(), 10, TransactionType.EXCHANGE);

    const url = 'http://localhost:5000/transaction';
    const payload = {
      transaction: tx.toString(),
    };

    const request = await axios.post(url, payload);
    console.log(`Request status: ${request.status} -> ${request.statusText}`);
    console.log(request.data);
  } catch (err) {
    console.log(err);
  }
}

main().then();