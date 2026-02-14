import { ChangeDetectorRef, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cards',
  imports: [CardModule, ChartModule, ButtonModule],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {
  data: any;
  options: any;

  // Inyecciones necesarias
  private platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef); // Lo necesitas para el markForCheck()

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';

      this.data = {
        labels: ['Procedentes', 'No Procedentes', 'Pendientes'],
        datasets: [
          {
            data: [540, 325, 702],
            backgroundColor: [
              '#06b6d4', // Cyan
              '#ef4444', // Red (un rojo más moderno)
              '#f59e0b', // Amber/Yellow
            ],
            hoverBackgroundColor: ['#22d3ee', '#f87171', '#fbbf24'],
            borderWidth: 2, // Añade separación entre los segmentos
            borderColor: documentStyle.getPropertyValue('--content-background') || '#ffffff',
          },
        ],
      };

      this.options = {
        cutout: '75%', // Esto lo convierte en una "dona" elegante
        plugins: {
          legend: {
            display: false,
            position: 'bottom', // Leyendas abajo para dar más espacio
            labels: {
              usePointStyle: true,
              color: textColor,
              padding: 20, // Espacio entre leyenda y gráfico
              font: { size: 14, weight: '500' },
            },
          },
          tooltip: {
            padding: 12,
            bodyFont: { size: 14 },
            callbacks: {
              // Un toque pro: añadir el símbolo de porcentaje o unidad
              label: (context: any) => ` ${context.label}: ${context.raw} reclamos`,
            },
          },
        },
        maintainAspectRatio: false,
      };

      this.cd.markForCheck();
    }
  }
}
