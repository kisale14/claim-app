import { Component, Input, Output, EventEmitter, inject, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { ServicesClaim } from '../../services/services-claim.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Claim } from '../../../model/claim';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputText } from "primeng/inputtext";

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
    CommonModule,
    SelectModule,
  ],
  templateUrl: './form-claim.html',
  styleUrl: './form-claim.css',
  providers: [MessageService],
})
export class FormClaim {
  @Input() VisibilityForm: boolean = false;
  @Input() idClaim: number = 0;
  @Output() visibleChange = new EventEmitter<boolean>();

  numberClaim: string = '';
  selectedPhoneCode: string = '+58412';

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idClaim']) {
      this.handleIdClaimChange(changes['idClaim'].currentValue);
    }
  }

  private handleIdClaimChange(newId: number) {
    if (newId > 0) {
      this.servicesClaim.getClaimById(newId).subscribe((claim) => {
        if (claim) {
          this.numberClaim = claim.claimNumber;
          this.loadDataForm(claim);
        }
      });
    } else {
      if (this.claimForm) {
        this.claimForm.reset();
        this.claimForm.patchValue({ date: new Date() });
      }
    }
  }

  loadDataForm(claimData: Claim) {
    this.claimForm.patchValue({
      id: claimData.id,
      name: claimData.name,
      identification: claimData.identification,
      phone: claimData.phone,
      date: claimData.dateOfIncident,
      mount: claimData.mount,
    });
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
      mount: ['0.00', Validators.required],
    });
  }

  submitForm() {
    if (this.claimForm.valid) {
      // Obtener el valor actual del teléfono (solo números, sin guión)
      const phoneNumber = this.claimForm.get('phone')?.value || '';

      // Crear el teléfono completo uniendo código + número
      const fullPhone = this.selectedPhoneCode + phoneNumber;

      // Crear una copia de los valores del formulario
      const formValue = { ...this.claimForm.value };

      // Reemplazar phone con el valor completo
      formValue.phone = fullPhone;

      // 1. El servicio hace su trabajo y devuelve resultado
      const { claim, result } = this.servicesClaim.formatClaimObject(formValue);

      // 2. Mostrar mensaje según el resultado
      if (result.success) {
        this.messageService.add({
          severity: 'success',
          summary: '✅ Reclamo guardado',
          detail: `Reclamo creado correctamente`,
        });

        // Resetear el formulario
        this.claimForm.reset({
          date: new Date(),
          mount: '0.00',
        });

        // Resetear el código seleccionado al valor por defecto
        this.selectedPhoneCode = '+58412';

        this.closeForm();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: '❌ Error al guardar',
          detail: result.error || 'No se pudo guardar el reclamo',
        });
      }
    } else {
      // Marcar campos inválidos
      Object.keys(this.claimForm.controls).forEach((key) => {
        this.claimForm.get(key)?.markAsTouched();
      });

      this.messageService.add({
        severity: 'error',
        summary: '❌ Formulario inválido',
        detail: 'Por favor complete todos los campos requeridos',
      });
    }
  }

  limitPhoneInput(event: any): void {
    const input = event.target;
    let value = input.value;

    // 1. Eliminar cualquier caracter que no sea número
    value = value.replace(/[^0-9]/g, '');

    // 2. Limitar a máximo 7 dígitos
    if (value.length > 7) {
      value = value.slice(0, 7);
    }

    // 3. Guardar SOLO los números en el formulario
    this.claimForm.get('phone')?.setValue(value, { emitEvent: true });

    // 4. APLICAR FORMATO CON GUIÓN DIRECTAMENTE EN EL DOM
    let displayValue = value;
    if (value.length > 3) {
      displayValue = value.slice(0, 3) + '-' + value.slice(3);
    }

    // 5. Forzar la actualización visual del input
    setTimeout(() => {
      input.value = displayValue;
    }, 0);
  }

  onPhoneCodeChange(selectedValue: string): void {
    this.selectedPhoneCode = selectedValue;
    console.log('Código seleccionado:', selectedValue);
  }

  filterIdentification(event: any) {
    let value = event.target.value;

    // Eliminar cualquier carácter que no sea número
    value = value.replace(/\D/g, '');

    // Eliminar ceros a la izquierda (si hay más de un dígito)
    if (value.length > 1) {
      value = value.replace(/^0+/, '');
    }

    // Limitar a 8 dígitos
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    // Actualizar el valor en el formulario
    this.claimForm.get('identification')?.setValue(value, { emitEvent: false });
  }

  // Función para manejar el ingreso del monto (derecha a izquierda)
  formatMountFromRight(event: any) {
    let value = event.target.value;

    // Guardar la posición del cursor antes de modificar
    const cursorPosition = event.target.selectionStart;

    // Eliminar cualquier carácter que no sea número
    value = value.replace(/\D/g, '');

    // Si no hay valor, mostrar "0.00"
    if (!value || value === '') {
      this.claimForm.get('mount')?.setValue('0.00', { emitEvent: false });
      return;
    }

    // Convertir a número y manejar ceros a la izquierda
    // Queremos que los números se ingresen de derecha a izquierda
    // Ejemplo: si escribo 123, debe ser 1.23, luego 12.34, luego 123.45

    // Asegurar que tenemos al menos 3 dígitos para manejar correctamente
    while (value.length < 3) {
      value = '0' + value;
    }

    // Separar en parte entera y decimal
    // Los últimos 2 dígitos son los decimales
    let decimalPart = value.slice(-2);
    let integerPart = value.slice(0, -2);

    // Eliminar ceros a la izquierda de la parte entera
    integerPart = integerPart.replace(/^0+/, '');

    // Si después de eliminar ceros la parte entera quedó vacía, poner "0"
    if (integerPart === '') {
      integerPart = '0';
    }

    // Formatear la parte entera con separadores de miles
    integerPart = this.formatThousands(integerPart);

    // Construir el valor formateado
    const formattedValue = `${integerPart}.${decimalPart}`;

    // Actualizar el valor en el formulario
    this.claimForm.get('mount')?.setValue(formattedValue, { emitEvent: false });

    // Calcular y establecer la nueva posición del cursor
    setTimeout(() => {
      const newCursorPosition = this.calculateCursorPosition(
        formattedValue,
        cursorPosition,
        value.length,
      );
      event.target.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  }

  // Función para formatear miles
  private formatThousands(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Función para calcular la posición del cursor
  private calculateCursorPosition(
    formattedValue: string,
    originalCursorPos: number,
    rawLength: number,
  ): number {
    // Si es el inicio, mantener el cursor al principio
    if (originalCursorPos <= 0) return 0;

    // Encontrar la posición del cursor en el valor formateado
    // Contar caracteres no numéricos antes de la posición original
    const rawValue = formattedValue.replace(/\D/g, '');
    const cursorInRaw = Math.min(rawLength, rawValue.length);

    // Encontrar la posición en el string formateado que corresponde
    let formattedPos = 0;
    let rawIndex = 0;

    for (let i = 0; i < formattedValue.length; i++) {
      if (rawIndex >= cursorInRaw) {
        formattedPos = i;
        break;
      }
      if (formattedValue[i].match(/\d/)) {
        rawIndex++;
      }
      formattedPos = i + 1;
    }

    return formattedPos;
  }

  // Función para manejar teclas especiales (backspace, delete)
  handleMountKeyDown(event: KeyboardEvent) {
    const control = this.claimForm.get('mount');
    let value = control?.value || '0.00';

    // Eliminar formato para trabajar con números puros
    let rawValue = value.replace(/\D/g, '');

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();

      // Eliminar el último dígito
      if (rawValue.length > 0) {
        rawValue = rawValue.slice(0, -1);
      }

      // Actualizar el valor
      if (rawValue.length === 0) {
        control?.setValue('0.00', { emitEvent: false });
      } else {
        // Asegurar mínimo 3 dígitos
        while (rawValue.length < 3) {
          rawValue = '0' + rawValue;
        }

        let decimalPart = rawValue.slice(-2);
        let integerPart = rawValue.slice(0, -2);

        integerPart = integerPart.replace(/^0+/, '');
        if (integerPart === '') {
          integerPart = '0';
        }

        integerPart = this.formatThousands(integerPart);
        control?.setValue(`${integerPart}.${decimalPart}`, { emitEvent: false });
      }
    }
  }

  // Validación al perder el foco (opcional)
  validateMountOnBlur() {
    const control = this.claimForm.get('mount');
    if (control) {
      let value = control.value;

      // Asegurar formato correcto
      let rawValue = value.replace(/\D/g, '');

      if (rawValue.length === 0) {
        control.setValue('0.00');
      } else {
        while (rawValue.length < 3) {
          rawValue = '0' + rawValue;
        }

        let decimalPart = rawValue.slice(-2);
        let integerPart = rawValue.slice(0, -2);

        integerPart = integerPart.replace(/^0+/, '');
        if (integerPart === '') {
          integerPart = '0';
        }

        integerPart = this.formatThousands(integerPart);
        control.setValue(`${integerPart}.${decimalPart}`);
      }

      control.markAsTouched();
    }
  }
}
