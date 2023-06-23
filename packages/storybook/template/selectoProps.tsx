import { makeArgType, makeOptionLink } from "./utils";

export const SELECTO_PROPS = {
    ratio: makeArgType({
        type: "number",
        description: makeOptionLink("ratio"),
        defaultValue: 0,
    }),
    hitRate: makeArgType({
        type: "number",
        description: makeOptionLink("hitRate"),
        defaultValue: 0,
    }),
    selectByClick: makeArgType({
        type: "boolean",
        description: makeOptionLink("selectByClick"),
        defaultValue: true,
    }),
    selectFromInside: makeArgType({
        type: "boolean",
        description: makeOptionLink("selectFromInside"),
        defaultValue: false,
    }),
    toggleContinueSelect: makeArgType({
        type: "array",
        description: makeOptionLink("toggleContinueSelect"),
        defaultValue: ["shift"],
    }),
}
