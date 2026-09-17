import { Component } from '@angular/core';

/**
 * Componente de pantalla de carga.
 * Su visibilidad es controlada externamente por el componente padre
 * mediante *ngIf="isLoading" sobre el selector <app-loading>.
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.html',
  styleUrls: ['./loading.css']
})
export class Loading {}
