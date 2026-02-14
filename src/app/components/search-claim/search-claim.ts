import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-search-claim',
  imports: [DialogModule, ButtonModule],
  templateUrl: './search-claim.html',
  styleUrl: './search-claim.css',
})
export class SearchClaim {
  @Input() VisibilityForm: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  visible: boolean = false;

  closeForm() {
    this.visibleChange.emit(false);
  }
}
