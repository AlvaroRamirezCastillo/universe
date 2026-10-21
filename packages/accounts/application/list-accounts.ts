import type { Account, AccountRepository } from '../domain';

export class ListAccounts {
  constructor(private readonly repository: AccountRepository) {}

  execute(): Promise<readonly Account[]> {
    return this.repository.findAll();
  }
}
