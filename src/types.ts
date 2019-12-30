import { IObject } from "@daybrush/utils";
import { PROPERTIES } from "./consts";

export interface SelectoOptions {
    target: HTMLElement | null;
    container: HTMLElement | null;
    dragContainer: Element;
    selectableTargets: Array<HTMLElement | string>;
    selectByClick: boolean;
    selectOutside: boolean;
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

export interface OnSelect {
    selected: Array<HTMLElement | SVGElement>;
    added: Array<HTMLElement | SVGElement>;
    removed: Array<HTMLElement | SVGElement>;
    inputEvent: any;
}

export interface OnSelectEnd extends OnSelect {
    afterAdded: Array<HTMLElement | SVGElement>;
    afterRemoved: Array<HTMLElement | SVGElement>;
}

export interface OnDragEvent {
    datas: IObject<any>;
    clientX: number;
    clientY: number;
    inputEvent: any;
}
export type SelectoProperties = { [P in typeof PROPERTIES[number]]: SelectoOptions[P] };
