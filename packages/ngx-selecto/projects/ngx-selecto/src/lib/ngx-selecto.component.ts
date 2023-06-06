import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  EventEmitter,
  NgZone,
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import VanillaSelecto, {
  CLASS_NAME,
  OPTIONS,
  SelectoOptions,
  PROPERTIES,
  EVENTS,
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
})
export class NgxSelectoComponent
  extends NgxSelectoInterface
  implements OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('el', { static: true }) elRef!: ElementRef<HTMLElement>;

  public selectionClassName = CLASS_NAME;

  private destroy$ = new Subject<void>();

  constructor(private ngZone: NgZone) {
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

    this.selecto = this.ngZone.runOutsideAngular(() => new VanillaSelecto({
      ...options,
      portalContainer: this.elRef.nativeElement,
    }));

    const selecto = this.selecto;

    EVENTS.forEach(name => {
      fromEvent(selecto, name).pipe(takeUntil(this.destroy$)).subscribe(event => {
        const emitter = this[name];
        if (emitter && (emitter.observed || emitter.observers.length > 0)) {
          this.ngZone.run(() => emitter.emit(event as any));
        }
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
    this.destroy$.next();
    this.selecto.destroy();
  }
}
