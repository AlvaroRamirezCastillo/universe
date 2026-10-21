import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountComponent } from './account/account';

@Component({
  imports: [RouterOutlet, AccountComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular');
}
