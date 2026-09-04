import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeriesUpdate } from "./components/series-update/series-update";

@Component({
  selector: 'app-root',
  imports: [SeriesUpdate],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ds_SeriesRetail');
}
