/**
 * Representa la estructura de datos de una Serie en la aplicacion.
 */
export interface Serie {
  /** Identificador unico de la serie. */
  idSerie: string;
  /** Identificador del producto asociado a la serie. */
  idProducto: string;
  /** Descripcion o nombre del producto. */
  descripcionProducto: string;
  /** Estado actual de la serie. Puede ser 'Activo' o 'Inactivo'. */
  Estado: 'Activo' | 'Inactivo';
}
