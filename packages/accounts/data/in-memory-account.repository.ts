import type { Account, AccountRepository } from '../domain';

export class InMemoryAccountRepository implements AccountRepository {
  private readonly accounts: readonly Account[];

  constructor(accounts: readonly Account[] = []) {
    this.accounts = accounts.map((account) => ({ ...account }));
  }

  async findAll(): Promise<readonly Account[]> {
    return this.accounts.map((account) => ({ ...account }));
  }
}
