import Transaction from './transaction';
import Wallet from "./wallet";
import {transcode} from "buffer";

async function main() {
  const sender = 'sender';
  const receiver = 'receiver';
  const amount = 1;
  const type = 'TRANSFER';

  const wallet = new Wallet();

  const transaction = wallet.createTransaction(receiver, amount, type);

  console.log(transaction.toString());

  const signatureStatus = Wallet.signatureIsValid(transaction.payload(), transaction.signature, wallet.publicKeyString());

  console.log(signatureStatus);

}

main().then(() => {})