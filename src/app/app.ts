import { Component } from '@angular/core';

import { Items } from './items/items';
import { VektorTitle } from './vektor-title/vektor-title';

@Component({
  selector: 'app-root',
  imports: [VektorTitle, Items],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
