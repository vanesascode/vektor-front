import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ApiService } from '../core/api.service';

/**
 * Renderiza la marca "VEKTOR" a pantalla completa con estética
 * terminal/glitch (inspirada en los títulos de Mr. Robot).
 * El texto NO está hardcodeado: lo sirve el backend en GET /api/brand.
 */
@Component({
  selector: 'app-vektor-title',
  templateUrl: './vektor-title.html',
  styleUrl: './vektor-title.scss',
})
export class VektorTitle {
  private readonly api = inject(ApiService);

  protected readonly brand = toSignal(this.api.getBrand());
}
