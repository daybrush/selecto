import VanillaSelecto, { SelectoMethods } from "selecto";
import { MethodInterface } from "framework-utils";


interface ComponentOptions {
    target: HTMLElement;
    anchor?: HTMLElement | null;
    props?: {};
    hydrate?: boolean;
    intro?: boolean;
}

interface SelectoComponent extends MethodInterface<SelectoMethods, VanillaSelecto, SelectoComponent> {
    new(options: ComponentOptions): any;
    // client-side methods
    $set(props: {}): void;
    $on(event: string, callback: (event: CustomEvent) => void): void;
    $destroy(): void;
    // server-side methods
    render(props?: {}): {
        html: string;
        css: { code: string; map: string | null };
        head?: string;
    };
}

export default SelectoComponent;
export * from "selecto";
