import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { ChartConfiguration, ChartType } from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
  ],
})
export class DetailsComponent implements OnInit {
  countryName: string = '';
  athleteCount: number = 0;
  medalsCount: number = 0;
  entriesCount: number = 0;

  private subscription: Subscription = new Subscription();

  public olympics$: Observable<Olympic[] | undefined> = of(undefined);
  public olympicData: { athletes: number; entries: number }[] = [];
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0,
      },
    },
    scales: {
      y: {
        position: 'left',
        beginAtZero: true,
        min: 0,
        max: 140,
      },
    },
    plugins: {
      legend: { display: true },
    },
  };
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe(params => {
      const country = params.get('country');
      if (country) {
        this.countryName = country;
        this.loadCountryData(country);
        this.loadCountryStats(country);
      }
    });
  }
  
  loadCountryData(country: string): void {
    this.subscription = this.olympicService.getCountryChartData(country).subscribe(data => {
      if (data && data.length > 0) {
        const borderColor = this.olympicService.getCountryColor(country);
        this.lineChartData = {
          labels: data.map(d => d.year),
          datasets: [
            {
              data: data.map(d => d.medals),
              label: `Medals for ${country}`,
              backgroundColor: 'rgba(255,255,255,0)',
              borderColor: borderColor,
              pointBackgroundColor: 'rgba(0,0,0,1)',
              pointBorderColor: 'rgba(0,0,0,1)',
              pointHoverBackgroundColor: borderColor,
              pointHoverBorderColor: borderColor,
              fill: 'origin',
            },
          ],
        };

        this.chart?.update();
      // } else {
      //   this.router.navigate(['/not-found']);
      }
    });
  }

  loadCountryStats(country: string): void {
    this.subscription = this.olympicService.getAthleteCount(country).subscribe(athletes => {
      this.athleteCount = athletes;
    });
    this.subscription = this.olympicService.getMedalsCount(country).subscribe(medals => {
      this.medalsCount = medals;
    });
    this.subscription = this.olympicService.getEntriesCount(country).subscribe(entries => {
      this.entriesCount = entries;
    });
  }

  goHome() {
    this.router.navigateByUrl('');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
