import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  public olympics$: Observable<Olympic[] | undefined> = of(undefined);
  public olympicData: any[] = [];
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0.4,
      },
    },
    scales: {
      y: {
        position: 'left',
        beginAtZero: true,
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
    this.route.paramMap.subscribe(params => {
      const country = params.get('country');
      if (country) {
        this.countryName = country;
        this.loadCountryData(country);
      }
    });
  //   this.olympics$ = this.olympicService.getOlympics();
  //   this.olympics$.subscribe((data) => {
  //     if (data) {
  //       this.olympicData = data.map((olympic) => {
  //         return {
  //           athletes: olympic.athleteCount,
  //           entries: olympic.entries,
  //         };
  //       });
  //     }
  //   });
  }

  loadCountryData(country: string): void {
    this.olympicService.getCountryChartData(country).subscribe(data => {
      if (data.length > 0) {
        this.lineChartData = {
          labels: data.map(d => d.year),
          datasets: [
            {
              data: data.map(d => d.medals),
              label: `Médailles de ${country}`,
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: 'rgba(75,192,192,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(75,192,192,1)',
              fill: 'origin',
            },
          ],
        };

        this.chart?.update();
      }
    });
  }

  goHome() {
    this.router.navigateByUrl('');
  }
}
