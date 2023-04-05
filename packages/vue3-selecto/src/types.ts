import { SelectoEvents } from "selecto"

export type VueSelectoEvents = {
    [key in keyof SelectoEvents]: (e: SelectoEvents[key]) => void;
};
