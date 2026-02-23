import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterServiceTable {
  private reclamoSource = new BehaviorSubject<string>('');
  private documentoSource = new BehaviorSubject<string>('');

  reclamo$ = this.reclamoSource.asObservable();
  documento$ = this.documentoSource.asObservable();

  setReclamo(value: string) {
    this.reclamoSource.next(value);
  }

  setDocumento(value: string) {
    this.documentoSource.next(value);
  }
}
