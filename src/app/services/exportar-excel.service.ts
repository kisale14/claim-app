import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportarExcel {
  /**
   * Exporta datos a un archivo Excel con formato profesional
   * @param datos - Array de objetos a exportar
   * @param nombreArchivo - Nombre del archivo sin extensión
   * @param tituloReporte - Título opcional para el reporte
   */
  async exportarDatos(
    datos: any[],
    nombreArchivo: string = 'reporte',
    tituloReporte?: string,
  ): Promise<void> {
    // Crear libro de trabajo
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sistema Gestor';
    workbook.lastModifiedBy = 'Sistema';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Agregar hoja de trabajo
    const worksheet = workbook.addWorksheet('Datos');

    // Si hay título, agregarlo
    if (tituloReporte) {
      worksheet.mergeCells('A1', this.getLetraColumna(datos[0]) + '1');
      const titleRow = worksheet.getRow(1);
      titleRow.getCell(1).value = tituloReporte;
      titleRow.getCell(1).font = {
        bold: true,
        size: 16,
        color: { argb: 'FF2C3E50' },
      };
      titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
      titleRow.height = 30;
    }

    // Definir encabezados de columna
    const columnas = Object.keys(datos[0] || {});

    // Configurar columnas
    worksheet.columns = columnas.map((col) => ({
      header: this.formatearHeader(col),
      key: col,
      width: this.calcularAncho(datos, col),
    }));

    // Aplicar estilo a los encabezados
    const headerRow = worksheet.getRow(tituloReporte ? 2 : 1);
    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        size: 12,
        color: { argb: 'FFFFFFFF' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3498DB' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Agregar datos
    datos.forEach((item, index) => {
      const row = worksheet.addRow(item);

      // Estilo para filas alternas
      if (index % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF2F2F2' },
          };
        });
      }

      // Aplicar bordes a cada celda
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle' };
      });
    });

    // Generar archivo y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    fs.saveAs(blob, `${nombreArchivo}.xlsx`);
  }

  /**
   * Exporta una tabla de reclamos específica
   * @param datos - Array de reclamos
   * @param filtros - Filtros aplicados (opcional)
   */
  async exportarTablaReclamos(datos: any[], filtros?: any): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reclamos');

    // Título del reporte
    worksheet.mergeCells('A1', 'E1');
    const titulo = worksheet.getRow(1);
    titulo.getCell(1).value = 'REPORTE DE RECLAMOS';
    titulo.getCell(1).font = { bold: true, size: 18, color: { argb: 'FF2C3E50' } };
    titulo.getCell(1).alignment = { horizontal: 'center' };
    titulo.height = 35;

    // Fecha de generación
    worksheet.mergeCells('A2', 'E2');
    const fechaRow = worksheet.getRow(2);
    fechaRow.getCell(1).value = `Fecha de generación: ${new Date().toLocaleString()}`;
    fechaRow.getCell(1).font = { italic: true, color: { argb: 'FF7F8C8D' } };
    fechaRow.getCell(1).alignment = { horizontal: 'right' };

    // Filtros aplicados (si existen)
    if (filtros) {
      worksheet.mergeCells('A3', 'E3');
      const filtrosRow = worksheet.getRow(3);
      let filtrosTexto = 'Filtros: ';
      if (filtros.reclamo) filtrosTexto += `Reclamo: ${filtros.reclamo} `;
      if (filtros.status) filtrosTexto += `Status: ${filtros.status} `;
      filtrosRow.getCell(1).value = filtrosTexto;
      filtrosRow.getCell(1).font = { italic: true, color: { argb: 'FF7F8C8D' } };
    }

    // Definir columnas
    worksheet.columns = [
      { header: 'N° Reclamo', key: 'reclamo', width: 20 },
      { header: 'Cliente', key: 'cliente', width: 25 },
      { header: 'Documento', key: 'documento', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 15 },
    ];

    // Estilo para encabezados
    const headerRow = worksheet.getRow(4);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE67E22' }, // Naranja
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { horizontal: 'center' };
    });

    // Agregar datos
    datos.forEach((item, index) => {
      const row = worksheet.addRow({
        reclamo: item.reclamo || 'N/A',
        cliente: item.cliente || 'N/A',
        documento: item.documento || 'N/A',
        status: item.status || 'N/A',
        fecha: item.fecha ? new Date(item.fecha).toLocaleDateString() : 'N/A',
      });

      // Colorear según status
      const statusCell = row.getCell('status');
      switch (item.status) {
        case 'Activo':
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF27AE60' } };
          statusCell.font = { color: { argb: 'FFFFFFFF' } };
          break;
        case 'Pendiente':
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF39C12' } };
          statusCell.font = { color: { argb: 'FFFFFFFF' } };
          break;
        case 'Completado':
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2980B9' } };
          statusCell.font = { color: { argb: 'FFFFFFFF' } };
          break;
        case 'Inactivo':
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE74C3C' } };
          statusCell.font = { color: { argb: 'FFFFFFFF' } };
          break;
      }

      // Bordes para todas las celdas
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle' };
      });
    });

    // Generar y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    fs.saveAs(blob, `reclamos_${new Date().getTime()}.xlsx`);
  }

  /**
   * Método genérico para exportar cualquier tabla
   * @param worksheet - Hoja de trabajo
   * @param datos - Datos a exportar
   */
  private agregarDatosConFormato(worksheet: ExcelJS.Worksheet, datos: any[]): void {
    datos.forEach((item, index) => {
      const row = worksheet.addRow(item);

      if (index % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9F9F9' },
          };
        });
      }
    });
  }

  /**
   * Formatea un header de columna
   */
  private formatearHeader(header: string): string {
    return header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1');
  }

  /**
   * Calcula el ancho óptimo de una columna
   */
  private calcularAncho(datos: any[], columna: string): number {
    const maxLength = Math.max(...datos.map((item) => String(item[columna] || '').length));
    return Math.min(50, Math.max(10, maxLength + 5));
  }

  /**
   * Obtiene la letra de la columna según el índice
   */
  private getLetraColumna(item: any): string {
    const numColumnas = Object.keys(item).length;
    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    return letras[numColumnas - 1] || 'J';
  }
}
