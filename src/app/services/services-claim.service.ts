import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Claim } from '../../model/claim';

@Injectable({
  providedIn: 'root',
})
export class ServicesClaim {
  api = '';
  header: HttpHeaders;
  private dataClaimUrl = `${environment.apiURL}claim.json`;

  private claimsSubject = new BehaviorSubject<Claim[]>([]);

  public claims$ = this.claimsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.header = new HttpHeaders();
  }

  getClaims(): Observable<Claim[]> {
    if (this.claimsSubject.value.length === 0) {
      this.loadClaims();
    }
    return this.claims$;
  }

  private loadClaims(): void{
    this.http.get<Claim[]>(this.dataClaimUrl).pipe(
      tap(claims => {
        console.log(`✅ Datos cargados: ${claims.length} reclamos`);
      }),
      catchError(error => {
        console.error('❌ Error al cargar los reclamos:', error);

        return of([] as Claim[])
      })
    ).subscribe(claims => {
      this.claimsSubject.next(claims);
    });
  }
}
