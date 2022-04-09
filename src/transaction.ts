import { v4 as uuidv4 } from 'uuid';

export default class Transaction {
  senderPublicKey: string;
  receiverPublicKey: string;
  amount: number;
  type: string;
  id: string;
  timestamp: number;
  signature: string;

  constructor(senderPublicKey: string, receiverPublicKey, amount: number, type: string) {
    this.senderPublicKey = senderPublicKey;
    this.receiverPublicKey = receiverPublicKey;
    this.amount = amount;
    this.type = type;
    this.id = this.createHexId();
    this.timestamp = Math.floor(Date.now()/1000);
    this.signature = '';
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
    }
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
    }
    return JSON.stringify(data);
  }

  equals(transaction: Transaction) {
    return this.id === transaction.id;
  }
}