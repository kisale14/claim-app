import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { ServicesClaim } from '../../services/services-claim.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-claim',
  imports: [
    DialogModule,
    ButtonModule,
    DatePickerModule,
    InputMaskModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './form-claim.html',
  styleUrl: './form-claim.css',
  providers: [MessageService],
})
export class FormClaim {
  @Input() VisibilityForm: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  private messageService = inject(MessageService);

  claimForm!: FormGroup;

  date: Date | undefined;
  visible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private servicesClaim: ServicesClaim,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  closeForm() {
    this.visibleChange.emit(false);
  }

  private initForm() {
    this.claimForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      identification: ['', Validators.required],
      phone: ['', Validators.required],
      date: [new Date(), Validators.required],
      mount: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.claimForm.valid) {
      this.servicesClaim.formatClaimObject(this.claimForm.value);
      this.claimForm.reset(); // Borra los datos del formulario
      this.closeForm();
    } else {
      // Marcar todos los campos como tocados para mostrar errores de validación
      Object.keys(this.claimForm.controls).forEach((key) => {
        this.claimForm.get(key)?.markAsTouched();
      });
      console.log('❌ Formulario inválido. Por favor, complete todos los campos requeridos.');
      this.showError();
    }
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error al enviar datos', detail: 'Por favor, revise los campos del formulario.' });
  }
}
