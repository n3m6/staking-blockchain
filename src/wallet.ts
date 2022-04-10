import { createSign, createVerify, generateKeyPairSync, KeyPairKeyObjectResult } from 'crypto';
import { hash } from './utils';
import Transaction, { TransactionType } from './transaction';
import TransactionPool from './transaction-pool';
import Block from './block';

export default class Wallet {
  keyPair: KeyPairKeyObjectResult;

  constructor() {
    this.keyPair = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
  }

  publicKeyString(): string {
    return this.keyPair.publicKey
      .export({
        type: 'pkcs1',
        format: 'pem',
      })
      .toString();
  }

  sign(data: string): string {
    const dataHash = hash(data);
    const sign = createSign('SHA256');
    sign.write(dataHash);
    sign.end();
    return sign.sign(this.keyPair.privateKey, 'hex');
  }

  public static signatureIsValid(data: string, signature: string, publicKeyString: string) {
    const dataHash = hash(data);
    const verify = createVerify('SHA256');
    verify.write(dataHash);
    verify.end();
    return verify.verify(publicKeyString, signature, 'hex');
  }

  public createTransaction(receiverPublicKey: string, amount: number, type: TransactionType) {
    const transaction = new Transaction(this.publicKeyString(), receiverPublicKey, amount, type);
    const signature = this.sign(transaction.payload());
    transaction.sign(signature);

    return transaction;
  }

  public createBlock(transactions: TransactionPool, lastHash: string, blockCount: number) {
    const block = new Block(transactions, lastHash, this.publicKeyString(), blockCount);
    const signature = this.sign(block.payload());
    block.sign(signature);
    return block;
  }
}
