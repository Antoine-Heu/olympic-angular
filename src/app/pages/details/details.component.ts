import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
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
}
