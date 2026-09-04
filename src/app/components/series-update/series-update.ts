import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Serie } from '../../models/serie.model';
import { SeriesService } from '../../services/series.service';

/**
 * Componente responsable de la vista y la interaccion para la actualizacion de series.
 */
@Component({
  selector: 'app-series-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './series-update.html',
  styleUrls: ['./series-update.css'],
})
export class SeriesUpdate implements OnInit {
  query: string = '';
  series: Serie[] = [];
  resultados: Serie[] = [];
  seleccionadas: string[] = [];
  historial: { idSerie: string; estadoAnterior: 'Activo' | 'Inactivo'; nuevoEstado: 'Activo' | 'Inactivo' }[] = [];
  haBuscado: boolean = false;

  /**
   * Constructor del componente.
   * @param seriesService Servicio que maneja la logica principal de las series.
   */
  constructor(private seriesService: SeriesService) {}

  /**
   * Metodo de inicializacion del ciclo de vida de Angular.
   * Inicializa la lista de resultados vacia por defecto.
   */
  ngOnInit() {
    this.series = this.seriesService.getSeries();
    this.resultados = [];
    this.haBuscado = false;
  }

  /**
   * Realiza la busqueda utilizando el termino de entrada.
   * Limpia las selecciones previas tras buscar.
   * @param query Termino a buscar.
   */
  buscar(query: string) {
    if (query && query.trim() !== '') {
      this.haBuscado = true;
      this.resultados = this.seriesService.buscarSeriesCoincidencia(query);
    } else {
      this.haBuscado = false;
      this.resultados = [];
    }
    // Limpiamos las selecciones previas al realizar una nueva busqueda
    this.seleccionadas = [];
  }

  /**
   * Solicita confirmacion y, si el usuario acepta, cambia el estado de una unica serie a Activo.
   * @param idSerie Identificador de la serie.
   */
  confirmarCambioUna(idSerie: string) {
    const confirmado = window.confirm(
      `¿Está seguro de que desea regresar la serie "${idSerie}" al estado Activo?`
    );
    if (confirmado) {
      this.cambiarEstadoUna(idSerie, 'Activo');
    }
  }

  /**
   * Cambia el estado de una unica serie y guarda un registro en el historial.
   * @param idSerie Identificador de la serie.
   * @param nuevoEstado Nuevo estado seleccionado.
   */
  cambiarEstadoUna(idSerie: string, nuevoEstado: 'Activo' | 'Inactivo') {
    const serie = this.series.find(s => s.idSerie === idSerie);
    if (serie && serie.Estado !== nuevoEstado) {
      this.historial.push({ idSerie, estadoAnterior: serie.Estado, nuevoEstado });
      this.seriesService.cambiarEstadoSerie(idSerie, nuevoEstado);
    }
  }

  /**
   * Solicita confirmacion y, si el usuario acepta, regresa a Activo todas las series seleccionadas.
   */
  confirmarCambioLote() {
    const cantidad = this.seleccionadas.length;
    const confirmado = window.confirm(
      `¿Está seguro de que desea regresar ${cantidad} serie(s) seleccionada(s) al estado Activo?`
    );
    if (confirmado) {
      this.seleccionadas.forEach(idSerie => this.cambiarEstadoUna(idSerie, 'Activo'));
      console.log(`${cantidad} series actualizadas a Activo`);
    }
  }

  /**
   * Añade o elimina una serie de la lista temporal de seleccionadas.
   * @param idSerie Identificador de la serie.
   * @param checked Estado de seleccion del checkbox.
   */
  toggleSeleccion(idSerie: string, checked: boolean) {
    if (checked) {
      if (!this.seleccionadas.includes(idSerie)) {
        this.seleccionadas.push(idSerie);
      }
    } else {
      this.seleccionadas = this.seleccionadas.filter(id => id !== idSerie);
    }
  }

  /**
   * Selecciona o deselecciona todas las series en la tabla actual.
   * @param checked Estado de seleccion del checkbox principal.
   */
  toggleSeleccionTodos(checked: boolean) {
    if (checked) {
      this.seleccionadas = this.resultados.map(s => s.idSerie);
    } else {
      this.seleccionadas = [];
    }
  }

  /**
   * Limpia toda la pantalla para iniciar un nuevo proceso.
   */
  limpiarTodo() {
    this.query = '';
    this.resultados = [];
    this.seleccionadas = [];
    this.historial = [];
    this.haBuscado = false;
  }
}
