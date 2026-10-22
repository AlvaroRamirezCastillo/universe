import { TestBed } from '@angular/core/testing';
import { InMemoryAccountRepository } from '@universe/accounts';
import { ACCOUNT_REPOSITORY } from './account/account.providers';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: ACCOUNT_REPOSITORY,
          useValue: new InMemoryAccountRepository([
            { id: 'account-1', name: 'Ana Torres', email: 'ana@example.com' },
            { id: 'account-2', name: 'Luis Ramos', email: 'luis@example.com' },
          ]),
        },
      ],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, angular');
  });

  it('should render accounts from the shared package', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const accounts = compiled.querySelector('[aria-labelledby="accounts-title"]');

    expect(accounts?.textContent).toContain('Ana Torres');
    expect(accounts?.textContent).toContain('luis@example.com');
  });
});
