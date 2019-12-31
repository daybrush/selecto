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
    "dragContainer",
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
