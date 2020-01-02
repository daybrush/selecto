import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSelectoComponent } from './ngx-selecto.component';

describe('NgxSelectoComponent', () => {
  let component: NgxSelectoComponent;
  let fixture: ComponentFixture<NgxSelectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxSelectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSelectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
