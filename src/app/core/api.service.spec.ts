import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { Item } from './models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('pide la marca a GET /api/brand', () => {
    let result: string | undefined;
    service.getBrand().subscribe((b) => (result = b.text));

    const req = httpMock.expectOne('/api/brand');
    expect(req.request.method).toBe('GET');
    req.flush({ text: 'VEKTOR' });

    expect(result).toBe('VEKTOR');
  });

  it('crea items con POST /api/items', () => {
    const created: Item = { id: 1, name: 'demo', description: null };
    let result: Item | undefined;
    service.createItem({ name: 'demo' }).subscribe((i) => (result = i));

    const req = httpMock.expectOne('/api/items');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'demo' });
    req.flush(created);

    expect(result).toEqual(created);
  });

  it('borra items con DELETE /api/items/:id', () => {
    service.deleteItem(7).subscribe();

    const req = httpMock.expectOne('/api/items/7');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
