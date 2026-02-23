import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ServicesClaim } from '../../services/services-claim.service';
import { Observable, Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { FormClaim } from '../form-claim/form-claim';
import { TooltipModule } from 'primeng/tooltip';
import { FileModal } from '../file-modal/file-modal';
import { claimModel } from '../../../model/claimModel';
import { BadgeModule } from 'primeng/badge';
import { FormatoMontoPipe } from '../../pipes/formato-monto-pipe';
import { PdfGeneratorService } from '../../services/pdf-generator-service.service';
import { ChatModal } from '../chat-modal/chat-modal';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DocumentationModal } from '../documentation-modal/documentation-modal';
import { FilterServiceTable } from '../../services/filter-service.service';

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
    BadgeModule,
    FormatoMontoPipe,
    ChatModal,
    SplitButtonModule,
    DocumentationModal,
  ],
  templateUrl: './claim-table.html',
  styleUrl: './claim-table.css',
})
export class ClaimTable {
  claim$: Observable<claimModel[]>;
  claimId: number = 0;
  VisibilityForm: boolean = false;
  VisibilityFile: boolean = false;
  VisibilityChat: boolean = false;
  VisibilityDocumentation: boolean = false;
  idClaim: number = 0;

  private subscription!: Subscription;

  items: any[] = [];

  @ViewChild('dt') dt!: Table;

  constructor(
    private servicesClaim: ServicesClaim,
    private pdfGeneratorService: PdfGeneratorService,
    private filterService: FilterServiceTable,
  ) {
    this.claim$ = this.servicesClaim.getClaims();
  }

  ngOnInit() {
    this.claim$.subscribe();
    this.items = [
      { label: 'Aprobar', icon: 'pi pi-check', command: () => this.updateClaimStatus(2) },
      { label: 'Rechazar', icon: 'pi pi-times', command: () => this.updateClaimStatus(3) },
    ];

    this.subscription = this.filterService.reclamo$.subscribe((value) => {
      if (this.dt) {
        this.dt.filterGlobal(value, 'contains');
      }
    });

    this.subscription = this.filterService.status$.subscribe((value) => {
      console.log('Filtrando status:', value);
      if (this.dt) {
        this.dt.filter(value, 'status', 'contains');
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showid(id: number) {
    this.idClaim = id;
  }

  updateClaimStatus(status: number) {
    this.servicesClaim.updateClaimStatus(this.idClaim, status);
  }

  getItems(claim: any) {
    return [
      {
        label: 'Aprobar',
        icon: 'pi pi-check',
        command: () => console.log(claim),
      },
      {
        label: 'Rechazar',
        icon: 'pi pi-times',
        command: () => console.log(claim),
      },
    ];
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

  showChat() {
    this.VisibilityChat = true;
  }

  showDocumentation() {
    this.VisibilityDocumentation = true;
  }

  selectedClaim(idClaim: number) {
    this.claimId = idClaim;
    this.showForm();
  }

  exportPdfClaim(claim: claimModel) {
    this.pdfGeneratorService.exportarFormatoPDFPrueba(claim);
  }
}
