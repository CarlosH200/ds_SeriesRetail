import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Serie } from '../models/serie.model';
import { urlApi } from '../providers/api.providers';

/**
 * Modelo utilizado para enviar los datos de actualizacion de estado de una serie al backend.
 */
export interface UpdateSeriesModel {
  /** Identificador unico de la serie que se va a actualizar. */
  id_Serie: string;
  /** Nombre del usuario que realiza la accion de actualizacion. */
  m_UserName: string;
  /** Fecha y hora exacta en la que se realiza la operacion (formato ISO). */
  m_Fecha_Hora: string;
}

/**
 * Servicio encargado de la logica de negocio y peticiones HTTP para la gestion de las series.
 */
@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  /** URL base para los endpoints de consulta de series. */
  private apiUrl = `${urlApi.apiServer.urlBase}Series`;
  /** URL base para los endpoints de actualizacion de series. */
  private updateApiUrl = `${urlApi.apiServer.urlBase}UpdateSeries`;

  /**
   * Constructor del servicio de series.
   * @param http Cliente HTTP para realizar peticiones al backend.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de series que coinciden con el termino de busqueda.
   * @param query Cadena de texto a buscar (pSerieProducto).
   * @returns Un Observable que emite un arreglo de objetos de tipo Serie.
   */
  buscarSeriesCoincidencia(query: string): Observable<Serie[]> {
    return this.http.get<Serie[]>(`${this.apiUrl}?pSerieProducto=${query}`);
  }

  /**
   * Envia una peticion para actualizar el estado de una serie especifica.
   * @param modelo Objeto con los datos necesarios para la actualizacion (ID, usuario, fecha).
   * @returns Un Observable con la respuesta generada por el backend.
   */
  actualizarEstadoSerie(modelo: UpdateSeriesModel): Observable<any> {
    return this.http.put(`${this.updateApiUrl}/estado`, modelo);
  }
}
