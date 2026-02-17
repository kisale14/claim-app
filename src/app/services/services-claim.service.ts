import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
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

  // Método para obtener el total de reclamos
  getTotalClaims(): Observable<number> {
    return this.claims$.pipe(map((claims) => claims.length));
  }

  // Método para obtener el número de reclamos pendientes (status = 1)
  getPendingClaimsCount(): Observable<number> {
    return this.claims$.pipe(map((claims) => claims.filter((claim) => claim.status === 1).length));
  }

  // Método para obtener el número de reclamos aprobados (status = 2)
  getApprovedClaimsCount(): Observable<number> {
    return this.claims$.pipe(map((claims) => claims.filter((claim) => claim.status === 2).length));
  }

  // Método para obtener el número de reclamos rechazados (status = 3)
  getRejectedClaimsCount(): Observable<number> {
    return this.claims$.pipe(map((claims) => claims.filter((claim) => claim.status === 3).length));
  }

  saveFormattedClaim(formattedClaim: Claim): { success: boolean; error?: string } {
    try {
      const currentClaims = this.claimsSubject.value;
      const updatedClaims = [...currentClaims, formattedClaim];

      // Validación mínima
      if (!formattedClaim.id) {
        return { success: false, error: 'El claim no tiene ID' };
      }

      this.claimsSubject.next(updatedClaims);
      return { success: true }; // Solo éxito, sin mensaje
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  formatClaimObject(claimData: any): {
    claim: Claim;
    result: { success: boolean; error?: string };
  } {
    const claim = new Claim();

    // Asignaciones directas
    claim.id = claimData.id || this.generateId();
    claim.claimNumber = claimData.claimNumber || `CLM-${Date.now()}`;
    claim.creationDate = claimData.creationDate || new Date();
    claim.status = 1;
    claim.statusName = 'Pendiente';
    claim.name = claimData.name || '';
    claim.identification = claimData.identification || '';
    claim.phone = claimData.phone || '';
    claim.dateOfIncident = claimData.dateOfIncident || claimData.date || new Date();
    claim.mount = claimData.mount || '0';
    claim.userCreation = claimData.userCreation || 1;

    // Guardar y devolver TODO: claim + resultado
    const result = this.saveFormattedClaim(claim);

    return { claim, result };
  }

  filterClaims(filterData: {
    claimNumber?: string;
    name?: string;
    identification?: string;
  }): Observable<Claim[]> {
    return this.claims$.pipe(
      map((claims) => {
        return claims.filter((claim) => {
          let matches = true;

          // Filtrar por número de reclamo (si se proporciona)
          if (filterData.claimNumber) {
            matches =
              matches &&
              claim.claimNumber.toLowerCase().includes(filterData.claimNumber.toLowerCase());
          }

          // Filtrar por nombre (si se proporciona)
          if (filterData.name) {
            matches = matches && claim.name.toLowerCase().includes(filterData.name.toLowerCase());
          }

          // Filtrar por identificación (si se proporciona)
          if (filterData.identification) {
            matches = matches && claim.identification.includes(filterData.identification);
          }

          return matches;
        });
      }),
    );
  }

  getClaimById(id: number): Observable<Claim | undefined> {
    // Si los claims ya están cargados, buscamos directamente en el BehaviorSubject
    if (this.claimsSubject.value.length > 0) {
      const claim = this.claimsSubject.value.find((c) => c.id === id);
      return of(claim);
    }

    // Si no hay claims cargados, primero los cargamos y luego buscamos
    return this.getClaims().pipe(map((claims) => claims.find((c) => c.id === id)));
  }

  updateClaimStatus(
    id: number,
    statusId: number,
  ): { success: boolean; error?: string; claim?: Claim } {
    try {
      const currentClaims = this.claimsSubject.value;

      // Buscar el índice del reclamo por ID
      const claimIndex = currentClaims.findIndex((claim) => claim.id === id);

      // Validar que el reclamo existe
      if (claimIndex === -1) {
        return {
          success: false,
          error: `No se encontró el reclamo con ID: ${id}`,
        };
      }

      // Validar que el statusId sea válido (1, 2 o 3)
      if (![1, 2, 3].includes(statusId)) {
        return {
          success: false,
          error: `Status inválido: ${statusId}. Debe ser 1 (Pendiente), 2 (Aprobado) o 3 (Rechazado)`,
        };
      }

      // Crear una copia actualizada del reclamo
      const updatedClaim = {
        ...currentClaims[claimIndex],
        status: statusId,
        statusName: this.getStatusName(statusId),
      };

      // Crear un nuevo array con el reclamo actualizado
      const updatedClaims = [...currentClaims];
      updatedClaims[claimIndex] = updatedClaim;

      // Actualizar el BehaviorSubject
      this.claimsSubject.next(updatedClaims);

      console.log(
        `✅ Reclamo ID ${id} actualizado a status ${statusId} (${this.getStatusName(statusId)})`,
      );

      return {
        success: true,
        claim: updatedClaim,
      };
    } catch (error) {
      console.error('❌ Error al actualizar reclamo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al actualizar',
      };
    }
  }

  /**
   * Método auxiliar para obtener el nombre del status
   */
  private getStatusName(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Aprobado';
      case 3:
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  }

  private loadClaims(): void {
    this.http
      .get<Claim[]>(this.dataClaimUrl)
      .pipe(
        tap((claims) => {
          console.log(`✅ Datos cargados: ${claims.length} reclamos`);
        }),
        catchError((error) => {
          console.error('❌ Error al cargar los reclamos:', error);

          return of([] as Claim[]);
        }),
      )
      .subscribe((claims) => {
        this.claimsSubject.next(claims);
      });
  }

  private generateId(): number {
    const currentClaims = this.claimsSubject.value;
    if (currentClaims.length === 0) return 1;
    const maxId = Math.max(...currentClaims.map((claim) => claim.id));
    return maxId + 1;
  }
}
