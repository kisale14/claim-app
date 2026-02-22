import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-chat-modal',
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    BadgeModule,
    FileUploadModule,
    ProgressBarModule,
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
