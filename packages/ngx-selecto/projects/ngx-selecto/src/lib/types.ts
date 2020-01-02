import { EventEmitter } from '@angular/core';
import { SelectoEvents } from 'selecto';

export type NgxSelectoEvents = {
  [key in keyof SelectoEvents]: EventEmitter<SelectoEvents[key]>
};
