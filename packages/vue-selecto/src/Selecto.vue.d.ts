import { MethodInterface } from "framework-utils";
import VanillaSelecto, {
    SelectoMethods,
    SelectoProperties,
} from "selecto";

export default class VueSelecto { }
export default interface VueSelecto
    extends SelectoProperties,
    MethodInterface<SelectoMethods, VanillaSelecto, VueSelecto> {
    $el: HTMLElement;
    $_selecto: VanillaSelecto;
    $props: SelectoProperties;
}
