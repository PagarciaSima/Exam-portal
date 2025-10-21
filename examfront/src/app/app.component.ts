import { Component } from '@angular/core';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  loading = false;

  constructor(private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe(val => this.loading = val);
  }
}
