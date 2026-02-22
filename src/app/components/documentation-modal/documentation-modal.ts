import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-documentation-modal',
  imports: [DialogModule, ButtonModule, CommonModule, CheckboxModule, FormsModule],
  templateUrl: './documentation-modal.html',
  styleUrl: './documentation-modal.css',
})
export class DocumentationModal {
  @Input() VisibilityDocumentation: boolean = false;
  @Output() visibleChangeDocumentation = new EventEmitter<boolean>();

  selectedCategories: any[] = [];
  categories: any[] = [
    { key: 'certificacion', name: 'CERTIFICACION DE EXPEDIENTE DE RECLAMOS Y QUEJAS' },
    { key: 'formulario', name: 'FORMULARIO DE RECLAMO' },
    { key: 'carta_dictamen', name: 'CARTA DE DICTAMEN' },
    { key: 'correo_credicard', name: 'CORREO DE GESTION CREDICARD' },
    { key: 'correo_operaciones', name: 'CORREO DE GESTION OPERACIONES' },
    { key: 'correo_notificacion', name: 'CORREO DE NOTIFICACION AL CLIENTE' },
  ];

  ngOnInit() {
    // Seleccionar el segundo elemento por defecto (índice 1) - 'FORMULARIO DE RECLAMO'
    this.selectedCategories = [this.categories[1]];
  }

  closeForm() {
    this.VisibilityDocumentation = false;
    this.visibleChangeDocumentation.emit(false);
  }
}
