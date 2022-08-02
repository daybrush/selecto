import VanillaSelecto, { METHODS, SelectoMethods, SelectoOptions } from 'selecto';
import { withMethods, MethodInterface } from 'framework-utils';
import { NgxSelectoComponent } from './ngx-selecto.component';
import { NgxSelectoEvents } from './types';

export class NgxSelectoInterface {
  @withMethods(METHODS as any)
  protected selecto!: VanillaSelecto;
}
export interface NgxSelectoInterface extends MethodInterface<SelectoMethods, VanillaSelecto, NgxSelectoComponent>, SelectoOptions, NgxSelectoEvents {}
