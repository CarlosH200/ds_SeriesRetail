import { Injectable } from '@angular/core';
import { Serie } from '../models/serie.model';

/**
 * Proveedor de datos de las series.
 * Mantiene la lista de datos duros que actuan como fuente de verdad inicial.
 */
@Injectable({
  providedIn: 'root'
})
export class SeriesProvider {
  private series: Serie[] = [
    // Producto con varias series similares
    { idSerie: '100001', idProducto: 'P001', descripcionProducto: 'Laptop Dell Latitude 5420', Estado: 'Activo' },
    { idSerie: '100002', idProducto: 'P001', descripcionProducto: 'Laptop Dell Latitude 5420', Estado: 'Activo' },
    { idSerie: '100003', idProducto: 'P001', descripcionProducto: 'Laptop Dell Latitude 5420', Estado: 'Inactivo' },
    { idSerie: '100004', idProducto: 'P001', descripcionProducto: 'Laptop Dell Latitude 5420', Estado: 'Activo' },
    { idSerie: '100005', idProducto: 'P001', descripcionProducto: 'Laptop Dell Latitude 5420', Estado: 'Inactivo' },

    // Monitores
    { idSerie: '200001', idProducto: 'P002', descripcionProducto: 'Monitor HP 24" LED', Estado: 'Activo' },
    { idSerie: '200002', idProducto: 'P002', descripcionProducto: 'Monitor HP 24" LED', Estado: 'Inactivo' },
    { idSerie: '200003', idProducto: 'P003', descripcionProducto: 'Monitor Dell UltraSharp 27"', Estado: 'Activo' },
    { idSerie: '200004', idProducto: 'P003', descripcionProducto: 'Monitor Dell UltraSharp 27"', Estado: 'Activo' },
    { idSerie: '200005', idProducto: 'P003', descripcionProducto: 'Monitor Dell UltraSharp 27"', Estado: 'Inactivo' },

    // Impresoras
    { idSerie: '300001', idProducto: 'P004', descripcionProducto: 'Impresora HP LaserJet Pro M404dn', Estado: 'Activo' },
    { idSerie: '300002', idProducto: 'P004', descripcionProducto: 'Impresora HP LaserJet Pro M404dn', Estado: 'Inactivo' },
    { idSerie: '300003', idProducto: 'P005', descripcionProducto: 'Impresora Epson EcoTank L3250', Estado: 'Activo' },
    { idSerie: '300004', idProducto: 'P005', descripcionProducto: 'Impresora Epson EcoTank L3250', Estado: 'Activo' },
    { idSerie: '300005', idProducto: 'P005', descripcionProducto: 'Impresora Epson EcoTank L3250', Estado: 'Inactivo' },

    // POS
    { idSerie: '400001', idProducto: 'P006', descripcionProducto: 'POS Terminal Verifone VX520', Estado: 'Activo' },
    { idSerie: '400002', idProducto: 'P006', descripcionProducto: 'POS Terminal Verifone VX520', Estado: 'Activo' },
    { idSerie: '400003', idProducto: 'P006', descripcionProducto: 'POS Terminal Verifone VX520', Estado: 'Inactivo' },
    { idSerie: '400004', idProducto: 'P007', descripcionProducto: 'POS Ingenico Desk/5000', Estado: 'Activo' },
    { idSerie: '400005', idProducto: 'P007', descripcionProducto: 'POS Ingenico Desk/5000', Estado: 'Inactivo' },

    // Impresoras TMU
    { idSerie: '500001', idProducto: 'P008', descripcionProducto: 'Impresora Epson TM-U220', Estado: 'Activo' },
    { idSerie: '500002', idProducto: 'P008', descripcionProducto: 'Impresora Epson TM-U220', Estado: 'Activo' },
    { idSerie: '500003', idProducto: 'P008', descripcionProducto: 'Impresora Epson TM-U220', Estado: 'Inactivo' },
    { idSerie: '500004', idProducto: 'P009', descripcionProducto: 'Impresora Epson TM-T88VI', Estado: 'Activo' },
    { idSerie: '500005', idProducto: 'P009', descripcionProducto: 'Impresora Epson TM-T88VI', Estado: 'Inactivo' },

    // Otros productos de hardware
    { idSerie: '600001', idProducto: 'P010', descripcionProducto: 'Servidor Dell PowerEdge R740', Estado: 'Activo' },
    { idSerie: '600002', idProducto: 'P010', descripcionProducto: 'Servidor Dell PowerEdge R740', Estado: 'Inactivo' },
    { idSerie: '600003', idProducto: 'P011', descripcionProducto: 'Switch Cisco Catalyst 2960', Estado: 'Activo' },
    { idSerie: '600004', idProducto: 'P011', descripcionProducto: 'Switch Cisco Catalyst 2960', Estado: 'Activo' },
    { idSerie: '600005', idProducto: 'P011', descripcionProducto: 'Switch Cisco Catalyst 2960', Estado: 'Inactivo' },

    // Más hardware
    { idSerie: '700001', idProducto: 'P012', descripcionProducto: 'Router Mikrotik RB4011', Estado: 'Activo' },
    { idSerie: '700002', idProducto: 'P012', descripcionProducto: 'Router Mikrotik RB4011', Estado: 'Inactivo' },
    { idSerie: '700003', idProducto: 'P013', descripcionProducto: 'UPS APC Smart-UPS 1500VA', Estado: 'Activo' },
    { idSerie: '700004', idProducto: 'P013', descripcionProducto: 'UPS APC Smart-UPS 1500VA', Estado: 'Activo' },
    { idSerie: '700005', idProducto: 'P013', descripcionProducto: 'UPS APC Smart-UPS 1500VA', Estado: 'Inactivo' },

    // Periféricos
    { idSerie: '800001', idProducto: 'P014', descripcionProducto: 'Teclado Logitech K120', Estado: 'Activo' },
    { idSerie: '800002', idProducto: 'P014', descripcionProducto: 'Teclado Logitech K120', Estado: 'Inactivo' },
    { idSerie: '800003', idProducto: 'P015', descripcionProducto: 'Mouse Microsoft Bluetooth', Estado: 'Activo' },
    { idSerie: '800004', idProducto: 'P015', descripcionProducto: 'Mouse Microsoft Bluetooth', Estado: 'Activo' },
    { idSerie: '800005', idProducto: 'P015', descripcionProducto: 'Mouse Microsoft Bluetooth', Estado: 'Inactivo' },

    // Más impresoras
    { idSerie: '900001', idProducto: 'P016', descripcionProducto: 'Impresora Canon PIXMA G6020', Estado: 'Activo' },
    { idSerie: '900002', idProducto: 'P016', descripcionProducto: 'Impresora Canon PIXMA G6020', Estado: 'Inactivo' },
    { idSerie: '900003', idProducto: 'P017', descripcionProducto: 'Impresora Brother HL-L2350DW', Estado: 'Activo' },
    { idSerie: '900004', idProducto: 'P017', descripcionProducto: 'Impresora Brother HL-L2350DW', Estado: 'Activo' },
    { idSerie: '900005', idProducto: 'P017', descripcionProducto: 'Impresora Brother HL-L2350DW', Estado: 'Inactivo' },
  ];

  /**
   * Obtiene todas las series base almacenadas.
   * @returns Un arreglo con los datos originales de las series.
   */
  getSeries(): Serie[] {
    return this.series;
  }
}
