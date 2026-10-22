import { Component, signal } from '@angular/core';
import { AccountComponent } from './account/account';

@Component({
  imports: [AccountComponent, AccountComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular');
}
