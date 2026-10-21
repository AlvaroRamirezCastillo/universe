import type { Account } from './account';

export interface AccountRepository {
  findAll(): Promise<readonly Account[]>;
}
