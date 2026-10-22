import { Component, inject, signal, type OnInit } from '@angular/core';
import { ListAccounts, type Account } from '@universe/accounts';
import { ACCOUNT_REPOSITORY } from './account.providers';

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
})
export class AccountComponent implements OnInit {
  protected readonly accounts = signal<readonly Account[] | null>(null);
  protected readonly accountsError = signal(false);

  private readonly listAccounts = new ListAccounts(inject(ACCOUNT_REPOSITORY));

  async ngOnInit(): Promise<void> {
    try {
      this.accounts.set(await this.listAccounts.execute());
    } catch {
      this.accountsError.set(true);
    }
  }
}
