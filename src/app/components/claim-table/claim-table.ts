import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ServicesClaim } from '../../services/services-claim.service';
import { Observable } from 'rxjs';
import { Claim } from '../../../model/claim';
import { ButtonModule } from 'primeng/button';
import { FormClaim } from '../form-claim/form-claim';
import { TooltipModule } from 'primeng/tooltip';
import { FileModal } from '../file-modal/file-modal';

@Component({
  selector: 'app-claim-table',
  imports: [
    TableModule,
    MultiSelectModule,
    FormsModule,
    CommonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    FormClaim,
    TooltipModule,
    FileModal,
  ],
  templateUrl: './claim-table.html',
  styleUrl: './claim-table.css',
})
export class ClaimTable {
  claim$: Observable<Claim[]>;
  claimId: number = 0;
  VisibilityForm: boolean = false;
  VisibilityFile: boolean = false;

  @ViewChild('dt') dt!: Table;

  constructor(private servicesClaim: ServicesClaim) {
    this.claim$ = this.servicesClaim.getClaims();
  }

  ngOnInit() {
    this.claim$.subscribe();
  }

  showForm() {
    this.VisibilityForm = true;
  }

  showFile() {
    this.VisibilityFile = true;
    console.log(this.VisibilityForm);
  }

  hideFile() {
    this.VisibilityFile = false;
  }

  hideForm() {
    this.VisibilityForm = false;
  }

  selectedClaim(idClaim: number) {
    this.claimId = idClaim;
    this.showForm();
  }
}
