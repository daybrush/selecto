import styled from "css-styled";

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
] as const;

export const PROPERTIES = [
    "selectableTargets",
    "selectByClick",
    "selectFromInside",
    "continueSelect",
    "toggleContinueSelect",
    "keyContainer",
    "hitRate",
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
] as const;

/**
 * @memberof Selecto
 */
export const METHODS = [
    "click",
    "setSelectedTargets",
] as const;
