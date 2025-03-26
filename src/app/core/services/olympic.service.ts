import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private readonly olympicUrl = './assets/mock/olympic.json';
  private countryColorMap: { [key: string]: string } = {};

  private olympics$ = new BehaviorSubject<Olympic[] | undefined>(undefined);

  constructor(
    private http: HttpClient
  ) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((olympics) => {
        olympics.forEach(olympic => {
          this.getMedalsCountByCountry(olympic);
        });
      this.olympics$.next(olympics);
    }),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next(undefined);
        return caught;
      })
    );
  }

  getOlympics(): Observable<Olympic[] | undefined> {
    return this.olympics$.asObservable();
  }

  getMedalsCountByCountry(olympic: Olympic): number {
    return olympic.participations.reduce((sum, p) => sum + p.medalsCount, 0);
  }

  getOlympicCountry(countryName: string): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      map((data) => data?.find((o) => o.country === countryName))
    );
  }

  getCountryChartData(countryName: string): Observable<CountryChartData[]> {
    return this.getOlympicCountry(countryName).pipe(
      map((country) =>
        country
          ? country.participations.map((p) => ({
              year: p.year.toString(),
              medals: p.medalsCount,
            }))
          : []
      )
    );
  }

  getTotalCountries(): Observable<number> {
    return this.olympics$.pipe(
      map((olympics) => (olympics ? olympics.length : 0))
    );
  }

  getAthleteCount(countryName: string): Observable<number> {
    return this.getOlympicCountry(countryName).pipe(
      map((country) =>
        country ? country.participations.reduce((sum, p) => sum + p.athleteCount, 0) : 0
      )
    );
  }

  getMedalsCount(countryName: string): Observable<number> {
    return this.getOlympicCountry(countryName).pipe(
      map((country) =>
        country ? country.participations.reduce((sum, p) => sum + p.medalsCount, 0) : 0
      )
    );
  }

  getEntriesCount(countryName: string): Observable<number> {
    return this.getOlympicCountry(countryName).pipe(
      map((country) => (country ? country.participations.length : 0))
    );
  }

  getCountryColor(country: string): string {
    const colors = [
      '#956065',
      '#793d52',
      '#89a1db',
      '#9780a1',
      '#bfe0f1',
    ];
    if (!this.countryColorMap[country]) {
      const assignedColors = Object.values(this.countryColorMap);
      const availableColors = colors.filter(color => !assignedColors.includes(color));
  
      if (availableColors.length > 0) {
        this.countryColorMap[country] = availableColors[0];
      } else {
        let hash = 0;
        for (let i = 0; i < country.length; i++) {
          hash = country.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        this.countryColorMap[country] = colors[index];
      }
    }
    return this.countryColorMap[country];
  }
}

export interface CountryChartData {
  year: string;
  medals: number;
}

