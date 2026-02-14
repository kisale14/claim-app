import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

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
  ],
  templateUrl: './claim-table.html',
  styleUrl: './claim-table.css',
})
export class ClaimTable {}
