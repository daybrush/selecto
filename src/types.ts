import { IObject } from "@daybrush/utils";
import { PROPERTIES } from "./consts";

export interface SelectoOptions {
    target: HTMLElement | null;
    container: HTMLElement | null;
    selectableTargets: Array<HTMLElement | string>;
    selectAfterDrag: boolean;
    continueSelect: boolean;
    hitRate: number;
}

export interface Hypertext {
    tag: string;
    className: string;
    style: IObject<any>;
    attributes: object;
    children: Hypertext[];
}

export interface Rect {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

export type SelectoProperties = { [P in typeof PROPERTIES[number]]: SelectoOptions[P] }
