import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

// type tableau Olympic ou undefined
  private olympics$ = new BehaviorSubject<Olympic[] | undefined>(undefined);
  private participations$ = new BehaviorSubject<Participation[] | undefined>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    // get le tableau olympic
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((olympics) => {
        olympics.forEach(olympic => {
          olympic.totalMedals = this.getMedalsCountByCountry(olympic);
          olympic.athleteCount = this.getathleteCountByCountry(olympic);
        });
      this.olympics$.next(olympics);
    }),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(undefined);
        return caught;
      })
    );
  }

  // ajout observable
  getOlympics(): Observable<Olympic[] | undefined> {
    return this.olympics$.asObservable();
  }
  // toute les fonctions doivent être implémentées ici
  getMedalsCountByCountry(olympic: Olympic): number {
    return olympic.participations.reduce((sum, p) => sum + p.medalsCount, 0);
  }

  getOlympicCountry(countryName: string): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      map((data) => data?.find((o) => o.country === countryName))
    );
  }

  getCountryChartData(countryName: string): Observable<any[]> {
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

  getathleteCountByCountry(olympic: Olympic): number {
    return olympic.participations.reduce((sum, p) => sum + p.athleteCount, 0);
  }
}
