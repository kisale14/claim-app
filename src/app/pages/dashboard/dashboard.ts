import { Component } from '@angular/core';
import { Sidebard } from '../../components/sidebard/sidebard';
import { Cards } from '../../components/cards/cards';
import { ClaimTable } from '../../components/claim-table/claim-table';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebard, Cards, ClaimTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(public layoutService : LayoutService) {}
}
