import { SelectoEvents, SelectoOptions } from "selecto";

export interface ReactSelectoEventNames {
    onSelectStart: "selectStart";
    onSelect: "select";
    onSelectEnd: "selectEnd";
    onDragStart: "dragStart";
    onDrag: "drag";
    onDragEnd: "dragEnd";
    onKeydown: "keydown";
    onKeyup: "keyup";
    onScroll: "scroll";
}
export type SelectoEventProps = {
    [key in keyof ReactSelectoEventNames]: (e: SelectoEvents[ReactSelectoEventNames[key]]) => any;
};
export type SelectoProps = SelectoOptions & SelectoEventProps;
