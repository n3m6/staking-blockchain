import TransactionPool from './transaction-pool';
import Wallet from './wallet';
import Blockchain from './blockchain';
import Socket from './socket';
import NodeApi from './node-api';
import Transaction, { TransactionType } from './transaction';

export interface TransactionPayload {
  senderPublicKey: string,
  receiverPublicKey: string,
  amount: number,
  type: string,
  id: string,
  timestamp: number,
  signature: TransactionType,
}

export default class Node {
  pool: TransactionPool;
  wallet: Wallet;
  blockchain: Blockchain;
  ip: string;
  port: string;
  p2p: Socket;
  api: NodeApi;

  constructor(ip: string, port: string, httpPort: string) {
    this.pool = new TransactionPool();
    this.wallet = new Wallet();
    this.blockchain = new Blockchain();
    this.ip = ip;
    this.port = port;
    this.p2p = new Socket(this.ip, this.port);
    this.api = new NodeApi(httpPort, this);
  }

  handleTransaction(transaction: TransactionPayload) {
    const signature = transaction.signature;
    const signerPublicKey = transaction.senderPublicKey;
    const tx = Transaction.create(transaction);
    const signatureValid = Wallet.signatureIsValid(tx.payload(), signature, signerPublicKey);
    const transactionExists = this.pool.transactionExists(tx);

    console.log(`Transaction Exists: ${transactionExists}`);
    console.log(`Signature Valid?: ${signatureValid}`);

    if (!transactionExists && signatureValid) {
      this.pool.addTransaction(tx);
    }
  }


  async startP2P() {
    await this.p2p.start();
    await this.api.start();
  }

}