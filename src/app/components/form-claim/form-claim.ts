import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-form-claim',
  imports: [DialogModule, ButtonModule],
  templateUrl: './form-claim.html',
  styleUrl: './form-claim.css',
})
export class FormClaim {
  @Input() VisibilityForm: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  visible: boolean = false;

  closeForm() {
    this.visibleChange.emit(false);
  }
}
