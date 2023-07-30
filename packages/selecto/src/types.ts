import { IObject } from "@daybrush/utils";
import { PROPERTIES, METHODS } from "./consts";
import Selecto from "./Selecto";
import {
    OnDragStart as OnParentDragStart,
    OnDrag as OnParentDrag,
    OnDragEnd as OnParentDragEnd,
} from "gesto";
import { DragScrollOptions } from "@scena/dragscroll";

export type ElementType = HTMLElement | SVGElement;
export interface ElementRef<T> {
    current?: T | undefined | null;
    value?: T | undefined | null;
}
/**
 * @memberof Selecto
 * @typedef
 */
export interface SelectoOptions {
    /**
     * The container to add a selection element for vanilla
     */
    container: HTMLElement | null;
    /**
     * Selecto's root container (No transformed container.)
     * @dfeault null
     */
    rootContainer: HTMLElement | null;
    /**
     * The area to drag selection element.
     * @default container
     */
    dragContainer: Element | Window | Element[] | string | null | undefined;
    /**
     * custom class name of selecto element
     * @default ""
     */
    className: string;
    /**
     * Targets to select. You can register a queryselector or an Element.
     * @default []
     */
    selectableTargets: Array<ElementType | string | (() => ElementType | ElementType[]) | ElementRef<ElementType>>;
    /**
     * Whether to select from the target inside (If hitTest is 0, it becomes inside select as well)
     * @default true
     */
    selectFromInside: boolean;
    /**
     * Whether to force drag end when selectFromInside, selectByClick is true.
     * @default false
     */
    selectByClick: boolean;
    /**
     * When the target is clicked, the event is stopped and selected. (If hitTest is 0, it becomes click as well.)
     * @default true
     */
    preventDragFromInside: boolean;
    /**
     * Whether to click when mouse(touch) ends while using selectByClick(true)
     * @default false
     */
    clickBySelectEnd: boolean;
    /**
     * After the select, whether to select the next target with the selected target (deselected if the target is selected again)
     * @default false
     */
    continueSelect: boolean;
    /**
     * Whether to continue the previously selected items without deselect when using `continueSelect` or `toggleContinueSelect`.
     * @default false
     */
    continueSelectWithoutDeselect: boolean;
    /**
     * Determines which key to continue selecting the next target via keydown and keyup.
     * The initially set `continueSelect` value is the inactive(keyup) value.
     */
    toggleContinueSelect: string[][] | string[] | string | null;
    /**
     * Determines which key to continue selecting the next target without deselect via keydown and keyup.
     * The initially set `continueSelectWithoutDeselect` value is the inactive(keyup) value.
     */
    toggleContinueSelectWithoutDeselect: string[][] | string[] | string | null;
    /**
     * The container for keydown and keyup events.
     */
    keyContainer: Document | HTMLElement | Window | null;
    /**
     * The rate at which the target overlaps the drag area to be selected. If you want an absolute number, set it to a px value. (ex: 10px)
     * @default 100
     */
    hitRate: number | string | ((element: Element) => number | string);
    /**
     * Container to bound the selection area. If false, do not bound. If true, it is the container of selecto.
     * @default false
     */
    boundContainer: BoundContainer | boolean | HTMLElement | string | null;
    /**
     * Set the scroll options, time, etc. to automatically scroll by dragging.
     * @default null
     */
    scrollOptions: DragScrollOptions;
    /**
     * Set the inner scroll options, time, etc. to automatically scroll by dragging.
     * @default null
     */
    innerScrollOptions: boolean | Partial<DragScrollOptions>;
    /**
     * hecks whether this is an element to input text or contentEditable, and prevents dragging.
     * @default false
     */
    checkInput: boolean;
    /**
     * When dragging, preventDefault is called. (Touch occurs unconditionally)
     * @default false
     */
    preventDefault: boolean;
    /**
     * add nonce property to style for CSP
     * @default ""
     */
    cspNonce: string;
    /**
     * Adjust the ratio of the selection.
     * @default 0
     */
    ratio: number;
    /**
     * A function to get the exact position of an element's rect
     * @default null
     */
    getElementRect: getElementRectFunction;
    /**
     * Conditional function to start dragging
     * @default null
     */
    dragCondition: ((e: OnParentDragStart) => boolean) | null;
    /**
     * Prevent click event on drag. (mousemove, touchmove)
     * @default false
     */
    preventClickEventOnDrag?: boolean;
    /**
     * Prevent click event on dragStart. (mousedown, touchstart)
     * @default false
     */
    preventClickEventOnDragStart?: boolean;
    /**
     * Prevent click event according to specific conditions.
     * Returning true allows the click event, returning false prevents it.
     * @default null
     */
    preventClickEventByCondition?: ((e: MouseEvent) => boolean) | null;
    /**
     * Whether to prevent dragging of the right mouse button
     * @default true
     */
    preventRightClick?: boolean;
    /**
     * Selection Element to apply for framework.
     * @private
     */
    portalContainer: HTMLElement | null;
    /**
     * Inspect the overflow area and exclude the outside target from the select.
     * @default false
     */
    checkOverflow: boolean;
}
/**
 * @memberof Selecto
 * @typedef
 */
export interface BoundContainer {
    element: HTMLElement | string | boolean;
    left?: boolean;
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
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
    width: number;
    height: number;
}

export interface InnerParentInfo {
    parentElement: HTMLElement;
    points: number[][];
    indexes: number[];
    paths: Element[];
}

export interface Point {
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
}
/**
 * @memberof Selecto
 * @typedef
 */
export interface CurrentTarget<T = Selecto> {
    /**
     * An Selecto instance itself
     */
    currentTarget: T;
}

/**
 * @memberof Selecto
 * @typedef
 */
export interface SelectedTargets {
    /**
     * before selecting elements
     */
    beforeSelected: Array<HTMLElement | SVGElement>;
    /**
     * selected elements
     */
    selected: Array<HTMLElement | SVGElement>;
    /**
     * added elements
     */
    added: Array<HTMLElement | SVGElement>;
    /**
     * removed elements
     */
    removed: Array<HTMLElement | SVGElement>;
}
/**
 * @memberof Selecto
 * @extends Selecto.SelectedTargets
 * @typedef
 */
export interface SelectedTargetsWithRect extends SelectedTargets {
    /**
     * Rect of Selection Element
     */
    rect: Rect;
}

/**
 * @memberof Selecto
 * @extends Selecto.CurrentTarget
 * @extends Selecto.SelectedTargetsWithRect
 * @typedef
 */
export interface OnSelectEvent<T = Selecto> extends CurrentTarget<T>, SelectedTargetsWithRect {
    /**
     * inputEvent
     */
    inputEvent: any;
    /**
     * Data shared from dragStart, selectStart to dragEnd, selectEnd
     */
    data: Record<string, any>;
    /**
     * Whether it ends as soon as dragStart(mousedown, touchstart)
     */
    isDragStartEnd: boolean;
    /**
     * Whether or not you directly dragged
     */
    isTrusted: boolean;
}
/**
 * @memberof Selecto
 * @extends Selecto.OnSelectEvent
 * @typedef
 */
export interface OnSelect<T = Selecto> extends OnSelectEvent<T> {
    /**
     * start selected elements
     */
    startSelected: Array<HTMLElement | SVGElement>;
    /**
     * added from start selected
     */
    startAdded: Array<HTMLElement | SVGElement>;
    /**
     * removed from start selected
     */
    startRemoved: Array<HTMLElement | SVGElement>;
}
/**
 * @memberof Selecto
 * @extends Selecto.OnSelectEvent
 * @typedef
 */
export interface OnSelectEnd<T = Selecto> extends OnSelectEvent<T> {
    /**
     * start selected elements
     */
    startSelected: Array<HTMLElement | SVGElement>;
    /**
     * after added elements
     */
    afterAdded: Array<HTMLElement | SVGElement>;
    /**
     * after removed elements
     */
    afterRemoved: Array<HTMLElement | SVGElement>;
    /**
     * Whether it is a mousedown or touchstart event
     */
    isDragStart: boolean;
    /**
     * Whether it ends as soon as dragStart(mousedown, touchstart)
     */
    isDragStartEnd: boolean;
    /**
     * Whether it is click
     */
    isClick: boolean;
    /**
     * Wheter it is double click or double start
     */
    isDouble: boolean;
}

export interface OnDragEvent {
    datas: IObject<any>;
    data: IObject<any>;
    clientX: number;
    clientY: number;
    deltaX: number;
    deltaY: number;
    distX: number;
    distY: number;
    isMouseEvent: boolean;
    isSecondaryButton: boolean;
    isClick?: boolean;
    isDouble?: boolean;
    inputEvent: any;
    isTrusted: boolean;
}
export interface OnKeyEvent<T = Selecto> extends CurrentTarget<T> {
    keydownContinueSelect: boolean;
    keydownContinueSelectWithoutDeselection: boolean;
}
export interface OnScroll {
    container: HTMLElement;
    direction: number[];
}
/**
 * @memberof Selecto
 * @typedef
 * @property - Stop all events
 */
export interface OnDragStart<T = Selecto> extends OnParentDragStart<T> {
    stop(): void;
    isClick: boolean;
}

/**
 * @memberof Selecto
 * @typedef
 * @property - Rect of Selection Element
 * @property - Whether it is in select
 */
export interface OnDrag<T = Selecto> extends OnParentDrag<T> {
    rect: Rect;
    isSelect: boolean;
}
/**
 * @memberof Selecto
 * @typedef
 * @property - Rect of Selection Element
 * @property - Whether it is in select
 */
export interface OnDragEnd<T = Selecto> extends OnParentDragEnd<T> {
    rect: Rect;
    isSelect: boolean;
}
export interface SelectoEvents {
    dragStart: OnDragStart;
    drag: OnDrag;
    dragEnd: OnDragEnd;
    selectStart: OnSelect;
    select: OnSelect;
    selectEnd: OnSelectEnd;
    keydown: OnKeyEvent;
    keyup: OnKeyEvent;
    scroll: OnScroll;
    innerScroll: OnScroll;
}
export type SelectoProperties = { [P in typeof PROPERTIES[number]]: SelectoOptions[P] };
export type SelectoMethods = { [P in typeof METHODS[number]]: Selecto[P] };
export type getElementRectFunction = (el: HTMLElement | SVGElement) => PointArea;
export interface PointArea {
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
}


export interface InnerGroup {
    targets: Array<HTMLElement | SVGElement>;
    points: number[][][];
    inners: boolean[];
}
