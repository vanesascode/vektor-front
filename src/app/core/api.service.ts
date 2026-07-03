import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Brand, Item, ItemCreate } from './models';

/**
 * Cliente HTTP del backend. Todas las rutas son relativas (/api/...):
 * en local las resuelve el dev-proxy de Angular (proxy.conf.json) y en
 * Azure el Nginx del contenedor, de modo que el front nunca conoce la
 * URL absoluta del backend.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getBrand(): Observable<Brand> {
    return this.http.get<Brand>(`${this.baseUrl}/brand`);
  }

  listItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/items`);
  }

  createItem(item: ItemCreate): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/items`, item);
  }

  updateItem(id: number, item: ItemCreate): Observable<Item> {
    return this.http.put<Item>(`${this.baseUrl}/items/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${id}`);
  }
}
