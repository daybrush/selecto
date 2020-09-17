import VanillaSelecto, { SelectoMethods, SelectoOptions } from "selecto";
import { SvelteComponentDev } from "svelte/internal";
import { MethodInterface } from "framework-utils";

export default class SelectoComponent<T={}> extends SvelteComponentDev {
    $$prop_def: SelectoOptions & T;
    getInstance(): VanillaSelecto;
}
export default interface SelectoComponent extends MethodInterface<SelectoMethods, VanillaSelecto, SelectoComponent> {
}

export * from "selecto";
