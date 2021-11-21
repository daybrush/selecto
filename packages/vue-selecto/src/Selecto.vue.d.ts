import { MethodInterface } from "framework-utils";
import VanillaSelecto, {
    SelectoMethods,
    SelectoProperties,
} from "selecto";

interface VueSelectoInterface
    extends SelectoProperties,
    MethodInterface<SelectoMethods, VanillaSelecto, VueSelectoInterface> {
    name: string;
    $el: HTMLElement;
    $_selecto: VanillaSelecto;
    $props: SelectoProperties;
}

declare const VueSelecto: VueSelectoInterface;
type VueSelecto = VueSelectoInterface;

export default VueSelecto;
