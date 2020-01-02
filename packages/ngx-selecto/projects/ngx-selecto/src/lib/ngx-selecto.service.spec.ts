import { TestBed } from '@angular/core/testing';

import { NgxSelectoService } from './ngx-selecto.service';

describe('NgxSelectoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxSelectoService = TestBed.get(NgxSelectoService);
    expect(service).toBeTruthy();
  });
});
