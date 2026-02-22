import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Gestor de Reclamos',
        root: true,
      },
    ];
  }

  toggleSidebar() {
    this.layoutService.toggleMenu();
  }


}
