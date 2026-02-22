import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-chat-modal',
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
],
  templateUrl: './chat-modal.html',
  styleUrl: './chat-modal.css',
})
export class ChatModal {
  @Input() VisibilityFile: boolean = false;
  @Output() visibleChangeFile = new EventEmitter<boolean>();

  closeForm() {
    this.VisibilityFile = false;
    this.visibleChangeFile.emit(false);
  }
}
