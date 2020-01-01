import { SelectoProps } from "react-selecto/declaration/types";
import Preact, { Component } from "preact";
import VanillaSelecto, { SelectoMethods } from "selecto";
import { MethodInterface } from "framework-utils";

export default class PreactSelecto extends Component<Partial<SelectoProps>> {
    public render(): any;
}
export default interface PreactSelecto extends MethodInterface<SelectoMethods, VanillaSelecto, PreactSelecto> {} {}
