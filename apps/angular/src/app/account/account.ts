import { Component, signal, type OnInit } from '@angular/core';
import {
  demoAccounts,
  InMemoryAccountRepository,
  ListAccounts,
  type Account,
} from '@universe/accounts';

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
})
export class AccountComponent implements OnInit {
  protected readonly accounts = signal<readonly Account[] | null>(null);
  protected readonly accountsError = signal(false);

  private readonly listAccounts = new ListAccounts(
    new InMemoryAccountRepository(demoAccounts),
  );

  async ngOnInit(): Promise<void> {
    try {
      this.accounts.set(await this.listAccounts.execute());
    } catch {
      this.accountsError.set(true);
    }
  }
}
