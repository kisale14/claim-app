import { ChangeDetectorRef, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { FormClaim } from '../form-claim/form-claim';
import { SearchClaim } from '../search-claim/search-claim';
import { ServicesClaim } from '../../services/services-claim.service';
import { combineLatest, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FilterServiceTable } from '../../services/filter-service.service';

@Component({
  selector: 'app-cards',
  imports: [
    CardModule,
    ChartModule,
    ButtonModule,
    FormClaim,
    SearchClaim,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {
  VisibilityForm: boolean = false;
  VisibilitySearch: boolean = false;
  data: any;
  dataBar: any;
  optionsBar: any;
  options: any;

  reclamoValue: string = '';
  documentoValue: string = '';

  // Inyecciones necesarias
  private platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  totalClaims$!: Observable<number>;
  pendingCount$!: Observable<number>;
  approvedCount$!: Observable<number>;
  rejectedCount$!: Observable<number>;

  constructor(
    private claimService: ServicesClaim,
    private filterService: FilterServiceTable,
  ) {}

  ngOnInit() {
    this.initChartBar();

    this.totalClaims$ = this.claimService.getTotalClaims();
    this.pendingCount$ = this.claimService.getPendingClaimsCount();
    this.approvedCount$ = this.claimService.getApprovedClaimsCount();
    this.rejectedCount$ = this.claimService.getRejectedClaimsCount();

    combineLatest([this.approvedCount$, this.rejectedCount$, this.pendingCount$]).subscribe(
      ([approved, rejected, pending]) => {
        this.initChart(approved, rejected, pending);
      },
    );
  }

  showForm() {
    this.VisibilityForm = true;
  }

  hideForm() {
    this.VisibilityForm = false;
  }

  showSearch() {
    this.VisibilitySearch = true;
  }

  hideSearch() {
    this.VisibilitySearch = false;
  }

  onReclamoChange(value: string) {
    this.filterService.setReclamo(value);
  }

  onReclamoStatus(value: string) {
    this.filterService.setStatus(value);
  }

  clearStatus() {
    this.filterService.clearStatus();
  }

  onDocumentoChange(value: string) {
    this.filterService.setDocumento(value);
  }

  initChart(approved: number, rejected: number, pending: number) {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
      const total = approved + rejected + pending;

      this.data = {
        labels: ['Procedentes', 'No Procedentes', 'Pendientes'],
        datasets: [
          {
            data: [approved, rejected, pending], // Usamos los valores dinámicos
            backgroundColor: [
              '#06b6d4', // Cyan para procedentes
              '#ef4444', // Red para no procedentes
              '#f59e0b', // Amber/Yellow para pendientes
            ],
            hoverBackgroundColor: ['#22d3ee', '#f87171', '#fbbf24'],
            borderWidth: 2,
            borderColor: documentStyle.getPropertyValue('--content-background') || '#ffffff',
          },
        ],
      };

      this.options = {
        cutout: '75%',
        plugins: {
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              color: textColor,
              padding: 20,
              font: { size: 14, weight: '500' },
            },
          },
          tooltip: {
            padding: 12,
            bodyFont: { size: 14 },
            callbacks: {
              label: (context: any) => {
                const value = context.raw;
                const percentage = ((value / total) * 100).toFixed(1);
                return ` ${context.label}: ${value} reclamos (${percentage}%)`;
              },
            },
          },
        },
        maintainAspectRatio: false,
      };

      this.cd.markForCheck();
    }
  }

  initChartBar() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
      const gridColor = documentStyle.getPropertyValue('--surface-border') || '#e2e8f0';

      this.dataBar = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Reclamos Gestionados',
            data: [245, 278, 312, 298, 256, 189, 112],
            backgroundColor: '#f97316', // Naranja principal (orange-500)
            hoverBackgroundColor: '#fb923c', // Naranja más claro al hover (orange-400)
            borderRadius: 6, // Bordes redondeados en las barras
            barPercentage: 0.6, // Ancho de las barras
            categoryPercentage: 0.8,
          },
        ],
      };

      this.optionsBar = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Ocultamos la leyenda porque es una sola serie
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f8fafc',
            bodyColor: '#f1f5f9',
            padding: 12,
            bodyFont: { size: 14 },
            callbacks: {
              label: (context: any) => {
                return `${context.raw} reclamos gestionados`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor,
              drawBorder: false,
            },
            ticks: {
              color: textColor,
              stepSize: 50,
              callback: (value: any) => value + '',
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
              font: {
                weight: '500',
              },
            },
          },
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
          },
        },
      };

      this.cd.markForCheck();
    }
  }
}
