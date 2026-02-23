import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CardModule } from 'primeng/card';
import { LayoutService } from '../../services/layout.service';
import { ExportarExcel } from '../../services/exportar-excel.service';

@Component({
  selector: 'app-sidebard',
  imports: [
    AvatarModule,
    ButtonModule,
    MegaMenuModule,
    RippleModule,
    CommonModule,
    ToggleSwitchModule,
    FormsModule,
    CardModule,
  ],
  templateUrl: './sidebard.html',
  styleUrl: './sidebard.css',
})
export class Sidebard {
  items: MegaMenuItem[] | undefined;
  checked: boolean = false;
  isCollapsed = false;
  private readonly STORAGE_KEY = 'sidebar_collapsed';
  activeDropdown: string | null = null;
  dropdownTimeout: any;
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  datosReclamos = [
    {
      reclamo: 'REC-001',
      cliente: 'Juan Pérez',
      documento: '12345678',
      status: 'Activo',
      fecha: new Date(),
    },
    {
      reclamo: 'REC-002',
      cliente: 'María Gómez',
      documento: '87654321',
      status: 'Pendiente',
      fecha: new Date(),
    },
    {
      reclamo: 'REC-003',
      cliente: 'Carlos López',
      documento: '11223344',
      status: 'Completado',
      fecha: new Date(),
    },
  ];

  filtrosActuales = {
    reclamo: 'REC',
    status: 'Activo',
  };

  constructor(
    public layoutService: LayoutService,
    private exportarService: ExportarExcel,
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Gestor de Reclamos',
        root: true,
      },
    ];
  }

  async exportarReclamos() {
    try {
      // Opción 1: Exportar reclamos con formato especial
      await this.exportarService.exportarTablaReclamos(this.datosReclamos, this.filtrosActuales);

      // Opción 2: Exportar datos genéricos
      // await this.exportarService.exportarDatos(
      //   this.datosReclamos,
      //   'reclamos',
      //   'Reporte de Reclamos'
      // );
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  }

  // Métodos
  toggleDropdown(event: MouseEvent, dropdown: string): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
      this.activeDropdown = null;
    }
  }

  openDropdown(dropdown: string): void {
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
    this.activeDropdown = dropdown;
  }

  closeDropdown(dropdown: string): void {
    this.dropdownTimeout = setTimeout(() => {
      if (this.activeDropdown === dropdown) {
        this.activeDropdown = null;
      }
    }, 200);
  }

  toggleSidebar() {
    this.layoutService.toggleMenu();
  }
}
