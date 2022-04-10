export default class AccountModel {
  accounts: string[];
  balances: Map<string, number>;

  constructor() {
    this.accounts = [];
    this.balances = new Map();
  }

  addAccount(publicKey: string) {
    if (!this.accounts.includes(publicKey)) {
      this.accounts.push(publicKey);
      this.balances.set(publicKey, 0);
    }
  }

  getBalance(publicKey: string): number {
    if(!this.accounts.includes(publicKey)) {
      this.addAccount(publicKey);
    }
    return this.balances.get(publicKey)
  }

  updateBalance(publicKey: string, amount: number) {
    if(!this.accounts.includes(publicKey)) {
      this.addAccount(publicKey);
    }

    const current = this.balances.get(publicKey);
    this.balances.set(publicKey, current + amount);
  }


}