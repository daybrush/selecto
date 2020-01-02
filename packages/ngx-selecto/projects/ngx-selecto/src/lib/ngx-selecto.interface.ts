import VanillaSelecto, { METHODS, SelectoMethods } from 'selecto';
import { withMethods, MethodInterface } from 'framework-utils';
import { NgxSelectoComponent } from './ngx-selecto.component';

export class NgxSelectoInterface {
  @withMethods(METHODS as any)
  protected selecto!: VanillaSelecto;
}
export default interface Selecto extends MethodInterface<SelectoMethods, VanillaSelecto, NgxSelectoComponent> {}
