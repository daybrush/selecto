/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";
import { SelectoMethods, SelectoOptions, SelectoEvents } from "selecto";

export type SvelteSelectoEvents = {
    [key in keyof SelectoEvents]: CustomEvent<SelectoEvents[key]>;
}
export default class SelectoComponent extends SvelteComponentTyped<
    SelectoOptions,
    SvelteSelectoEvents
> { }

export default interface SelectoComponent extends SelectoMethods {
}

export * from "selecto";
