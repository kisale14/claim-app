import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoMonto',
})
export class FormatoMontoPipe implements PipeTransform {
  // Agregar parámetro opcional 'enCentimos' con valor por defecto true
  transform(value: string | number, enCentimos: boolean = true): string {
    if (!value && value !== 0) return '';

    let numero: number;

    if (typeof value === 'string') {
      // Caso 1: String con formato europeo (ej: "1.200,50" o "1.200,00")
      if (value.includes(',') || (value.includes('.') && !value.includes(','))) {
        // Para formato europeo: eliminar puntos (miles) y cambiar coma por punto
        const valorLimpio = value
          .replace(/\./g, '') // Eliminar puntos (separadores de miles)
          .replace(',', '.'); // Cambiar coma decimal por punto
        numero = parseFloat(valorLimpio);

        // Si enCentimos es true, asumimos que el valor está en céntimos
        if (enCentimos) {
          numero = numero / 100;
        }
      }
      // Caso 2: String con formato americano (ej: "1,200.50")
      else if (value.includes(',')) {
        // Para formato americano: eliminar comas (miles)
        const valorLimpio = value.replace(/,/g, '');
        numero = parseFloat(valorLimpio);

        // Si enCentimos es true, asumimos que el valor está en céntimos
        if (enCentimos) {
          numero = numero / 100;
        }
      }
      // Caso 3: String numérico simple (ej: "120000")
      else {
        // Asegurarse de que sea un número válido
        const valorLimpio = value.replace(/[^\d]/g, '');
        numero = parseFloat(valorLimpio);

        // Si enCentimos es true, dividir entre 100
        if (enCentimos) {
          numero = numero / 100;
        }
      }
    } else {
      // Si es número
      numero = value;

      // Si enCentimos es true, dividir entre 100
      if (enCentimos) {
        numero = value / 100;
      }
    }

    // Validar que sea un número válido
    if (isNaN(numero)) return '';

    // Formatear con punto como separador de miles y coma como decimal
    return numero.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  }
}
