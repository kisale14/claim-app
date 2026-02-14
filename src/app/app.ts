import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dashboard } from './pages/dashboard/dashboard';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('claim-app');
}
