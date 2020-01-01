import { SelectoEvents, SelectoOptions } from "selecto";

export interface ReactSelectoEventNames {
    onSelectStart: "selectStart";
    onSelect: "select";
    onSelectEnd: "selectEnd";
    onDragStart: "dragStart";
    onKeydown: "keydown";
    onKeyup: "keyup";
}
export type SelectoEventProps = {
    [key in keyof ReactSelectoEventNames]: (e: SelectoEvents[ReactSelectoEventNames[key]]) => any;
};
export type SelectoProps = SelectoOptions & SelectoEventProps;
