import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
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
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  countriesCount: number = 0;
  JOsCount: number = 0;

  public olympics$: Observable<Olympic[] | undefined> = of(undefined);
  public olympicData: { name: string; value: number }[] = [];
  public selectedCountry: string = '';

  view: [number, number] = [window.innerWidth * 1, 400];
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.view = [window.innerWidth * 0.8, 400];
  }
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [],
  };
  gradient: boolean = false;
  labels: boolean = true;
  explodeSlices: boolean = false;
  animations: boolean = true;


  constructor(
    private olympicService: OlympicService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.subscription.add(
      this.olympics$.subscribe((data) => {
        if (data) {
          this.olympicData = data.map((olympic) => {;
            return {
              name: olympic.country,
              value: this.olympicService.getMedalsCountByCountry(olympic)
            };
          });
          this.colorScheme.domain = data.map(o => this.olympicService.getCountryColor(o.country));
        }
      })
    );
    this.subscription.add(
      this.olympicService.getTotalCountries().subscribe((count) => {
        this.countriesCount = count;
      })
    );
    this.subscription.add(
      this.olympicService.getTotalOlympics().subscribe((count) => {
        this.JOsCount = count;
      })
    );
  }

  onSelect(olympic: { name: string, value: number }): void {
    this.selectedCountry = olympic.name;
    this.router.navigate(['/details', olympic.name]);
  }

  customTooltipText({ data }: { data: { name: string; value: number } }): string {
    return `${data.name}<br><strong>🏅${data.value}</strong>`;
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
}
