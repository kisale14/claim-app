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

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Gestor de Reclamos',
        root: true,
      },
    ];
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
