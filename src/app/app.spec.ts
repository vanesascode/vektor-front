import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('debería crear la app', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debería renderizar la marca servida por el backend', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/api/brand').flush({ text: 'VEKTOR' });
    httpMock.expectOne('/api/items').flush([]);
    fixture.detectChanges();

    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('VEKTOR');
    httpMock.verify();
  });
});
