import { TestBed } from '@angular/core/testing';

import { NgxSelectoService } from './ngx-selecto.service';

describe('NgxSelectoService', () => {
  let service: NgxSelectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSelectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
