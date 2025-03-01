import { Component, OnInit, OnDestroy } from '@angular/core';
import { take, Subscription } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.subscription = this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
