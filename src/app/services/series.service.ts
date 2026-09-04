import { Injectable } from '@angular/core';
import { Serie } from '../models/serie.model';
import { SeriesProvider } from '../providers/series.provider';

/**
 * Servicio encargado de la logica de negocio para la gestion de las series.
 */
@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private series: Serie[] = [];

  /**
   * Constructor del servicio.
   * @param seriesProvider Dependencia que inyecta los datos base de las series.
   */
  constructor(private seriesProvider: SeriesProvider) {
    this.series = this.seriesProvider.getSeries();
  }

  /**
   * Retorna la referencia a la lista de series en memoria para ser consumida.
   * @returns Arreglo de tipo Serie.
   */
  getSeries(): Serie[] {
    return this.series;
  }

  /**
   * Filtra las series segun el termino ingresado por el usuario.
   * Busca ocurrencias en ID de Serie, Descripcion de Producto e ID de Producto.
   * Si no hay termino de busqueda, retorna un arreglo vacio en lugar de todas las series.
   * @param query Cadena de texto a buscar.
   * @returns Arreglo de tipo Serie con las coincidencias encontradas.
   */
  buscarSeriesCoincidencia(query: string): Serie[] {
    if (!query || query.trim() === '') {
      return [];
    }
    const q = query.toLowerCase();
    return this.series.filter(s =>
      s.idSerie.toLowerCase().includes(q) ||
      s.descripcionProducto.toLowerCase().includes(q) ||
      s.idProducto.toLowerCase().includes(q)
    );
  }

  /**
   * Cambia el estado de una unica serie existente.
   * @param idSerie Identificador de la serie.
   * @param nuevoEstado El estado nuevo a aplicar.
   * @returns Booleano indicando si se aplico correctamente.
   */
  cambiarEstadoSerie(idSerie: string, nuevoEstado: 'Activo' | 'Inactivo'): boolean {
    const serie = this.series.find(s => s.idSerie === idSerie);
    if (serie) {
      serie.Estado = nuevoEstado;
      return true;
    }
    return false;
  }

  /**
   * Actualiza el estado de forma masiva de varias series a la vez.
   * @param idsSeries Arreglo de identificadores de las series.
   * @param nuevoEstado El estado nuevo a aplicar a cada una.
   * @returns Cantidad de series actualizadas.
   */
  cambiarEstadoVariasSeries(idsSeries: string[], nuevoEstado: 'Activo' | 'Inactivo'): number {
    let actualizadas = 0;
    idsSeries.forEach(id => {
      const serie = this.series.find(s => s.idSerie === id);
      if (serie) {
        serie.Estado = nuevoEstado;
        actualizadas++;
      }
    });
    return actualizadas;
  }
}
