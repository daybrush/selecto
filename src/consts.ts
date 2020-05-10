import styled from "css-styled";
import { SelectoOptions } from "./types";

export const injector = styled(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    z-index: 100;
}
`);

/**
 * @memberof Selecto
 */
export const CLASS_NAME = `selecto-selection ${injector.className}`;

/**
 * @memberof Selecto
 */
export const OPTIONS = [
    // ignore target, container,
    "dragContainer",
    "selectableTargets",
    "selectByClick",
    "selectFromInside",
    "continueSelect",
    "toggleContinueSelect",
    "keyContainer",
    "hitRate",
    "scrollOptions",
] as const;

export const OPTION_TYPES: { [key in keyof SelectoOptions]: any } = {
    target: null,
    container: null,
    dragContainer: null,
    selectableTargets: Array,
    selectByClick: Boolean,
    selectFromInside: Boolean,
    continueSelect: Boolean,
    toggleContinueSelect: Array,
    keyContainer: null,
    hitRate: Number,
    scrollOptions: Object,
};

export const PROPERTIES = [
    "selectableTargets",
    "selectByClick",
    "selectFromInside",
    "continueSelect",
    "toggleContinueSelect",
    "keyContainer",
    "hitRate",
    "scrollOptions",
] as const;

/**
 * @memberof Selecto
 */
export const EVENTS = [
    "dragStart",
    "selectStart",
    "select",
    "selectEnd",
    "keydown",
    "keyup",
    "scroll",
] as const;

/**
 * @memberof Selecto
 */
export const METHODS = [
    "clickTarget",
    "setSelectedTargets",
    "triggerDragStart",
] as const;
