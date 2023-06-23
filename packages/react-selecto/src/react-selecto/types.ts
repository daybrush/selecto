import { SelectoEvents, SelectoOptions } from "selecto";

export type SelectoEventProps = {
    [key in keyof SelectoEvents as `on${Capitalize<key>}`]: (e: SelectoEvents[key]) => any;
};
export type SelectoProps = SelectoOptions & SelectoEventProps;
