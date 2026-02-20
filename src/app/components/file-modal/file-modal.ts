import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUpload } from 'primeng/fileupload';

interface FileWithPreview extends File {
  objectURL?: string;
}

@Component({
  selector: 'app-file-modal',
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    BadgeModule,
    FileUploadModule,
    ProgressBarModule,
  ],
  templateUrl: './file-modal.html',
  styleUrl: './file-modal.css',
})
export class FileModal {
  @Input() VisibilityFile: boolean = false;
  @Output() visibleChangeFile = new EventEmitter<boolean>();

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  selectedFiles: File[] = [];
  uploadedFiles: File[] = [];

  // Verificar si es imagen
  // Verificar si es imagen
  isImage(file: FileWithPreview): boolean {
    return file.type?.startsWith('image/');
  }

  // Manejar selección de archivos
  onFileSelect(event: any) {
    // Convertir FileList a array y agregar a selectedFiles
    const newFiles: FileWithPreview[] = Array.from(event.files).map((file: any) => {
      // Crear un objeto que extienda File con objectURL
      const fileWithPreview = file as FileWithPreview;
      fileWithPreview.objectURL = URL.createObjectURL(file);
      return fileWithPreview;
    });

    this.selectedFiles = [...this.selectedFiles, ...newFiles];
  }

  // Manejar drop de archivos
  onFileDrop(event: any) {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    const files: FileWithPreview[] = Array.from(fileList).map((file: any) => {
      const fileWithPreview = file as FileWithPreview;
      fileWithPreview.objectURL = URL.createObjectURL(file);
      return fileWithPreview;
    });

    if (files.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...files];

      // Actualizar files del fileUpload (solo los objetos File originales)
      const originalFiles: File[] = files.map((f) => f as File);
      this.fileUpload.files = [...this.fileUpload.files, ...originalFiles];
    }
  }

  // Eliminar archivo pendiente
  removeFile(file: FileWithPreview) {
    // Liberar el objectURL para evitar memory leaks
    if (file.objectURL) {
      URL.revokeObjectURL(file.objectURL);
    }

    const index = this.selectedFiles.indexOf(file);
    if (index > -1) {
      this.selectedFiles.splice(index, 1);

      // Actualizar files del fileUpload (filtrar por referencia)
      this.fileUpload.files = this.fileUpload.files.filter((f: File) => f !== file);
    }
  }

  // Eliminar archivo completado
  removeUploadedFile(file: FileWithPreview) {
    if (file.objectURL) {
      URL.revokeObjectURL(file.objectURL);
    }

    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  // Subir archivos
  uploadFiles() {
    if (this.selectedFiles.length > 0) {
      // Aquí iría la lógica de subida al servidor
      this.uploadedFiles = [...this.uploadedFiles, ...this.selectedFiles];
      this.selectedFiles = [];
      this.fileUpload.clear();
    }
  }

  // Cerrar modal
  closeForm() {
    this.VisibilityFile = false;
    this.visibleChangeFile.emit(false);

    // Limpiar todos los objectURLs para evitar memory leaks
    [...this.selectedFiles, ...this.uploadedFiles].forEach((file: any) => {
      if (file.objectURL) {
        URL.revokeObjectURL(file.objectURL);
      }
    });

    this.selectedFiles = [];
    this.uploadedFiles = [];

    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }
}
