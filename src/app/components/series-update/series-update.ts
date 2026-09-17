import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Serie } from '../../models/serie.model';
import { SeriesService } from '../../services/series.service';
import { Loading } from "../loading/loading";

/**
 * Componente responsable de la vista y la interaccion para la actualizacion de series.
 */
@Component({
  selector: 'app-series-update',
  standalone: true,
  imports: [CommonModule, FormsModule, Loading],
  templateUrl: './series-update.html',
  styleUrls: ['./series-update.css'],
})
export class SeriesUpdate implements OnInit {
  /** Indica si hay una peticion o proceso en curso, usado para mostrar el spinner de carga. */
  isLoading: boolean = false;
  /** El texto de busqueda introducido por el usuario para filtrar las series. */
  query: string = '';
  /** Arreglo que almacena la lista de series obtenidas desde la API. */
  resultados: Serie[] = [];
  /** Arreglo que contiene los identificadores de las series que han sido seleccionadas mediante los checkboxes. */
  seleccionadas: string[] = [];
  /** Registro historico local de los cambios de estado aplicados durante la sesion actual, para mantener la persistencia visual tras recargas. */
  historial: { idSerie: string; estadoAnterior: 'Activo' | 'Inactivo'; nuevoEstado: 'Activo' | 'Inactivo'; usuarioModifico: string }[] = [];
  /** Bandera que indica si el usuario ya ha realizado al menos una busqueda valida. */
  haBuscado: boolean = false;

  /** Cantidad maxima de resultados a mostrar y seleccionar de forma masiva en la vista. */
  limiteResultados: number = 10;
  /** Opciones disponibles para modificar la cantidad maxima de resultados en la vista. */
  opcionesLimite = [5, 10, 20, 50, 100];

  /**
   * Inicializa el componente.
   * @param seriesService Servicio para ejecutar llamadas a la API de series.
   * @param cdr Referencia al detector de cambios de Angular.
   */
  constructor(private seriesService: SeriesService, private cdr: ChangeDetectorRef) {}

  /**
   * Metodo del ciclo de vida de Angular ejecutado al inicializarse el componente.
   * Se encarga de reiniciar las variables principales al cargar la vista.
   */
  ngOnInit() {
    this.resultados = [];
    this.haBuscado = false;
  }

  /**
   * Realiza la busqueda utilizando el termino de entrada y la API, mapea y normaliza los resultados devueltos por el backend.
   * @param query Cadena de texto que sirve como parametro para buscar coincidencias.
   */
  buscar(query: string) {
    this.isLoading = true;

    if (query && query.trim() !== '') {
      this.haBuscado = true;
      this.seriesService.buscarSeriesCoincidencia(query).subscribe({
        next: (res: any) => {
          try {
            // Asegurarnos de que estamos trabajando con un array
            let arreglo: any[] = [];
            if (Array.isArray(res)) {
              arreglo = res;
            } else if (res && typeof res === 'object') {
              // Si la API envuelve la respuesta (ej. { data: [...] } o { value: [...] })
              const propArray = Object.values(res).find(val => Array.isArray(val));
              if (propArray) {
                arreglo = propArray as any[];
              } else {
                arreglo = [res];
              }
            } else if (res) {
              arreglo = [res];
            }

            // Limpiar del historial las series que NO estan en los resultados actuales
            const idsEnResultados = arreglo.map(item => item.id_Serie || item.idSerie || item.IdSerie || '');
            this.historial = this.historial.filter(h => idsEnResultados.includes(h.idSerie));

            // Normalizar las propiedades basadas en lo que envía la API
            const normalizados: Serie[] = arreglo.map(item => {
              // Convertir estado numérico a texto (asumiendo 1 = Activo, otros = Inactivo)
              let estadoTexto: 'Activo' | 'Inactivo' = 'Inactivo';
              if (item.estado === 1 || item.Estado === 1 || item.estado === 'Activo' || item.Estado === 'Activo') {
                estadoTexto = 'Activo';
              } else if (item.estado === 2 || item.Estado === 2 || item.estado === 'Inactivo' || item.Estado === 'Inactivo') {
                estadoTexto = 'Inactivo';
              }

              const idSerie = item.id_Serie || item.idSerie || item.IdSerie || '';
              
              // Extraer si tiene usuario de modificacion para restaurar el historial visual
              const usuarioModificacion = item.m_UserName || item.m_username || item.M_UserName || item.usuarioModificacion || '';
              if (usuarioModificacion && usuarioModificacion.trim() !== '') {
                const existeEnHistorial = this.historial.some(h => h.idSerie === idSerie);
                if (!existeEnHistorial) {
                  // Inferir que si ahora es Activo, antes era Inactivo, y viceversa
                  const estadoAnterior = estadoTexto === 'Activo' ? 'Inactivo' : 'Activo';
                  this.historial.push({
                    idSerie: idSerie,
                    estadoAnterior: estadoAnterior,
                    nuevoEstado: estadoTexto,
                    usuarioModifico: usuarioModificacion
                  });
                }
              }

              return {
                idSerie: idSerie,
                idProducto: item.producto_Id || item.idProducto || item.IdProducto || '',
                descripcionProducto: item.descripcion || item.descripcionProducto || item.DescripcionProducto || '',
                Estado: estadoTexto
              };
            });

            // Re-aplicar los estados del historial a los resultados entrantes
            this.resultados = normalizados.map(serie => {
              const hist = this.historial.slice().reverse().find(h => h.idSerie === serie.idSerie);
              if (hist) {
                serie.Estado = hist.nuevoEstado;
              }
              return serie;
            });
            
            this.ordenarResultados();
          } catch (e) {
            console.error('Error al procesar los datos de la API:', e);
            this.resultados = [];
          } finally {
            this.seleccionadas = [];
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Error fetching series', err);
          this.resultados = [];
          this.seleccionadas = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.haBuscado = false;
      this.resultados = [];
      this.seleccionadas = [];
      
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 300);
    }
  }

  /**
   * Ordena los resultados para que las series con cambios recientes (aquellas en el historial) aparezcan de primeras en la lista.
   */
  ordenarResultados() {
    this.resultados.sort((a, b) => {
      const aCambiado = this.historial.some(h => h.idSerie === a.idSerie) ? 1 : 0;
      const bCambiado = this.historial.some(h => h.idSerie === b.idSerie) ? 1 : 0;
      return bCambiado - aCambiado; 
    });
  }

  /**
   * Muestra un dialogo de confirmacion para modificar el estado de una unica serie al estado "Activo".
   * Si el usuario confirma, invoca el metodo cambiarEstadoUna.
   * @param idSerie Identificador de la serie a la cual se le cambiara el estado.
   */
  async confirmarCambioUna(idSerie: string) {
    const confirmado = window.confirm(
      `¿Está seguro de que desea regresar la serie "${idSerie}" al estado Activo?`
    );
    if (confirmado) {
      await this.cambiarEstadoUna(idSerie, 'Activo');
    }
  }

  /**
   * Modifica el estado de una serie especifica enviando la solicitud a la API y actualizando el historial y la vista.
   * @param idSerie El identificador unico de la serie a actualizar.
   * @param nuevoEstado El estado al cual se desea cambiar la serie (Activo o Inactivo).
   */
  async cambiarEstadoUna(idSerie: string, nuevoEstado: 'Activo' | 'Inactivo') {
    const serie = this.resultados.find(s => s.idSerie === idSerie);
    if (serie && serie.Estado !== nuevoEstado) {
      this.isLoading = true;
      this.cdr.detectChanges();
      
      const modelo = {
        id_Serie: idSerie,
        m_UserName: 'SOPORTE01',
        m_Fecha_Hora: new Date().toISOString()
      };

      try {
        await firstValueFrom(this.seriesService.actualizarEstadoSerie(modelo));
        this.historial.push({ idSerie, estadoAnterior: serie.Estado, nuevoEstado, usuarioModifico: 'SOPORTE01' });
        serie.Estado = nuevoEstado;
        this.ordenarResultados();
      } catch (err) {
        console.error('Error al actualizar el estado de la serie', err);
        alert(`Error al actualizar la serie ${idSerie}.`);
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }
  }

  /**
   * Muestra un dialogo de confirmacion para modificar el estado de todas las series seleccionadas en el lote.
   * Al confirmar, procesa cada seleccion de manera asincrona.
   */
  async confirmarCambioLote() {
    const cantidad = this.seleccionadas.length;
    const confirmado = window.confirm(
      `¿Está seguro de que desea regresar ${cantidad} serie(s) seleccionada(s) al estado Activo?`
    );
    if (confirmado) {
      this.isLoading = true;
      this.cdr.detectChanges();
      
      for (const idSerie of this.seleccionadas) {
        await this.cambiarEstadoUnaSilencioso(idSerie, 'Activo');
      }
      
      this.ordenarResultados();
      this.seleccionadas = [];
      this.isLoading = false;
      this.cdr.detectChanges();
      console.log(`${cantidad} series procesadas`);
    }
  }

  /**
   * Realiza la operacion de actualizacion de estado sin lanzar alertas por cada exito, util para operaciones por lotes.
   * Modifica el historial y el estado del objeto serie en memoria si la peticion es exitosa.
   * @param idSerie Identificador unico de la serie a actualizar.
   * @param nuevoEstado El estado al cual se desea cambiar la serie (Activo o Inactivo).
   */
  async cambiarEstadoUnaSilencioso(idSerie: string, nuevoEstado: 'Activo' | 'Inactivo') {
    const serie = this.resultados.find(s => s.idSerie === idSerie);
    if (serie && serie.Estado !== nuevoEstado) {
      const modelo = {
        id_Serie: idSerie,
        m_UserName: 'SOPORTE01',
        m_Fecha_Hora: new Date().toISOString()
      };

      try {
        await firstValueFrom(this.seriesService.actualizarEstadoSerie(modelo));
        this.historial.push({ idSerie, estadoAnterior: serie.Estado, nuevoEstado, usuarioModifico: 'SOPORTE01' });
        serie.Estado = nuevoEstado;
      } catch (err) {
        console.error(`Error al actualizar la serie ${idSerie}`, err);
      }
    }
  }

  /**
   * Alterna la seleccion individual de una serie utilizando un checkbox en la vista.
   * Agrega o remueve el identificador de la serie en el arreglo de seleccionadas.
   * @param idSerie Identificador unico de la serie interactuada.
   * @param checked Estado del checkbox (verdadero si se marco, falso si se desmarco).
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
   * Alterna la seleccion masiva de todas las series actualmente visibles en la pagina.
   * Si se marca, selecciona hasta el limite de resultados permitidos, caso contrario limpia la seleccion.
   * @param checked Estado del checkbox principal (verdadero si se marco, falso si se desmarco).
   */
  toggleSeleccionTodos(checked: boolean) {
    if (checked) {
      // Solo seleccionar los que están visibles según el límite
      const visibles = this.resultados.slice(0, this.limiteResultados);
      this.seleccionadas = visibles.map(s => s.idSerie);
    } else {
      this.seleccionadas = [];
    }
  }

  /**
   * Limpia el formulario completo, incluyendo la busqueda, el historial y las selecciones previas,
   * restaurando el componente a su estado inicial por defecto.
   */
  limpiarTodo() {
    this.query = '';
    this.resultados = [];
    this.seleccionadas = [];
    this.historial = [];
    this.haBuscado = false;
  }
}
