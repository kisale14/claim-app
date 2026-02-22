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
import { PdfGeneratorService } from '../../services/pdf-generator-service.service';
import { claimModel } from '../../../model/claimModel';

interface City {
  name: string;
  code: string;
}

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

  cities!: City[];
  selectedCity: City | undefined;

  numberClaim: string = '';
  selectedClaim: claimModel | null = null;
  selectedPhoneCode: string = '+58412';

  selectedTipoAutorizador: any;
  selectedEstadoAutorizador: any;

  private messageService = inject(MessageService);

  claimForm!: FormGroup;

  logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';

  date: Date | undefined;
  visible: boolean = false;
  tiposAutorizador!: { nombre: string; codigo: string }[];
  tiposInstrumento!: { nombre: string; codigo: string }[];
  tiposReclamos!: { nombre: string; codigo: string }[];
  tiposCanal!: { nombre: string; codigo: string }[];
  tiposMotivo!: { nombre: string; codigo: string }[];

  constructor(
    private fb: FormBuilder,
    private servicesClaim: ServicesClaim,
    private pdfService: PdfGeneratorService,
  ) {}

  ngOnInit() {
    this.initForm();
    this.cities = [
      { name: 'Narutal (V)', code: 'Narutal (V)' },
      { name: 'Extranjero (E)', code: 'Extranjero (E)' },
      { name: 'Jurídico (J)', code: 'Jurídico (J)' },
      { name: 'Gubernamental (G)', code: 'Gubernamental (G)' },
      { name: 'Pasaporte (P)', code: 'Pasaporte (P)' },
    ];
    this.tiposAutorizador = [
      { nombre: 'Sede Central', codigo: 'Sede Central' },
      { nombre: 'Lido', codigo: 'Lido' },
      { nombre: 'Recreo', codigo: 'Recreo' },
      { nombre: 'Las Delicias', codigo: 'Las Delicias' },
      { nombre: 'Valle Frio', codigo: 'Valle Frio' },
      { nombre: 'Barquisimeto', codigo: 'Barquisimeto' },
      { nombre: 'Porlamar', codigo: 'Porlamar' },
      { nombre: 'El Viñedo', codigo: 'El Viñedo' },
      { nombre: 'Oficina Central', codigo: 'Oficina Central' },
    ];
    this.tiposInstrumento = [
      { nombre: 'Tarjeta de Credito', codigo: 'Tarjeta de Credito' },
      { nombre: 'Tarjeta Debito', codigo: 'Tarjeta Debito' },
      { nombre: 'Tarjeta Prepagada', codigo: 'Tarjeta Prepagada' },
      { nombre: 'Caja de Seguridad', codigo: 'Caja de Seguridad' },
      { nombre: 'Bonos de la Deuda Publica', codigo: 'Bonos de la Deuda Publica' },
      { nombre: 'Operaciones Cambiarias', codigo: 'Operaciones Cambiarias' },
      { nombre: 'Depositos a Plazo Fijo', codigo: 'Depositos a Plazo Fijo' },
      { nombre: 'Cuenta Corriente', codigo: 'Cuenta Corriente' },
      { nombre: 'Cuenta Ahorro', codigo: 'Cuenta Ahorro' },
      { nombre: 'Fideicomiso', codigo: 'Fideicomiso' },
      { nombre: 'Microcredito', codigo: 'Microcredito' },
      { nombre: 'Atencion al Cliente', codigo: 'Atencion al Cliente' },
    ];
    this.tiposReclamos = [
      { nombre: 'Presunto Pago Indebido', codigo: 'Presunto Pago Indebido' },
      { nombre: 'Monto Cargado y No dispensado en ATM', codigo: 'Monto Cargado y No dispensado en ATM' },
      { nombre: 'Debitos no Reconocidos', codigo: 'Debitos no Reconocidos' },
      { nombre: 'Consumos o Montos no reconocidos', codigo: 'Consumos o Montos no reconocidos' },
      { nombre: 'Presunto Robo o Hurto', codigo: 'Presunto Robo o Hurto' },
      { nombre: 'Tasas, Tarifas y Comisiones', codigo: 'Tasas, Tarifas y Comisiones' },
      { nombre: 'Atencial indebida al Publico', codigo: 'Atencial indebida al Publico' },
      { nombre: 'Cuenta Corriente', codigo: 'Cuenta Corriente' },
      { nombre: 'Transferencia no Acreditada', codigo: 'Transferencia no Acreditada' },
      { nombre: 'Pago Movil Fallido', codigo: 'Pago Movil Fallido' },
    ];
    this.tiposCanal = [
      { nombre: 'ATM', codigo: 'ATM' },
      { nombre: 'POS', codigo: 'POS' },
      { nombre: 'Internet Banking', codigo: 'Internet Banking' },
      { nombre: 'IVR', codigo: 'IVR' },
      { nombre: 'Pago Movil', codigo: 'Pago Movil' },
      { nombre: 'Banca Movil', codigo: 'Banca Movil' },
      { nombre: 'Oficina Y/O Agencia', codigo: 'Oficina Y/O Agencia' },
    ];
    this.tiposMotivo = [
      { nombre: 'Transaccion Fallida', codigo: 'Transaccion Fallida' },
      { nombre: 'Consumo Duplicado', codigo: 'Consumo Duplicado' },
      { nombre: 'Consumo no Reconocido', codigo: 'Consumo no Reconocido' },
      { nombre: 'Transferencias a otros bancos no acreditada', codigo: 'Transferencias a otros bancos no acreditada' },
      { nombre: 'Transferencias a otros bancos no reconocida', codigo: 'Transferencias a otros bancos no reconocida' },
      { nombre: 'Transferencias a otros bancos no duplicadas', codigo: 'Transferencias a otros bancos no duplicadas' },
      { nombre: 'Transferencias propias no Acreditada', codigo: 'Transferencias propias no Acreditada' },
      { nombre: 'Transferencias propias no reconocida', codigo: 'Transferencias propias no reconocida' },
      { nombre: 'Transferencias propias duplicadas', codigo: 'Transferencias propias duplicadas' },
      { nombre: 'Pago Movil no exitoso', codigo: 'Pago Movil no exitoso' },
      { nombre: 'Pago Movil no acreditado', codigo: 'Pago Movil no acreditado' },
      { nombre: 'Pago Movil duplicado', codigo: 'Pago Movil duplicado' },
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idClaim']) {
      this.handleIdClaimChange(changes['idClaim'].currentValue);
    }
  }

  generarPDF(claimData: claimModel) {
    this.pdfService.exportarFormatoPDFPrueba(claimData);
  }

  private handleIdClaimChange(newId: number) {
    if (newId > 0) {
      this.servicesClaim.getClaimById(newId).subscribe((claim) => {
        if (claim) {
          this.selectedClaim = claim;
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

  onActionSelected(event: any): void {
    const selectedValue = event.target.value;
    const selectedText = event.target.options[event.target.selectedIndex].text;

    this.servicesClaim.updateClaimStatus(this.selectedClaim!.id, parseInt(selectedValue));

    this.closeForm();
  }

  loadDataForm(claimData: claimModel) {
    this.claimForm.patchValue({
      id: claimData.id,
      name: claimData.clientName,
      identification: claimData.identification,
      phone: claimData.phone,
      date: claimData.dateTransaction,
      mount: claimData.mountTr,
    });
  }

  closeForm() {
    this.visibleChange.emit(false);
  }

  private initForm() {
    this.claimForm = this.fb.group({
      id: [],
      ente: ['', Validators.required],
      name: ['', Validators.required],
      identification: ['', Validators.required],
      typeClient: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      direction: ['', Validators.required],
      agencyChannel: ['', Validators.required],
      description: ['', Validators.required],
      numberCount: ['0169', Validators.required],
      numberCard: ['', Validators.required],
      dateTransaction: [new Date(), Validators.required],
      mountTr: ['0.00', Validators.required],
      instrumentTr: ['', Validators.required],
      typeClaim: ['', Validators.required],
      channelTr: ['', Validators.required],
      reasonTr: ['', Validators.required],
      referenceTr: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.claimForm.valid) {
      const formData = this.claimForm.value;
      const mountClean = formData.mountTr.replace(/,/g, '').replace(/\./g, '');
      formData.mountTr = mountClean;
      const res = this.servicesClaim.formatClaimObject(formData);

      if (res.result.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'El reclamo ha sido guardado exitosamente.',
        });
        console.log(res.claim);
        this.generarPDF(res.claim);
        this.closeForm();
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos.',
      });
      const formData = this.claimForm.value;
      const mountClean = formData.mountTr.replace(/,/g, '').replace(/\./g, '');
      formData.mount = mountClean;
      console.log(formData);
      console.log('Formulario inválido');
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
      this.claimForm.get('mountTr')?.setValue('0.00', { emitEvent: false });
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
    this.claimForm.get('mountTr')?.setValue(formattedValue, { emitEvent: false });

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
    const control = this.claimForm.get('mountTr');
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
    const control = this.claimForm.get('mountTr');
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
