import { Component } from '@angular/core';
import { Sidebard } from '../../components/sidebard/sidebard';
import { Cards } from '../../components/cards/cards';
import { ClaimTable } from '../../components/claim-table/claim-table';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebard, Cards, ClaimTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
