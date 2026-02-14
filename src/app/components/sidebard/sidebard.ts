import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ThemeService } from '../../services/theme-service';

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
  ],
  templateUrl: './sidebard.html',
  styleUrl: './sidebard.css',
})
export class Sidebard {
  items: MegaMenuItem[] | undefined;
  checked: boolean = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.checked = this.themeService.isDarkMode();
    this.items = [
      {
        label: 'Gestor de Reclamos',
        root: true,
      },
    ];
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    // Actualizar el estado del switch después de cambiar el tema
    this.checked = this.themeService.isDarkMode();
  }
}
