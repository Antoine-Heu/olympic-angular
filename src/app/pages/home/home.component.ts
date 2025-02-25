import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | undefined> = of(undefined);
  public olympicData: any[] = [];
  public selectedCountry: any;

  view: [number, number] = [700, 400];
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Quantile,
    domain: ['#956065', '#793d52', '#89a1db', '#9780a1', '#bfe0f1', '#b8cbe7'],
  };
  gradient: boolean = false;
  labels: boolean = true;
  explodeSlices: boolean = false;
  animations: boolean = true;

  countriesCount: number = 0;

  constructor(
    private olympicService: OlympicService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((data) => {
      if (data) {
        this.olympicData = data.map((olympic) => {
          return {
            name: olympic.country,
            value: olympic.totalMedals,
          };
        });
      }
    });
    this.olympicService.getTotalCountries().subscribe((count) => {
      this.countriesCount = count;
    });
  }

  onSelect(event: any) {
    this.selectedCountry = event;
    this.router.navigate(['/details', event.name]);
  }
}
