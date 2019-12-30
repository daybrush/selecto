import { IObject } from "@daybrush/utils";
import { PROPERTIES, METHODS } from "./consts";
import Selecto from "./Selecto";
import { OnDragStart } from "@daybrush/drag";

/**
 * @memberof Selecto
 * @typedef
 * @property - Selection Element to apply for framework (private)
 * @property - The container to add a selection element for vanilla
 * @property - The area to drag selection element (default: container)
 * @property - Targets to select. You can register a queryselector or an Element. (default: [])
 * @property - Whether to select by click (default: true)
 * @property - Whether to select from the target inside (default: true)
 * @property - After the select, whether to select the next target with the selected target (deselected if the target is selected again). (default: false)
 * @property - The rate at which the target overlaps the drag area to be selected. (default: 100)
 */
export interface SelectoOptions {
    target: HTMLElement | null;
    container: HTMLElement | null;
    dragContainer: Element;
    selectableTargets: Array<HTMLElement | string>;
    selectByClick: boolean;
    selectFromInside: boolean;
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

/**
 * @memberof Selecto
 * @typedef
 * @property - Selection Element to apply for framework (private)
 * @property - added
 * @property - removed
 * @property - inputEvent
 */
export interface OnSelect {
    selected: Array<HTMLElement | SVGElement>;
    added: Array<HTMLElement | SVGElement>;
    removed: Array<HTMLElement | SVGElement>;
    inputEvent: any;
}
/**
 * @memberof Selecto
 * @extends Selecto.OnSelect
 * @typedef
 * @property - afterAdded
 * @property - afterRemoved
 * @property - isDragStart
 */
export interface OnSelectEnd extends OnSelect {
    afterAdded: Array<HTMLElement | SVGElement>;
    afterRemoved: Array<HTMLElement | SVGElement>;
    isDragStart: boolean;
}

export interface OnDragEvent {
    datas: IObject<any>;
    clientX: number;
    clientY: number;
    inputEvent: any;
}

export interface SelectoEvents {
    dragStart: OnDragStart;
    selectStart: OnSelect;
    select: OnSelect;
    selectEnd: OnSelectEnd;
}
export type SelectoProperties = { [P in typeof PROPERTIES[number]]: SelectoOptions[P] };
export type SelectoMethods = { [P in typeof METHODS[number]]: Selecto[P] };
