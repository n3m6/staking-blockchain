import TransactionPool from './transaction-pool';
import Wallet from './wallet';
import Blockchain from './blockchain';
import Socket from './socket';
import NodeApi from './node-api';
import Transaction from './transaction';

interface TransactionPayload {
  data: string;
  signature: string;
  senderPublicKey: string;
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
    const signatureValid = Wallet.signatureIsValid(transaction.data, signature, signerPublicKey);
    const tx = Transaction.create(JSON.parse(transaction.data));
    const transactionExists = this.pool.transactionExists(tx);
    if (transactionExists && signatureValid) {
      this.pool.addTransaction(tx);
    }
  }


  async startP2P() {
    await this.p2p.start();
    await this.api.start();
  }

}