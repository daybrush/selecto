import {
  Component, ElementRef,
  AfterViewInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, Input, Output, EventEmitter,
} from '@angular/core';
import VanillaSelecto, {
  CLASS_NAME, OPTIONS, SelectoOptions, PROPERTIES, EVENTS,
} from 'selecto';
import { ANGULAR_SELECTO_INPUTS, ANGULAR_SELECTO_OUTPUTS } from './consts';
import { NgxSelectoInterface } from './ngx-selecto.interface';

@Component({
  selector: 'ngx-selecto',
  template: `
    <div [class]="selectionClassName" #el></div>
  `,
  inputs: ANGULAR_SELECTO_INPUTS,
  outputs: ANGULAR_SELECTO_OUTPUTS,
  styles: []
})
export class NgxSelectoComponent
  extends NgxSelectoInterface
  implements OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('el', { static: false }) elRef!: ElementRef;

  public selectionClassName = CLASS_NAME;

  constructor() {
    super();
    EVENTS.forEach(name => {
      (this as any)[name] = new EventEmitter();
    });
  }


  ngAfterViewInit(): void {
    const options: Partial<SelectoOptions> = {};

    OPTIONS.forEach(name => {
      if (name in this) {
        (options as any)[name] = this[name];
      }
    });
    this.selecto = new VanillaSelecto({
      ...options,
      portalContainer: this.elRef.nativeElement,
    });

    const selecto = this.selecto;

    EVENTS.forEach(name => {
      selecto.on(name, e => {
        this[name].emit(e as any);
      });
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    const selecto = this.selecto;

    if (!selecto) {
      return;
    }
    for (const name in changes) {
      if (PROPERTIES.indexOf(name as any) < -1) {
        continue;
      }
      const { previousValue, currentValue } = changes[name];

      if (previousValue === currentValue) {
        continue;
      }
      (selecto as any)[name] = currentValue;
    }
  }
  ngOnDestroy() {
    this.selecto.destroy();
  }
}
