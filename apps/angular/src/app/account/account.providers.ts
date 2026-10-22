import { InjectionToken } from '@angular/core';
import { AxiosAccountRepository, type AccountRepository } from '@universe/accounts';
import { environment } from '../../environments/environment';

export const ACCOUNT_REPOSITORY = new InjectionToken<AccountRepository>('ACCOUNT_REPOSITORY', {
  providedIn: 'root',
  factory: () => new AxiosAccountRepository(environment.apiBaseUrl),
});
