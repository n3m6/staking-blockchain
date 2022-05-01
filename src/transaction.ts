import { v4 as uuidv4 } from 'uuid';
import { TransactionPayload } from './node';

export enum TransactionType {
  EXCHANGE = 'EXCHANGE',
  TRANSFER = 'TRANSFER',
}

export default class Transaction {
  senderPublicKey: string;
  receiverPublicKey: string;
  amount: number;
  type: TransactionType;
  id: string;
  timestamp: number;
  signature: string;

  constructor(senderPublicKey: string, receiverPublicKey, amount: number, type: TransactionType) {
    this.senderPublicKey = senderPublicKey;
    this.receiverPublicKey = receiverPublicKey;
    this.amount = amount;
    this.type = type;
    this.id = this.createHexId();
    this.timestamp = Math.floor(Date.now() / 1000);
    this.signature = '';
  }

  static create(payload: TransactionPayload) {
    const transaction = new Transaction(
      payload.senderPublicKey,
      payload.receiverPublicKey,
      payload.amount,
      payload.type as TransactionType,
    );
    transaction.id = payload.id;
    transaction.signature = payload.signature;
    transaction.timestamp = payload.timestamp;

    return transaction;
  }

  createHexId() {
    const buffer = Buffer.alloc(16);
    uuidv4({}, buffer);
    return buffer.toString('hex');
  }

  sign(signature: string) {
    this.signature = signature;
  }

  toString() {
    const data = {
      senderPublicKey: this.senderPublicKey,
      receiverPublicKey: this.receiverPublicKey,
      amount: this.amount,
      type: this.type,
      id: this.id,
      timestamp: this.timestamp,
      signature: this.signature,
    };
    return JSON.stringify(data);
  }

  payload() {
    const data = {
      senderPublicKey: this.senderPublicKey,
      receiverPublicKey: this.receiverPublicKey,
      amount: this.amount,
      type: this.type,
      id: this.id,
      timestamp: this.timestamp,
    };
    return JSON.stringify(data);
  }

  equals(transaction: Transaction) {
    return this.id === transaction.id;
  }
}
