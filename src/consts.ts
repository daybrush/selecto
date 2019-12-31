/**
 * @memberof Selecto
 */
export const PROPERTIES = [
    "selectableTargets",
    "continueSelect",
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
